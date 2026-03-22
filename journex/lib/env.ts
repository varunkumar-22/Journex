import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
})

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

let _env: z.infer<typeof envSchema> | null = null
let _serverEnv: z.infer<typeof serverEnvSchema> | null = null

export function getEnv(): z.infer<typeof envSchema> {
  if (!_env) {
    _env = envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    })
  }
  return _env
}

export function getServerEnv(): z.infer<typeof serverEnvSchema> {
  if (!_serverEnv) {
    _serverEnv = serverEnvSchema.parse({
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    })
  }
  return _serverEnv
}

export type Env = z.infer<typeof envSchema>
export type ServerEnv = z.infer<typeof serverEnvSchema>
