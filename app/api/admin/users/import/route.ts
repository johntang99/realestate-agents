import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canUseAdminDb, getAdminUserCountDb, upsertAdminUserDb } from '@/lib/admin/usersDb';
import { canManageUsers } from '@/lib/admin/permissions';
import type { User } from '@/lib/types';

const USERS_FILE = path.join(process.cwd(), 'content', '_admin', 'users.json');

interface UserImportRow {
  id?: string;
  email?: string;
  name?: string;
  role?: User['role'];
  sites?: string[];
  avatar?: string;
  passwordHash?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export async function POST(request: NextRequest) {
  if (!canUseAdminDb()) {
    return NextResponse.json(
      { message: 'Supabase service role key is required for import.' },
      { status: 400 }
    );
  }

  const session = await getSessionFromRequest(request);
  if (!session) {
    const existingCount = await getAdminUserCountDb();
    if (existingCount > 0) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
  } else if (!canManageUsers(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    const entries = JSON.parse(raw) as UserImportRow[];

    let imported = 0;
    let skipped = 0;

    for (const entry of entries) {
      if (!entry.email || !entry.name || !entry.role || !entry.passwordHash) {
        skipped += 1;
        continue;
      }
      const user = await upsertAdminUserDb({
        id: entry.id,
        email: entry.email,
        name: entry.name,
        role: entry.role,
        sites: entry.sites || [],
        avatar: entry.avatar || null,
        passwordHash: entry.passwordHash,
        createdAt: entry.createdAt,
        lastLoginAt: entry.lastLoginAt,
      });
      if (user) {
        imported += 1;
      } else {
        skipped += 1;
      }
    }

    return NextResponse.json({ success: true, imported, skipped });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to import users' },
      { status: 500 }
    );
  }
}
