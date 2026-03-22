'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface AutoSaveIndicatorProps {
  isSaving: boolean
  lastSaved: Date | null
  error: string | null
}

export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  error,
}: AutoSaveIndicatorProps): JSX.Element {
  return (
    <AnimatePresence mode="wait">
      {error ? (
        <motion.span
          key="error"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="text-[10px] font-mono uppercase tracking-wider text-red-400"
        >
          Save failed
        </motion.span>
      ) : isSaving ? (
        <motion.span
          key="saving"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber/60"
        >
          <motion.span
            className="inline-block w-1 h-1 rounded-full bg-amber/60"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          Saving
        </motion.span>
      ) : lastSaved ? (
        <motion.span
          key="saved"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="text-[10px] font-mono uppercase tracking-wider text-obsidian-800"
        >
          Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </motion.span>
      ) : (
        <span className="text-[10px] font-mono tracking-wider text-obsidian-700">&nbsp;</span>
      )}
    </AnimatePresence>
  )
}
