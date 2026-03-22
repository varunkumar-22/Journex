'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const quotes = [
  'Write your story',
  'Capture the moment',
  'Let your thoughts flow',
  'Reflect. Remember. Grow.',
  'Every day is a blank page',
  'Your words matter',
  'Think deeply, write freely',
  'Silence speaks through ink',
  'Today deserves to be remembered',
  'A journal is a mirror of the soul',
  'Thoughts become words become worlds',
  'The unexamined life is not worth living',
  'Begin anywhere',
  'Write what disturbs you',
  'In the journal, you find yourself',
]

interface Particle {
  id: number
  text: string
  x: number
  y: number
  duration: number
  delay: number
  size: number
  opacity: number
}

function generateParticle(id: number): Particle {
  return {
    id,
    text: quotes[Math.floor(Math.random() * quotes.length)] as string,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 12 + Math.random() * 18,
    delay: Math.random() * 5,
    size: 10 + Math.random() * 4,
    opacity: 0.04 + Math.random() * 0.08,
  }
}

export function FloatingQuotes(): JSX.Element {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const initial = Array.from({ length: 12 }, (_, i) => generateParticle(i))
    setParticles(initial)

    let counter = initial.length
    const interval = setInterval(() => {
      setParticles((prev) => {
        const updated = prev.filter((_, i) => i > 0)
        return [...updated, generateParticle(counter++)]
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 0,
              x: `${p.x}vw`,
              y: `${p.y}vh`,
              scale: 0.8,
            }}
            animate={{
              opacity: [0, p.opacity, p.opacity, 0],
              y: [`${p.y}vh`, `${p.y - 15 - Math.random() * 20}vh`],
              x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 10}vw`],
              scale: [0.8, 1, 1, 0.9],
              rotate: [-2 + Math.random() * 4, 2 - Math.random() * 4],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeInOut',
            }}
            className="absolute font-serif italic whitespace-nowrap select-none"
            style={{
              fontSize: `${p.size}px`,
              color: '#D4A853',
              textShadow: '0 0 30px rgba(212, 168, 83, 0.1)',
            }}
          >
            {p.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
