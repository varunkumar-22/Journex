import { getClientAndUserId } from '@/lib/demo-user'
import { createEntrySchema } from '@/lib/validations/entry'
import { NextResponse } from 'next/server'
import type { EntriesResponse, EntryResponse } from '@/types/api'
import type { EntryRow } from '@/types/database.types'

export async function GET(): Promise<NextResponse<EntriesResponse>> {
  const { client, userId } = await getClientAndUserId()

  const { data, error } = await client
    .from('journal_entries')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .returns<EntryRow[]>()

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message, code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data, error: null })
}

export async function POST(
  request: Request
): Promise<NextResponse<EntryResponse>> {
  const { client, userId } = await getClientAndUserId()

  const body: unknown = await request.json()
  const parsed = createEntrySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.issues[0]?.message ?? 'Invalid input', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  const { data, error } = await client
    .from('journal_entries')
    .insert({ user_id: userId, title: parsed.data.title })
    .select()
    .returns<EntryRow[]>()
    .single()

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message, code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data, error: null }, { status: 201 })
}
