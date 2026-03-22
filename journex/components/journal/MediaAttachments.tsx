'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { MediaItem } from '@/hooks/useMedia'

interface MediaAttachmentsProps {
  media: MediaItem[]
  onRemove: (id: string) => void
}

export function MediaAttachments({ media, onRemove }: MediaAttachmentsProps): JSX.Element | null {
  if (media.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono uppercase tracking-wider text-obsidian-700">
        Attachments ({media.length})
      </p>
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {media.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group rounded-xl overflow-hidden border border-obsidian-300/30 bg-obsidian-200/30"
            >
              {item.type === 'video' ? (
                <video
                  src={item.dataUrl}
                  controls
                  className="w-full max-h-64 object-contain bg-black/20"
                />
              ) : (
                <img
                  src={item.dataUrl}
                  alt={item.name}
                  className="w-full max-h-64 object-contain"
                />
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/60 text-white p-1.5 rounded-lg hover:bg-red-600 transition-all duration-200"
                aria-label={`Remove ${item.name}`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 3l6 6M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-[9px] font-mono uppercase tracking-wider text-white/80 truncate">
                  {item.type === 'drawing' ? 'Drawing' : item.name}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
