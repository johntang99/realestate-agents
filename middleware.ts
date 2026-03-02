// ============================================
// MIDDLEWARE - i18n Routing & Site Detection
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';

// Domain → site_id mapping for production routing
const DOMAIN_SITE_MAP: Record<string, string> = {
  'jinpanghomes.com': 'jinpanghomes',
  'www.jinpanghomes.com': 'jinpanghomes',
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') || '';

  // Set site ID header for domain routing on production
  const siteId = DOMAIN_SITE_MAP[host];
  if (siteId) {
    const response = NextResponse.next();
    response.headers.set('x-site-id', siteId);
    // If no locale prefix, redirect to default
    const pathnameHasLocale = ['en', 'zh'].some(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`);
    if (!pathnameHasLocale && !pathname.startsWith('/admin') && !pathname.startsWith('/api') &&
        !pathname.startsWith('/_next') && !pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|txt|xml)$/)) {
      return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
    }
    return response;
  }
  
  // Admin routes: require auth cookie (verify in API/routes)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Skip middleware for static files, API routes, and admin
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname === '/icon' ||
    pathname.startsWith('/icon/') ||
    pathname === '/apple-icon' ||
    pathname.startsWith('/apple-icon/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }
  
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) {
    return NextResponse.next();
  }
  
  // Redirect to default locale
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (uploaded media)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|uploads).*)',
  ],
};
