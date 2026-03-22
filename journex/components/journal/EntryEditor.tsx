'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { Video } from '@/lib/tiptap/video-node'
import { TagInput } from './TagInput'
import { AutoSaveIndicator } from './AutoSaveIndicator'
import { DrawingCanvas } from './DrawingCanvas'
import { Button } from '@/components/ui/Button'
import { exportEntryToPdf } from '@/lib/export-pdf'
import type { EntryRow } from '@/types/database.types'
import type { UpdateEntryBody } from '@/types/api'
import type { UseAutoSaveReturn } from '@/types/hooks'
import type { ChangeEvent } from 'react'

const WRITING_PROMPTS = [
  'What made you smile today?',
  'What are you grateful for right now?',
  'Describe a moment that surprised you today.',
  'What\'s been on your mind lately?',
  'Write about something you learned recently.',
  'What would you tell your future self?',
  'Describe how you\'re feeling in this moment.',
  'What\'s one thing you want to remember about today?',
  'Write about a conversation that stuck with you.',
  'What are you looking forward to?',
  'Describe a place that makes you feel at peace.',
  'What challenge are you working through?',
  'Write about someone who inspired you recently.',
  'What does your ideal day look like?',
  'What would you do if you had no fear?',
]

function getDailyPrompt(): string {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return WRITING_PROMPTS[seed % WRITING_PROMPTS.length] ?? 'Begin writing your thoughts...'
}

interface EntryEditorProps {
  entry: EntryRow
  autoSave: UseAutoSaveReturn
  onScheduleSave: (patch: UpdateEntryBody) => void
  onMarkComplete: (id: string) => Promise<void>
  onBack?: () => void
}

export function EntryEditor({
  entry,
  autoSave,
  onScheduleSave,
  onMarkComplete,
  onBack,
}: EntryEditorProps): JSX.Element {
  const [title, setTitle] = useState<string>(entry.title)
  const [tags, setTags] = useState<string[]>(entry.tags)
  const [showDrawing, setShowDrawing] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const isInternalUpdate = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: getDailyPrompt() }),
      Image.configure({ inline: false, allowBase64: true }),
      Video,
    ],
    content: entry.content || '',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[400px]',
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (isInternalUpdate.current) return
      const html = ed.getHTML()
      const text = ed.getText()
      const wc = text.trim() ? text.trim().split(/\s+/).length : 0
      setWordCount(wc)
      onScheduleSave({ content: html, contentText: text, wordCount: wc })
    },
  })

  // Reset editor content when switching entries
  useEffect(() => {
    if (!editor) return
    isInternalUpdate.current = true
    editor.commands.setContent(entry.content || '')
    isInternalUpdate.current = false

    setTitle(entry.title)
    setTags(entry.tags)

    const text = editor.getText()
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id, editor])

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value
      setTitle(value)
      onScheduleSave({ title: value })
    },
    [onScheduleSave]
  )

  const handleTagsChange = useCallback(
    (newTags: string[]): void => {
      setTags(newTags)
      onScheduleSave({ tags: newTags })
    },
    [onScheduleSave]
  )

  const handleExportPdf = useCallback(async (): Promise<void> => {
    if (!editor) return
    setIsExporting(true)
    try {
      const currentEntry: EntryRow = {
        ...entry,
        title,
        content: editor.getHTML(),
        content_text: editor.getText(),
        tags,
        word_count: wordCount,
      }
      await exportEntryToPdf(currentEntry)
    } finally {
      setIsExporting(false)
    }
  }, [editor, entry, title, tags, wordCount])

  const handleImageUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0]
      if (!file || !editor) return
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          editor.chain().focus().setImage({ src: reader.result }).run()
        }
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    },
    [editor]
  )

  const handleVideoUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0]
      if (!file || !editor) return
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          editor.chain().focus().setVideo({ src: reader.result }).run()
        }
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    },
    [editor]
  )

  const handleSaveDrawing = useCallback(
    (dataUrl: string): void => {
      if (!editor) return
      editor.chain().focus().setImage({ src: dataUrl }).run()
      setShowDrawing(false)
    },
    [editor]
  )

  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-b border-obsidian-300/20">
        <div className="flex items-center gap-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="md:hidden p-1.5 rounded-lg text-obsidian-700 hover:text-amber hover:bg-obsidian-300/30 transition-all duration-200"
              aria-label="Back to entries"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
          <AutoSaveIndicator
          isSaving={autoSave.isSaving}
          lastSaved={autoSave.lastSaved}
          error={autoSave.saveError}
        />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void handleExportPdf()}
            isLoading={isExporting}
            className="text-obsidian-700 hover:text-amber"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
            </svg>
            PDF
          </Button>
          {!entry.is_complete ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void onMarkComplete(entry.id)}
              className="text-obsidian-700 hover:text-amber"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mr-1">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Complete
            </Button>
          ) : (
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber bg-amber/10 px-2.5 py-1 rounded-lg">
              Complete
            </span>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-5 sm:py-8 space-y-4 sm:space-y-5">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Give this entry a title..."
            className="w-full font-display text-display-sm sm:text-display-md bg-transparent text-cream placeholder-obsidian-600 outline-none border-none"
          />

          <div className="gold-divider" />

          <TagInput tags={tags} onChange={handleTagsChange} />

          {/* Media toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-obsidian-700 hover:text-amber px-3 py-1.5 rounded-lg border border-obsidian-300/30 hover:border-amber/30 transition-all duration-200"
              title="Insert image at cursor"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Image
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-obsidian-700 hover:text-amber px-3 py-1.5 rounded-lg border border-obsidian-300/30 hover:border-amber/30 transition-all duration-200"
              title="Insert video at cursor"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="23 7 16 12 23 17 23 7" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Video
            </button>
            <button
              type="button"
              onClick={() => setShowDrawing(true)}
              className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-obsidian-700 hover:text-amber px-3 py-1.5 rounded-lg border border-obsidian-300/30 hover:border-amber/30 transition-all duration-200"
              title="Draw and insert"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 19l7-7 3 3-7 7-3-3z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 2l7.586 7.586" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="11" cy="11" r="2" />
              </svg>
              Draw
            </button>
          </div>

          {/* TipTap rich text editor */}
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 border-t border-obsidian-300/20 bg-obsidian-50/50">
        <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider text-obsidian-700">
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span className="text-obsidian-400">&middot;</span>
          <span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-obsidian-700">
          {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Drawing canvas modal */}
      <AnimatePresence>
        {showDrawing ? (
          <DrawingCanvas
            onSave={handleSaveDrawing}
            onClose={() => setShowDrawing(false)}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
