import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'
import type { NextResponse } from 'next/server'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
