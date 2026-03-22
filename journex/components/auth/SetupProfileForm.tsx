'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { setupProfileSchema } from '@/lib/validations/auth'
import type { SetupProfileInput } from '@/lib/validations/auth'
import { api } from '@/lib/fetcher'
import type { SetPasswordResponse } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { FormEvent } from 'react'

export function SetupProfileForm(): JSX.Element {
  const [form, setForm] = useState<SetupProfileInput>({
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

    const parsed = setupProfileSchema.safeParse(form)
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
      await api.post<{ username: string; password: string }, SetPasswordResponse>(
        '/api/auth/set-password',
        { username: form.username, password: form.password }
      )
      window.location.href = '/journal'
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Setup failed')
      setIsLoading(false)
    }
  }

  const updateField = (field: keyof SetupProfileInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <motion.form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Input
        label="Username"
        value={form.username}
        onChange={updateField('username')}
        error={errors.username}
        placeholder="Choose a username"
      />
      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={updateField('password')}
        error={errors.password}
        placeholder="At least 8 characters"
      />
      <Input
        label="Confirm Password"
        type="password"
        value={form.confirmPassword}
        onChange={updateField('confirmPassword')}
        error={errors.confirmPassword}
        placeholder="Repeat your password"
      />

      {serverError ? (
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-red-400 font-mono bg-red-900/10 border border-red-800/20 rounded-lg px-3 py-2"
        >
          {serverError}
        </motion.p>
      ) : null}

      <div className="pt-2 space-y-3">
        <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
          Complete Setup
        </Button>

        <button
          type="button"
          onClick={() => { window.location.href = '/journal' }}
          className="w-full text-center font-mono text-[10px] uppercase tracking-[0.15em] text-obsidian-800 hover:text-amber transition-colors duration-200 py-2"
        >
          Skip for now
        </button>
      </div>
    </motion.form>
  )
}
