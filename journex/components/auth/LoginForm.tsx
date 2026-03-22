'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { loginSchema } from '@/lib/validations/auth'
import type { LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import type { FormEvent } from 'react'

export function LoginForm(): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState<LoginInput>({ username: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGuestLoading, setIsGuestLoading] = useState<boolean>(false)

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Account created! Sign in with your credentials.')
    }
  }, [searchParams])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const parsed = loginSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string' && (key === 'username' || key === 'password')) {
          fieldErrors[key] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: `${form.username.toLowerCase()}@journex.app`,
      password: form.password,
    })

    if (error) {
      setServerError(error.message === 'Invalid login credentials'
        ? 'Invalid username or password'
        : error.message)
      setIsLoading(false)
      return
    }

    window.location.href = '/journal'
  }

  const handleGuestLogin = async (): Promise<void> => {
    setIsGuestLoading(true)
    setServerError(null)

    try {
      const res = await fetch('/api/auth/guest', { method: 'POST' })
      const data = await res.json() as { email?: string; password?: string; error?: string }

      if (!res.ok || data.error) {
        setServerError(data.error ?? 'Failed to create guest session')
        setIsGuestLoading(false)
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email!,
        password: data.password!,
      })

      if (error) {
        setServerError('Guest login failed. Please try again.')
        setIsGuestLoading(false)
        return
      }

      window.location.href = '/journal'
    } catch {
      setServerError('Something went wrong. Please try again.')
      setIsGuestLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        <Input
          label="Username"
          value={form.username}
          onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
          error={errors.username}
          autoComplete="username"
          placeholder="your_username"
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          error={errors.password}
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        {successMessage ? (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs text-green-400 font-mono bg-green-900/15 border border-green-800/25 rounded-lg px-3 py-2"
          >
            {successMessage}
          </motion.p>
        ) : null}

        {serverError ? (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs text-red-400 font-mono bg-red-900/15 border border-red-800/25 rounded-lg px-3 py-2"
          >
            {serverError}
          </motion.p>
        ) : null}

        <div className="pt-1">
          <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
            Sign In
          </Button>
        </div>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 gold-divider" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-obsidian-700">
          or
        </span>
        <div className="flex-1 gold-divider" />
      </div>

      <GoogleSignInButton />

      <div className="mt-4">
        <Button
          variant="ghost"
          size="lg"
          className="w-full border border-obsidian-400/30 text-obsidian-700 hover:text-cream hover:border-obsidian-400/50"
          isLoading={isGuestLoading}
          onClick={() => void handleGuestLogin()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mr-2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Continue as Guest
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/signup')}
            className="text-amber hover:text-amber-400 transition-colors duration-200 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </motion.div>
  )
}
