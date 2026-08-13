import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Get hostname (e.g. admin.localhost:3000, admin.seedfundin.com)
  const hostname = request.headers.get('host') || '';

  // Check if it's the admin subdomain
  if (hostname.startsWith('admin.')) {
    // Check if the user is authenticated as an admin
    const adminToken = request.cookies.get('admin_session')?.value;
    const isAuthenticated = adminToken === (process.env.ADMIN_SECRET || 'seedfundin_admin_secret_2026');

    // Allow access to the login API route without redirecting
    if (url.pathname.startsWith('/api/admin/login')) {
      return NextResponse.next();
    }

    // Protect all other admin API routes
    if (url.pathname.startsWith('/api/admin') && !isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If not authenticated and trying to access a page other than login, redirect to login
    if (!isAuthenticated && url.pathname !== '/login' && !url.pathname.startsWith('/api/')) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Map public-facing paths to internal Next.js app directory structure
    if (url.pathname === '/' || url.pathname === '/login' || url.pathname.startsWith('/admin-app')) {
      const targetPath = url.pathname === '/' ? '/admin-app' : 
                         url.pathname === '/login' ? '/admin-app/login' : 
                         url.pathname;
      url.pathname = targetPath;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
