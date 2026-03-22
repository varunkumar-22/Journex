import { z } from 'zod'

export const createEntrySchema = z.object({
  title: z.string().min(1).max(255),
})
export type CreateEntryInput = z.infer<typeof createEntrySchema>

export const updateEntrySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
  contentText: z.string().optional(),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
  wordCount: z.number().int().min(0).optional(),
  isComplete: z.boolean().optional(),
  lastEditedSection: z.string().nullable().optional(),
})
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>
