import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES } from '../../utils/constants'
import { truncate } from '../../utils/helpers'
import { buildingSVGString } from './buildingShapes'
import styles from './Building.module.css'

export default function Building({ building, isNew, onAnimDone, onClick, isSelected }) {
  const { id, title, category, level = 1, positionX: x, positionY: y } = building
  const cat   = CATEGORIES[category] || CATEGORIES.idea
  const { svg, W, H } = buildingSVGString(cat.type, cat.color, level)
  const glowRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  // Glow animation via CSS
  const glowSize  = 40 + level * 18
  const glowOpacity = 0.5 + level * 0.1

  return (
    <motion.div
      className={`${styles.wrap} ${isSelected ? styles.selected : ''}`}
      style={{ left: x, top: y }}
      initial={isNew ? { scaleY: 0, opacity: 0, filter: 'brightness(3)' } : false}
      animate={isNew ? { scaleY: 1, opacity: 1, filter: 'brightness(1)' } : {}}
      transition={isNew ? { duration: 1.1, ease: [0.34, 1.56, 0.64, 1] } : {}}
      onAnimationComplete={() => isNew && onAnimDone?.(id)}
      onClick={(e) => { e.stopPropagation(); onClick?.(building) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ filter: 'brightness(1.4)' }}
    >
      {/* SVG building */}
      <div dangerouslySetInnerHTML={{ __html: svg }} />

      {/* Glow underneath */}
      <div
        className={styles.glow}
        style={{
          width:      glowSize,
          height:     glowSize * 0.4,
          background: cat.color,
          opacity:    glowOpacity,
        }}
      />

      {/* Name label */}
      <div className={styles.label} style={{ color: cat.color + 'cc' }}>
        {truncate(title, 18)}
      </div>

      {/* Level badge */}
      {level > 1 && (
        <div className={styles.badge} style={{ background: cat.color + '22', color: cat.color, borderColor: cat.color + '44' }}>
          Lv{level}
        </div>
      )}

      {/* Hover ring */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className={styles.hoverRing}
            style={{ borderColor: cat.color + '66' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
