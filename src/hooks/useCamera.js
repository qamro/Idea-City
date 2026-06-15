import { useState, useCallback, useRef, useEffect } from 'react'
import { clamp, easeInOut } from '../utils/helpers'
import { CENTER_X, CENTER_Y } from '../utils/constants'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 3.0

export function useCamera() {
  const [zoom, setZoom] = useState(0.9)
  const [pan,  setPan]  = useState({ x: 0, y: 0 })
  const stateRef = useRef({ zoom: 0.9, pan: { x: 0, y: 0 } })
  const animRef  = useRef(null)

  // Sync ref with state so event handlers always read current values
  useEffect(() => { stateRef.current = { zoom, pan } }, [zoom, pan])

  // ── Set initial view centered on city ───────
  const initView = useCallback((containerW, containerH) => {
    const z = 0.9
    const x = containerW / 2 - CENTER_X * z
    const y = containerH / 2 - CENTER_Y * z
    setZoom(z)
    setPan({ x, y })
  }, [])

  // ── Raw zoom around a point ─────────────────
  const zoomAround = useCallback((delta, mx, my) => {
    setZoom((prevZ) => {
      const newZ = clamp(prevZ + delta, MIN_ZOOM, MAX_ZOOM)
      setPan((prevP) => ({
        x: mx - (mx - prevP.x) * (newZ / prevZ),
        y: my - (my - prevP.y) * (newZ / prevZ),
      }))
      stateRef.current.zoom = newZ
      return newZ
    })
  }, [])

  const zoomIn  = useCallback((mx, my) => zoomAround( 0.18, mx ?? window.innerWidth  / 2, my ?? window.innerHeight / 2), [zoomAround])
  const zoomOut = useCallback((mx, my) => zoomAround(-0.18, mx ?? window.innerWidth  / 2, my ?? window.innerHeight / 2), [zoomAround])

  // ── Smooth animated transition ──────────────
  const smoothTo = useCallback((targetX, targetY, targetZ, duration = 900) => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    const { zoom: startZ, pan: { x: startX, y: startY } } = stateRef.current
    const t0 = performance.now()

    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration)
      const e = easeInOut(t)
      const cz = startZ + (targetZ - startZ) * e
      const cx = startX + (targetX - startX) * e
      const cy = startY + (targetY - startY) * e
      setZoom(cz)
      setPan({ x: cx, y: cy })
      stateRef.current = { zoom: cz, pan: { x: cx, y: cy } }
      if (t < 1) animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
  }, [])

  // ── Pan to a world coordinate (building) ────
  const panToWorld = useCallback((worldX, worldY, targetZ, containerW, containerH, duration = 800) => {
    const tz = targetZ ?? clamp(stateRef.current.zoom, 1.0, 1.6)
    const tx = (containerW ?? window.innerWidth)  / 2 - (worldX + 35) * tz
    const ty = (containerH ?? window.innerHeight) / 2 - (worldY + 60) * tz
    smoothTo(tx, ty, tz, duration)
  }, [smoothTo])

  // ── Go home ─────────────────────────────────
  const goHome = useCallback((containerW, containerH) => {
    const z = 0.9
    smoothTo(
      (containerW ?? window.innerWidth)  / 2 - CENTER_X * z,
      (containerH ?? window.innerHeight) / 2 - CENTER_Y * z,
      z,
    )
  }, [smoothTo])

  return { zoom, pan, setZoom, setPan, stateRef, initView, zoomIn, zoomOut, zoomAround, smoothTo, panToWorld, goHome }
}
