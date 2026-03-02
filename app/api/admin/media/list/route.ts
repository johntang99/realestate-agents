import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { listMedia } from '@/lib/admin/media';
import { canManageMedia, requireSiteAccess } from '@/lib/admin/permissions';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canManageMedia(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const items = await listMedia(siteId);
  return NextResponse.json({ items });
}
