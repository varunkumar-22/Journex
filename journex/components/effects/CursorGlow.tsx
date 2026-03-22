'use client'

import { useEffect, useRef } from 'react'

export function CursorGlow(): JSX.Element {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    let animationId: number
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const lerp = (start: number, end: number, factor: number): number =>
      start + (end - start) * factor

    const animate = (): void => {
      currentX = lerp(currentX, targetX, 0.08)
      currentY = lerp(currentY, targetY, 0.08)
      glow.style.left = `${currentX}px`
      glow.style.top = `${currentY}px`
      animationId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent): void => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const handleMouseEnter = (): void => {
      glow.style.opacity = '1'
    }

    const handleMouseLeave = (): void => {
      glow.style.opacity = '0'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    animationId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="cursor-glow"
      style={{ opacity: 0 }}
      aria-hidden="true"
    />
  )
}
