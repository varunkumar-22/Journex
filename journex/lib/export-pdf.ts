'use client'

import type { EntryRow } from '@/types/database.types'

export async function exportEntryToPdf(entry: EntryRow): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ])

  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 700px;
    padding: 48px;
    background: #ffffff;
    font-family: Georgia, 'Times New Roman', serif;
    color: #000000;
    line-height: 1.8;
  `

  const date = new Date(entry.created_at)
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const wordCount = entry.content_text.trim()
    ? entry.content_text.trim().split(/\s+/).length
    : 0
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  // Parse HTML content and convert videos to placeholders
  let contentHtml = entry.content || ''
  contentHtml = contentHtml.replace(
    /<video[^>]*src="([^"]*)"[^>]*><\/video>/g,
    '<div style="background:#f0f0f0;border:1px solid #ccc;border-radius:8px;padding:20px;text-align:center;margin:16px 0;color:#666;font-size:13px;">🎬 Video attachment</div>'
  )

  container.innerHTML = `
    <div style="margin-bottom: 32px;">
      <h1 style="font-family: Georgia, serif; font-size: 32px; font-weight: 700; color: #000000; margin: 0 0 12px 0; line-height: 1.2;">
        ${escapeHtml(entry.title || 'Untitled')}
      </h1>
      <div style="display: flex; gap: 16px; font-family: 'Courier New', monospace; font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 0.05em;">
        <span>${dateStr}</span>
        <span>·</span>
        <span>${wordCount} words</span>
        <span>·</span>
        <span>${readTime} min read</span>
      </div>
      ${entry.tags.length > 0 ? `
        <div style="margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap;">
          ${entry.tags.map((t) => `<span style="font-family: 'Courier New', monospace; font-size: 10px; color: #996633; background: #fdf6e3; padding: 2px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.05em;">${escapeHtml(t)}</span>`).join('')}
        </div>
      ` : ''}
    </div>
    <hr style="border: none; height: 1px; background: linear-gradient(90deg, transparent, #d4a853, transparent); margin: 24px 0;" />
    <div class="pdf-body" style="font-family: Georgia, serif; font-size: 16px; color: #1a1a1a; line-height: 1.85;">
      ${contentHtml}
    </div>
    <hr style="border: none; height: 1px; background: linear-gradient(90deg, transparent, #d4a853, transparent); margin: 32px 0 16px;" />
    <div style="font-family: 'Courier New', monospace; font-size: 10px; color: #aaaaaa; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">
      Journex — ${dateStr}
    </div>
  `

  document.body.appendChild(container)

  // Style the inner content elements
  const style = document.createElement('style')
  style.textContent = `
    .pdf-body p { margin: 0 0 14px 0; color: #1a1a1a; }
    .pdf-body h1 { font-size: 26px; font-weight: 700; color: #000; margin: 24px 0 12px; }
    .pdf-body h2 { font-size: 22px; font-weight: 700; color: #000; margin: 20px 0 10px; }
    .pdf-body h3 { font-size: 18px; font-weight: 700; color: #000; margin: 16px 0 8px; }
    .pdf-body strong, .pdf-body b { font-weight: 700; color: #000; }
    .pdf-body em, .pdf-body i { font-style: italic; }
    .pdf-body blockquote { border-left: 3px solid #d4a853; padding-left: 16px; margin: 16px 0; color: #555; font-style: italic; }
    .pdf-body code { font-family: 'Courier New', monospace; background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
    .pdf-body pre { background: #f5f5f5; padding: 16px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 13px; overflow-x: auto; margin: 16px 0; }
    .pdf-body ul, .pdf-body ol { padding-left: 24px; margin: 12px 0; }
    .pdf-body li { margin: 4px 0; color: #1a1a1a; }
    .pdf-body img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block; }
    .pdf-body hr { border: none; height: 1px; background: #e0e0e0; margin: 24px 0; }
    .pdf-body span { color: #1a1a1a; }
  `
  document.head.appendChild(style)

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    })

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const pdf = new jsPDF('p', 'mm', 'a4')

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = -(imgHeight - heightLeft)
      pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const filename = `${(entry.title || 'Untitled').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '-').toLowerCase()}-${date.toISOString().split('T')[0]}.pdf`
    pdf.save(filename)
  } finally {
    document.body.removeChild(container)
    document.head.removeChild(style)
  }
}

function escapeHtml(str: string): string {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}
