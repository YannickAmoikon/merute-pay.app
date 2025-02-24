import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // Cas 1: Pas de token et on essaie d'accéder à une route admin
  if (!authToken && isAdminRoute && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Cas 2: Token présent et on essaie d'accéder au login
  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Cas 3: Token présent et on est sur une route admin
  if (authToken && isAdminRoute) {
    return NextResponse.next()
  }

  // Cas 4: Token expiré ou invalide sur route admin (sauf login)
  if (!authToken && isAdminRoute && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
} 