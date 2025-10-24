import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const token = req.auth;
  const path = req.nextUrl.pathname;
  
  console.log('Middleware: Path =', path, 'Authenticated =', !!token);
  
  // Landing page - redirect to dashboard if authenticated
  if (path === '/') {
    if (token) {
      console.log('Middleware: Authenticated user on landing, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    console.log('Middleware: Public landing page, allowing');
    return NextResponse.next();
  }
  
  // Public routes
  if (path.startsWith('/login') || path.startsWith('/register')) {
    console.log('Middleware: Public route, allowing');
    return NextResponse.next();
  }
  
  // Must be authenticated for protected routes
  if (!token) {
    console.log('Middleware: Not authenticated, redirecting to landing page');
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  console.log('Middleware: Authenticated user with role:', token.user?.role);
  
  // Role-based access
  if (path.startsWith('/customers') && 
      token.user?.role !== 'manager') {
    console.log('Middleware: Access denied to customers, redirecting to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  if (path.startsWith('/library') && 
      !['designer', 'engineer', 'manager'].includes(token.user?.role as string)) {
    console.log('Middleware: Access denied to library, redirecting to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  if (path.startsWith('/production') && 
      !['engineer', 'manager', 'production'].includes(token.user?.role as string)) {
    console.log('Middleware: Access denied to production, redirecting to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  console.log('Middleware: Allowing access to', path);
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
