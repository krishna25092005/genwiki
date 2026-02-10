import { NextRequest, NextResponse } from 'next/server'

// Note: Middleware runs on the server and can't access localStorage
// Authentication is now handled on the client side in each page
export function middleware(request: NextRequest) {
  // Allow all requests - client-side pages will handle auth checks
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
