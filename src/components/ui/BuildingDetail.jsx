import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES, LEVELS } from '../../utils/constants'
import { useCity } from '../../context/CityContext'
import styles from './BuildingDetail.module.css'

export default function BuildingDetail({ building, onClose, onUpgrade, onRemove }) {
  if (!building) return null

  const cat   = CATEGORIES[building.category] || CATEGORIES.idea
  const level = building.level || 1
  const lvMeta = LEVELS[level]
  const maxed  = level >= 5

  return (
    <AnimatePresence>
      <motion.div
        className={styles.panel}
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0,    opacity: 1 }}
        exit={{    x: -280, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Close */}
        <button className={styles.close} onClick={onClose}>✕</button>

        {/* Category tag */}
        <div className={styles.catTag} style={{ color: cat.color, borderColor: cat.color + '44', background: cat.color + '12' }}>
          {cat.icon} {cat.label}
        </div>

        {/* Title */}
        <h2 className={styles.title}>{building.title}</h2>

        {/* Level display */}
        <div className={styles.levelRow}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={styles.levelPip}
              style={{
                background: i < level ? cat.color : 'var(--border-2)',
                boxShadow:  i < level ? `0 0 6px ${cat.color}88` : 'none',
              }}
            />
          ))}
          <span className={styles.levelLabel} style={{ color: cat.color }}>
            {lvMeta?.label || 'Seedling'}
          </span>
        </div>

        {/* Pop contribution */}
        <div className={styles.stat}>
          <span className={styles.statLabel}>Population</span>
          <span className={styles.statVal} style={{ color: cat.color }}>
            +{(cat.population * level).toLocaleString()}
          </span>
        </div>

        <div className={styles.divider} />

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.upgrade} ${maxed ? styles.maxed : ''}`}
            style={!maxed ? { background: cat.color, color: '#070910' } : {}}
            onClick={() => !maxed && onUpgrade(building.id)}
            disabled={maxed}
          >
            {maxed ? '✦ Icon Building' : 'Level Up ↑'}
          </button>
          <button className={`${styles.btn} ${styles.remove}`} onClick={() => onRemove(building.id)}>
            Remove
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
