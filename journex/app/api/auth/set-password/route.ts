import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import type { ApiResponse, SetPasswordResponse } from '@/types/api'

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<SetPasswordResponse>>> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { data: null, error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

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

  const admin = createAdminClient()

  // Update password via admin client to bypass any triggers
  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, { password })

  if (updateError) {
    return NextResponse.json(
      { data: null, error: updateError.message, code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }

  // Upsert profile — handles both create (new OAuth user) and update cases
  const { error: profileError } = await admin
    .from('profiles')
    .upsert(
      {
        id: user.id,
        username,
        has_password: true,
        display_name: (user.user_metadata as Record<string, string> | undefined)?.full_name ?? username,
        avatar_url: (user.user_metadata as Record<string, string> | undefined)?.avatar_url ?? null,
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    return NextResponse.json(
      { data: null, error: profileError.message, code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: { success: true }, error: null })
}
