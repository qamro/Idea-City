import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES } from '../../utils/constants'
import styles from './AddBuildingModal.module.css'

const CAT_KEYS = Object.keys(CATEGORIES)

export default function AddBuildingModal({ open, onClose, onSubmit }) {
  const [title,   setTitle]   = useState('')
  const [selCat,  setSelCat]  = useState('idea')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTitle('')
      setSelCat('idea')
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [open])

  async function handleSubmit() {
    const t = title.trim()
    if (!t) { inputRef.current?.focus(); return }
    setLoading(true)
    await onSubmit(t, selCat)
    setLoading(false)
    onClose()
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Glow accent */}
            <div className={styles.glowAccent} />

            <button className={styles.closeBtn} onClick={onClose}>✕</button>

            <h2 className={styles.heading}>Found a new building</h2>
            <p className={styles.sub}>Name it. Claim your idea. Watch it rise.</p>

            <input
              ref={inputRef}
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKey}
              placeholder="What is this idea, skill, or dream?"
              maxLength={48}
            />

            {/* Category grid */}
            <div className={styles.catGrid}>
              {CAT_KEYS.map((key) => {
                const cat = CATEGORIES[key]
                const sel = key === selCat
                return (
                  <button
                    key={key}
                    className={`${styles.catBtn} ${sel ? styles.catSel : ''}`}
                    style={sel ? { borderColor: cat.color, background: cat.color + '14' } : {}}
                    onClick={() => setSelCat(key)}
                  >
                    <span className={styles.catIcon}>{cat.icon}</span>
                    <span className={styles.catName} style={sel ? { color: cat.color } : {}}>
                      {cat.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading || !title.trim()}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                `Place in ${CATEGORIES[selCat].districtName} →`
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
