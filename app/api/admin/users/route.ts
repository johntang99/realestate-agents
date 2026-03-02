import { NextRequest, NextResponse } from 'next/server';
import { createUser, getSessionFromRequest, listUsers } from '@/lib/admin/auth';
import type { User } from '@/lib/types';
import { canManageUsers } from '@/lib/admin/permissions';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canManageUsers(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  const users = await listUsers();
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canManageUsers(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  const email = payload.email as string | undefined;
  const password = payload.password as string | undefined;
  const name = payload.name as string | undefined;
  const role = payload.role as User['role'] | undefined;
  const sites = (payload.sites as string[] | undefined) || [];

  if (!email || !password || !name || !role) {
    return NextResponse.json(
      { message: 'email, password, name, and role are required' },
      { status: 400 }
    );
  }

  try {
    const user = await createUser(email, password, name, role, sites);
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
