import { useMemo } from 'react'
import { CATEGORIES } from '../../utils/constants'
import styles from './Districts.module.css'

function computeZone(buildings) {
  if (!buildings.length) return null
  const xs = buildings.map((b) => b.positionX)
  const ys = buildings.map((b) => b.positionY)
  const PAD = 36
  return {
    x: Math.min(...xs) - PAD,
    y: Math.min(...ys) - PAD,
    w: Math.max(...xs) + 90 - Math.min(...xs) + PAD * 2,
    h: Math.max(...ys) + 110 - Math.min(...ys) + PAD * 2,
  }
}

export default function Districts({ buildings }) {
  const zones = useMemo(() => {
    const groups = {}
    buildings.forEach((b) => {
      if (!groups[b.category]) groups[b.category] = []
      groups[b.category].push(b)
    })
    return Object.entries(groups)
      .filter(([, bs]) => bs.length >= 1)
      .map(([cat, bs]) => {
        const zone = computeZone(bs)
        const meta = CATEGORIES[cat]
        return zone ? { cat, zone, meta } : null
      })
      .filter(Boolean)
  }, [buildings])

  return (
    <>
      {zones.map(({ cat, zone, meta }) => (
        <div
          key={cat}
          className={styles.zone}
          style={{
            left:        zone.x,
            top:         zone.y,
            width:       zone.w,
            height:      zone.h,
            background:  meta.colorGlow,
            borderColor: meta.colorBorder,
          }}
        >
          <span className={styles.label} style={{ color: meta.color }}>
            {meta.icon} {meta.districtName}
          </span>
        </div>
      ))}
    </>
  )
}
