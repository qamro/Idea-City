import { useEffect, useRef } from 'react'
import styles from './StarField.module.css'

export default function StarField({ visible = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function draw() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Small dim stars
      for (let i = 0; i < 220; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height * 0.72
        const r = Math.random() * 1.1
        const a = Math.random() * 0.65 + 0.08
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,249,240,${a})`
        ctx.fill()
      }

      // Bright stars
      for (let i = 0; i < 16; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height * 0.55
        ctx.beginPath()
        ctx.arc(x, y, 1.6, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,249,240,0.95)'
        ctx.fill()

        // Cross sparkle
        ctx.strokeStyle = 'rgba(255,249,240,0.3)'
        ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); ctx.stroke()
      }
    }

    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={styles.stars}
      style={{ opacity: visible ? 1 : 0 }}
    />
  )
}
