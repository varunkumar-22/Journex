'use client'

import { useEffect, useRef } from 'react'

const STAR_COUNT = 80
const HERO_STAR_COUNT = 5
const AMBER_COUNT = 10

export function StarField(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fragment = document.createDocumentFragment()

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('span')
      const size = 1 + Math.random() * 1.5
      const isAmber = i < AMBER_COUNT
      const duration = 2 + Math.random() * 4
      const delay = -(Math.random() * 8)

      star.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: ${isAmber ? '#f5c842' : '#ffffff'};
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: twinkle ${duration}s ease-in-out ${delay}s infinite;
      `
      fragment.appendChild(star)
    }

    for (let i = 0; i < HERO_STAR_COUNT; i++) {
      const star = document.createElement('span')
      const size = 3 + Math.random()
      const duration = 8 + Math.random() * 4
      const delay = -(Math.random() * 8)

      star.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: ${i === 0 ? '#f5c842' : '#ffffff'};
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: twinkle ${duration}s ease-in-out ${delay}s infinite;
      `
      fragment.appendChild(star)
    }

    container.appendChild(fragment)

    return () => {
      container.innerHTML = ''
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="star-field"
    />
  )
}
