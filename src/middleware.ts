import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Check auth state
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Temporarily disabled admin authentication
  // if (request.nextUrl.pathname.startsWith('/admin')) {
  //   if (!session) {
  //     // Not logged in, redirect to login
  //     const redirectUrl = new URL('/login', request.url);
  //     redirectUrl.searchParams.set('redirectAfterLogin', request.nextUrl.pathname);
  //     return NextResponse.redirect(redirectUrl);
  //   }

  //   // Get user metadata which contains the role
  //   const { data: { user } } = await supabase.auth.getUser();
    
  //   if (!user?.user_metadata?.role || !['admin', 'super_admin'].includes(user.user_metadata.role)) {
  //     // Not an admin, redirect to home
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  // }

  return res;
}

export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
  ],
};
