import { NextRequest, NextResponse } from 'next/server';
import { deleteUser, getSessionFromRequest, updateUser } from '@/lib/admin/auth';
import type { User } from '@/lib/types';
import { canManageUsers } from '@/lib/admin/permissions';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canManageUsers(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  const updates: Partial<User> = {};
  if (typeof payload.email === 'string') updates.email = payload.email;
  if (typeof payload.name === 'string') updates.name = payload.name;
  if (typeof payload.role === 'string') updates.role = payload.role;
  if (Array.isArray(payload.sites)) updates.sites = payload.sites;

  try {
    const user = await updateUser(params.id, updates);
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canManageUsers(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await deleteUser(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
