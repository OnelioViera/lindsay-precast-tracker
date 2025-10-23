import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      
      // Public routes
      if (path.startsWith('/login') || path.startsWith('/register')) {
        return true;
      }
      
      // Must be authenticated
      if (!token) {
        return false;
      }
      
      // Role-based access
      if (path.startsWith('/customers') && 
          token.role !== 'manager') {
        return false;
      }
      
      if (path.startsWith('/library') && 
          ['designer', 'engineer', 'manager'].includes(token.role as string)) {
        return true;
      }
      
      if (path.startsWith('/production') && 
          ['engineer', 'manager', 'production'].includes(token.role as string)) {
        return true;
      }
      
      return true;
    },
  },
});

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
