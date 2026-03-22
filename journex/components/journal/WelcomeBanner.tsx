'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

interface WelcomeBannerProps {
  onDismiss: () => void
  isGuest?: boolean
}

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9" strokeLinecap="round" />
        <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Rich Text Editor',
    desc: 'Bold, italics, headings, lists, code blocks and more with a full rich text editing experience.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Images, Videos & Drawings',
    desc: 'Embed photos, videos, and hand-drawn sketches right inside your entries.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 7h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Tags & Filters',
    desc: 'Organize entries with tags and filter by them instantly. Star your favorites to find them fast.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Daily Writing Prompts',
    desc: 'A fresh prompt every day to spark your creativity when you\'re not sure where to begin.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Auto-Save',
    desc: 'Never lose a word. Everything saves automatically as you type, with a live save indicator.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
      </svg>
    ),
    title: 'Export to PDF',
    desc: 'Download any entry as a beautifully formatted PDF to keep your memories offline forever.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
      </svg>
    ),
    title: 'Dark, Light & Sepia Themes',
    desc: 'Switch between three beautiful themes to match your mood and reading preference.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Word Count & Reading Time',
    desc: 'Track your writing with live word count and estimated reading time on every entry.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as const } },
}

export function WelcomeBanner({ onDismiss, isGuest }: WelcomeBannerProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 backdrop-blur-md px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="glass-panel-strong rounded-2xl p-5 sm:p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-display-sm sm:text-display-md text-gradient-gold mb-3">
            {isGuest ? 'Welcome, Guest' : 'Welcome to Journex'}
          </h2>
          <p className="font-serif text-cream-600 text-body-sm leading-relaxed max-w-md mx-auto">
            {isGuest
              ? 'You\'re exploring Journex as a guest. Everything works — create entries, add media, export PDFs. Here\'s what you can do:'
              : 'Your beautiful, private space for thoughts, ideas, and reflections. Here\'s everything at your fingertips:'}
          </p>
        </motion.div>

        <div className="gold-divider mb-5" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="flex gap-3 bg-obsidian-200/50 border border-obsidian-400/30 rounded-xl p-3 sm:p-3.5 hover:border-amber/20 transition-colors duration-300"
            >
              <div className="text-amber shrink-0 mt-0.5">{f.icon}</div>
              <div className="min-w-0">
                <h3 className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-cream mb-0.5">
                  {f.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-obsidian-800 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {isGuest ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-[10px] font-mono uppercase tracking-wider text-obsidian-700 mb-4"
          >
            Guest entries are shared across all guests. Sign up for a private journal.
          </motion.p>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button onClick={onDismiss} size="lg" className="px-12">
            {isGuest ? 'Start Exploring' : 'Start Journaling'}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
