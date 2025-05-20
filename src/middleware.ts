import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session and trying to access protected routes
  if (!session && (
    req.nextUrl.pathname.startsWith('/worker-dashboard') ||
    req.nextUrl.pathname.startsWith('/admin-dashboard')
  )) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // If session exists, check role and redirect if necessary
  if (session) {
    const { data: userData } = await supabase
      .from('workers')
      .select('is_admin, status')
      .eq('email', session.user.email)
      .single()

    if (userData) {
      // If trying to access admin dashboard without admin rights
      if (req.nextUrl.pathname.startsWith('/admin-dashboard') && !userData.is_admin) {
        return NextResponse.redirect(new URL('/worker-dashboard', req.url))
      }

      // If trying to access worker dashboard as admin
      if (req.nextUrl.pathname.startsWith('/worker-dashboard') && userData.is_admin) {
        return NextResponse.redirect(new URL('/admin-dashboard', req.url))
      }

      // If worker account is pending approval
      if (!userData.is_admin && userData.status !== 'approved' && 
          req.nextUrl.pathname.startsWith('/worker-dashboard')) {
        return NextResponse.redirect(new URL('/auth/pending', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/worker-dashboard/:path*', '/admin-dashboard/:path*']
}