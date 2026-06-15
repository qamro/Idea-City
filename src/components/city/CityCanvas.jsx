import { useRef, useEffect, useCallback } from 'react'
import { useCity } from '../../context/CityContext'
import { useParticles } from '../../hooks/useParticles'
import { CATEGORIES } from '../../utils/constants'
import Building from '../buildings/Building'
import Districts from './Districts'
import styles from './CityCanvas.module.css'

export default function CityCanvas({ camera, onBuildingClick, onCanvasClick, selectedId, dayMode }) {
  const { buildings, spawnQueue, clearSpawn } = useCity()
  const { containerRef, spawn, fireworks } = useParticles()
  const canvasRef  = useRef(null)
  const isDragging = useRef(false)
  const dragStart  = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const touchDist  = useRef(null)

  // ── Sync camera transform ──────────────────
  useEffect(() => {
    if (!canvasRef.current) return
    canvasRef.current.style.transform =
      `translate(${camera.pan.x}px,${camera.pan.y}px) scale(${camera.zoom})`
  }, [camera.pan, camera.zoom])

  // ── Trigger particles for newly spawned buildings ──
  useEffect(() => {
    spawnQueue.forEach((id) => {
      const b = buildings.find((x) => x.id === id)
      if (!b) return
      const cat = CATEGORIES[b.category] || CATEGORIES.idea
      spawn(b.positionX + 35, b.positionY + 20, cat.color, 14)
      if (b.category === 'achievement') fireworks(b.positionX + 35, b.positionY)
    })
  }, [spawnQueue, buildings, spawn, fireworks])

  // ── Ambient life: occasional random particles ──
  useEffect(() => {
    if (!buildings.length) return
    const id = setInterval(() => {
      const b = buildings[Math.floor(Math.random() * buildings.length)]
      const cat = CATEGORIES[b.category] || CATEGORIES.idea
      spawn(b.positionX + 30, b.positionY + 10, cat.color, Math.random() > 0.5 ? 2 : 1)
    }, 1800)
    return () => clearInterval(id)
  }, [buildings, spawn])

  // ── Mouse drag ─────────────────────────────
  const onMouseDown = useCallback((e) => {
    if (e.target.closest('[data-building]')) return
    isDragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY, px: camera.pan.x, py: camera.pan.y }
    e.currentTarget.style.cursor = 'grabbing'
  }, [camera.pan])

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    camera.setPan({ x: dragStart.current.px + dx, y: dragStart.current.py + dy })
  }, [camera])

  const onMouseUp = useCallback((e) => {
    isDragging.current = false
    e.currentTarget.style.cursor = 'grab'
  }, [])

  const onWheel = useCallback((e) => {
    e.preventDefault()
    camera.zoomAround(e.deltaY > 0 ? -0.09 : 0.09, e.clientX, e.clientY)
  }, [camera])

  // ── Touch ──────────────────────────────────
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      isDragging.current = true
      dragStart.current = {
        x: e.touches[0].clientX, y: e.touches[0].clientY,
        px: camera.pan.x, py: camera.pan.y,
      }
    }
    if (e.touches.length === 2) {
      touchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
    }
  }, [camera.pan])

  const onTouchMove = useCallback((e) => {
    e.preventDefault()
    if (e.touches.length === 1 && isDragging.current) {
      camera.setPan({
        x: dragStart.current.px + (e.touches[0].clientX - dragStart.current.x),
        y: dragStart.current.py + (e.touches[0].clientY - dragStart.current.y),
      })
    }
    if (e.touches.length === 2 && touchDist.current !== null) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      )
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2
      camera.zoomAround((d - touchDist.current) * 0.006, cx, cy)
      touchDist.current = d
    }
  }, [camera])

  const onTouchEnd = useCallback(() => {
    isDragging.current = false
    touchDist.current  = null
  }, [])

  // Attach wheel as non-passive
  const wrapRef = useRef(null)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  return (
    <div
      ref={wrapRef}
      className={styles.viewport}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={(e) => {
        if (!e.target.closest('[data-building]')) onCanvasClick?.()
      }}
    >
      {/* World container — transformed */}
      <div ref={canvasRef} className={styles.world}>

        {/* Grid */}
        <div className={`${styles.grid} ${dayMode ? styles.gridDay : ''}`} />

        {/* Roads */}
        {ROAD_H.map((y) => (
          <div key={`rh${y}`} className={`${styles.roadH} ${dayMode ? styles.roadDay : ''}`} style={{ top: y }} />
        ))}
        {ROAD_V.map((x) => (
          <div key={`rv${x}`} className={`${styles.roadV} ${dayMode ? styles.roadDay : ''}`} style={{ left: x }} />
        ))}

        {/* District zones (behind buildings) */}
        <Districts buildings={buildings} />

        {/* Particle layer */}
        <div ref={containerRef} className={styles.particleLayer} />

        {/* Buildings */}
        {buildings.map((b) => (
          <Building
            key={b.id}
            building={b}
            isNew={spawnQueue.includes(b.id)}
            onAnimDone={clearSpawn}
            onClick={onBuildingClick}
            isSelected={selectedId === b.id}
          />
        ))}
      </div>
    </div>
  )
}

const ROAD_H = [700, 1100, 1500, 1900, 2300, 2700, 3100, 3500]
const ROAD_V = [500, 900, 1300, 1700, 2100, 2500, 2900, 3300, 3700, 4100]
