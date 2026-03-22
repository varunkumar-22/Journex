'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void
  onClose: () => void
}

const COLORS = [
  '#ffffff',
  '#F5F0E8',
  '#D4A853',
  '#f5c842',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#000000',
  '#6b7280',
]

const BRUSH_SIZES = [2, 4, 8, 14, 22]

export function DrawingCanvas({ onSave, onClose }: DrawingCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#ffffff')
  const [brushSize, setBrushSize] = useState(4)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
  }, [])

  const getPos = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    if ('touches' in e) {
      const touch = e.touches[0]
      if (!touch) return { x: 0, y: 0 }
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const drawLine = useCallback((from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.strokeStyle = tool === 'eraser' ? '#1a1a1a' : color
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }, [color, brushSize, tool])

  const handleStart = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const pos = getPos(e)
    lastPos.current = pos

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, (tool === 'eraser' ? brushSize * 1.5 : brushSize / 2), 0, Math.PI * 2)
    ctx.fillStyle = tool === 'eraser' ? '#1a1a1a' : color
    ctx.fill()
  }, [getPos, color, brushSize, tool])

  const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || !lastPos.current) return
    const pos = getPos(e)
    drawLine(lastPos.current, pos)
    lastPos.current = pos
  }, [isDrawing, getPos, drawLine])

  const handleEnd = useCallback(() => {
    setIsDrawing(false)
    lastPos.current = null
  }, [])

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
  }, [])

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    onSave(dataUrl)
  }, [onSave])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="bg-obsidian-100 border border-obsidian-300/30 rounded-2xl overflow-hidden w-full max-w-3xl max-h-[95vh] flex flex-col shadow-2xl"
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 border-b border-obsidian-300/20">
          {/* Tool toggle */}
          <div className="flex items-center gap-1 bg-obsidian-200/50 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setTool('pen')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                tool === 'pen' ? 'bg-amber/20 text-amber' : 'text-obsidian-700 hover:text-cream'
              }`}
              title="Pen"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setTool('eraser')}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                tool === 'eraser' ? 'bg-amber/20 text-amber' : 'text-obsidian-700 hover:text-cream'
              }`}
              title="Eraser"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 20H7L3 16l9-9 8 8-4 4zM6.5 17.5l5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Colors */}
          <div className="flex flex-wrap items-center gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setColor(c); setTool('pen') }}
                className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
                  color === c && tool === 'pen'
                    ? 'border-amber scale-125'
                    : 'border-obsidian-400/30 hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>

          {/* Divider - hidden on mobile */}
          <div className="hidden sm:block w-px h-6 bg-obsidian-300/30" />

          {/* Brush sizes */}
          <div className="flex items-center gap-1.5">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setBrushSize(size)}
                className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150 ${
                  brushSize === size
                    ? 'bg-amber/20 border border-amber/30'
                    : 'hover:bg-obsidian-300/30 border border-transparent'
                }`}
                title={`${size}px`}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: Math.min(size, 16),
                    height: Math.min(size, 16),
                    backgroundColor: brushSize === size ? '#D4A853' : '#636363',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Clear button */}
          <div className="ml-auto">
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] font-mono uppercase tracking-wider text-obsidian-700 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-900/10 transition-all duration-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative flex-1 min-h-0">
          <canvas
            ref={canvasRef}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            className="w-full h-full cursor-crosshair touch-none"
            style={{ minHeight: '280px', maxHeight: '420px' }}
          />
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-t border-obsidian-300/20">
          <p className="hidden sm:block text-[10px] font-mono uppercase tracking-wider text-obsidian-700">
            Draw anything you want
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-mono uppercase tracking-wider text-obsidian-700 hover:text-cream px-3 sm:px-4 py-2 rounded-xl border border-obsidian-400/30 hover:border-obsidian-400/50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-[11px] font-mono uppercase tracking-wider bg-amber text-obsidian font-semibold px-3 sm:px-4 py-2 rounded-xl hover:bg-amber-400 transition-all duration-200"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
