import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import type { ApiResponse } from '@/types/api'

interface RegisterResponse {
  success: boolean
}

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<RegisterResponse>>> {
  const body: unknown = await request.json()

  if (
    typeof body !== 'object' ||
    body === null ||
    !('username' in body) ||
    !('password' in body) ||
    typeof (body as Record<string, unknown>).username !== 'string' ||
    typeof (body as Record<string, unknown>).password !== 'string'
  ) {
    return NextResponse.json(
      { data: null, error: 'Username and password required', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  const { username, password } = body as { username: string; password: string }
  const email = `${username.toLowerCase()}@journex.app`

  const admin = createAdminClient()

  // Check if username is already taken
  const { data: existingProfile } = await admin
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .single()

  if (existingProfile) {
    return NextResponse.json(
      { data: null, error: 'This username is already taken', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  // Create user with admin client (auto-confirmed, no email needed)
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  })

  if (authError) {
    if (authError.message.includes('already been registered')) {
      return NextResponse.json(
        { data: null, error: 'This username is already taken', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { data: null, error: authError.message, code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }

  // Create profile directly (bypasses RLS via service role)
  const { error: profileError } = await admin
    .from('profiles')
    .upsert({
      id: authData.user.id,
      username: username.toLowerCase(),
      display_name: username,
      has_password: true,
    }, { onConflict: 'id' })

  if (profileError) {
    // User was created but profile failed — log but don't block
    console.error('Profile creation failed:', profileError.message)
  }

  return NextResponse.json({ data: { success: true }, error: null })
}
