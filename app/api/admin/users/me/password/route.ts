import { NextRequest, NextResponse } from 'next/server';
import { changePassword, getSessionFromRequest } from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const payload = await request.json();
  const currentPassword = payload.currentPassword as string | undefined;
  const newPassword = payload.newPassword as string | undefined;
  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { message: 'currentPassword and newPassword are required' },
      { status: 400 }
    );
  }

  try {
    await changePassword(session.user.id, currentPassword, newPassword);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
