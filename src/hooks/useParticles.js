import { useCallback, useRef } from 'react'

let _uid = 0
const uid = () => ++_uid

export function useParticles() {
  const containerRef = useRef(null)

  const spawn = useCallback((worldX, worldY, color, count = 8) => {
    const container = containerRef.current
    if (!container) return

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const sz = 2 + Math.random() * 5
      const delay = Math.random() * 0.3
      const dur   = 0.8 + Math.random() * 1.0

      el.style.cssText = `
        position:absolute;
        pointer-events:none;
        border-radius:50%;
        left:${worldX + (Math.random() - 0.5) * 80}px;
        top:${worldY - Math.random() * 20}px;
        width:${sz}px;
        height:${sz}px;
        background:${color};
        opacity:0.9;
        animation:particleFloat ${dur}s ${delay}s linear forwards;
      `
      container.appendChild(el)
      setTimeout(() => el.remove(), (dur + delay) * 1000 + 100)
    }
  }, [])

  const fireworks = useCallback((worldX, worldY) => {
    const container = containerRef.current
    if (!container) return
    const COLS = ['#FFD166', '#F5A623', '#FF6B6B', '#00C9B1', '#8B6FE8', '#C77DFF']

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const el = document.createElement('div')
        const col = COLS[i % COLS.length]
        const ox = (Math.random() - 0.5) * 160
        const oy = -20 - Math.random() * 120
        el.style.cssText = `
          position:absolute;
          pointer-events:none;
          left:${worldX + ox - 16}px;
          top:${worldY + oy - 16}px;
          width:32px;height:32px;
          border:2.5px solid ${col};
          border-radius:50%;
          animation:sparkBurst 0.9s ease-out forwards;
        `
        container.appendChild(el)
        setTimeout(() => el.remove(), 1000)
      }, i * 110)
    }
  }, [])

  return { containerRef, spawn, fireworks }
}
