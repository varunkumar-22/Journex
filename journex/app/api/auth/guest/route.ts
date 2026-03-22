import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const GUEST_EMAIL = 'guest@journex.local'
const GUEST_PASSWORD = 'guest-journex-access'

export async function POST(): Promise<NextResponse> {
  const admin = createAdminClient()

  // Check if guest user already exists
  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('username', 'guest')
    .single()

  if (existing) {
    return NextResponse.json({
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
    })
  }

  // Create guest user via auth admin API
  const { error } = await admin.auth.admin.createUser({
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
    email_confirm: true,
    user_metadata: { username: 'guest', full_name: 'Guest' },
  })

  if (error && !error.message.includes('already been registered')) {
    return NextResponse.json(
      { error: `Failed to create guest account: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  })
}
