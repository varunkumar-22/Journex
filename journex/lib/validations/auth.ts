import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(20, 'At most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only'),
  password: z.string().min(8, 'At least 8 characters'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(20, 'At most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only'),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords don't match", path: ['confirmPassword'] }
)
export type RegisterInput = z.infer<typeof registerSchema>

export const setupProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords don't match", path: ['confirmPassword'] }
)
export type SetupProfileInput = z.infer<typeof setupProfileSchema>
