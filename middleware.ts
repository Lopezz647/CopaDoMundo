// middleware.ts
import { updateSession } from '@/lib/supabase/proxy'
import { checkRateLimit } from '@/lib/rate-limit'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Rate limit para API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || 'anonymous'
    const { allowed, remaining } = await checkRateLimit(ip, 30, 60000)

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const response = await updateSession(request)
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    return response
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}