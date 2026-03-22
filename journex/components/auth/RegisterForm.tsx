'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { registerSchema } from '@/lib/validations/auth'
import type { RegisterInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import type { FormEvent } from 'react'

export function RegisterForm(): JSX.Element {
  const router = useRouter()
  const [form, setForm] = useState<RegisterInput>({
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const parsed = registerSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string') {
          fieldErrors[key] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      })

      const result = await res.json() as { error: string | null }

      if (!res.ok || result.error) {
        setServerError(result.error ?? 'Registration failed')
        setIsLoading(false)
        return
      }

      router.push('/login?registered=true')
    } catch {
      setServerError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const updateField = (field: keyof RegisterInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
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
          onChange={updateField('username')}
          error={errors.username}
          autoComplete="username"
          placeholder="Choose a username"
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={updateField('password')}
          error={errors.password}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <Input
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={updateField('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
          placeholder="Repeat your password"
        />

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
            Create Account
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

      <div className="mt-6 text-center">
        <p className="text-sm text-muted">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-amber hover:text-amber-400 transition-colors duration-200 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
  )
}
