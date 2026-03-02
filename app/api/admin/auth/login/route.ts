import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/admin/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const session = await authenticate(email, password);
    if (!session) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    cookies().set('admin-token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      user: session.user,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error('Login error:', error);
    const errorWithCode = error as Error & { code?: string };
    if (errorWithCode?.code === 'ADMIN_DB_UNAVAILABLE') {
      return NextResponse.json(
        { message: 'Authentication service is temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
