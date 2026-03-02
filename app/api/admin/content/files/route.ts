import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { listContentFiles } from '@/lib/admin/content';
import { requireSiteAccess } from '@/lib/admin/permissions';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  const locale = searchParams.get('locale');
  if (!siteId || !locale) {
    return NextResponse.json(
      { message: 'siteId and locale are required' },
      { status: 400 }
    );
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const files = await listContentFiles(siteId, locale);
  return NextResponse.json({ files });
}
