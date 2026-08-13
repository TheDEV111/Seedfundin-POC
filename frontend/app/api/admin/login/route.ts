import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@seedfundin.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2026!';
    const adminSecret = process.env.ADMIN_SECRET || 'seedfundin_admin_secret_2026';

    if (email === adminEmail && password === adminPassword) {
      const response = NextResponse.json({ success: true });
      
      response.cookies.set({
        name: 'admin_session',
        value: adminSecret,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      return response;
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
