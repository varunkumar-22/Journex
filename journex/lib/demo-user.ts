import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const DEMO_EMAIL = 'demo@journex.local'
const DEMO_PASSWORD = 'demo-journex-local-only'
let cachedDemoUserId: string | null = null

async function ensureDemoUser(admin: ReturnType<typeof createAdminClient>): Promise<string> {
  if (cachedDemoUserId) return cachedDemoUserId

  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('username', 'demo')
    .single()

  if (existing) {
    cachedDemoUserId = existing.id
    return existing.id
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { username: 'demo', full_name: 'Demo User' },
  })

  if (error) {
    const { data: users } = await admin.auth.admin.listUsers()
    const found = users?.users?.find((u) => u.email === DEMO_EMAIL)
    if (found) {
      cachedDemoUserId = found.id
      await admin.from('profiles').upsert({
        id: found.id,
        username: 'demo',
        display_name: 'Demo User',
      }, { onConflict: 'id' })
      return found.id
    }
    throw new Error(`Failed to create demo user: ${error.message}`)
  }

  cachedDemoUserId = data.user.id
  return data.user.id
}

export async function getClientAndUserId(): Promise<{
  client: ReturnType<typeof createClient> | ReturnType<typeof createAdminClient>
  userId: string
}> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) return { client: supabase, userId: user.id }

  const admin = createAdminClient()
  const demoUserId = await ensureDemoUser(admin)
  return { client: admin, userId: demoUserId }
}
