import { getClientAndUserId } from '@/lib/demo-user'
import { updateEntrySchema } from '@/lib/validations/entry'
import { NextResponse } from 'next/server'
import type { EntryResponse, DeleteResponse } from '@/types/api'
import type { EntryRow, EntryUpdate } from '@/types/database.types'

interface RouteContext {
  params: { id: string }
}

export async function GET(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<EntryResponse>> {
  const { client, userId } = await getClientAndUserId()

  const { data, error } = await client
    .from('journal_entries')
    .select()
    .eq('id', params.id)
    .eq('user_id', userId)
    .returns<EntryRow[]>()
    .single()

  if (error) {
    return NextResponse.json(
      { data: null, error: 'Entry not found', code: 'NOT_FOUND' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data, error: null })
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse<EntryResponse>> {
  const { client, userId } = await getClientAndUserId()

  const body: unknown = await request.json()
  const parsed = updateEntrySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.issues[0]?.message ?? 'Invalid input', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  const update: EntryUpdate = {}
  if (parsed.data.title !== undefined) update.title = parsed.data.title
  if (parsed.data.content !== undefined) update.content = parsed.data.content
  if (parsed.data.contentText !== undefined) update.content_text = parsed.data.contentText
  if (parsed.data.tags !== undefined) update.tags = parsed.data.tags
  if (parsed.data.wordCount !== undefined) update.word_count = parsed.data.wordCount
  if (parsed.data.isComplete !== undefined) update.is_complete = parsed.data.isComplete
  if (parsed.data.lastEditedSection !== undefined) update.last_edited_section = parsed.data.lastEditedSection

  const { data, error } = await client
    .from('journal_entries')
    .update(update)
    .eq('id', params.id)
    .eq('user_id', userId)
    .select()
    .returns<EntryRow[]>()
    .single()

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message, code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data, error: null })
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<DeleteResponse>> {
  const { client, userId } = await getClientAndUserId()

  const { error } = await client
    .from('journal_entries')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userId)

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message, code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: { id: params.id }, error: null })
}
