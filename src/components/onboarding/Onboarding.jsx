import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCity } from '../../context/CityContext'
import styles from './Onboarding.module.css'

const FADE = (delay) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function Onboarding({ onComplete }) {
  const { foundCity, addBuildingToCity } = useCity()
  const [step,    setStep]    = useState(0)
  const [title,   setTitle]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (step === 1) setTimeout(() => inputRef.current?.focus(), 400)
  }, [step])

  async function handleFound() {
    const t = title.trim()
    if (!t) { inputRef.current?.focus(); return }
    setLoading(true)
    setError(null)
    setStep(2)

    try {
      const cityName = `${t} City`
      const cityId = await foundCity(cityName)

      if (!cityId) {
        setError('Could not connect to the database. Please check your internet and try again.')
        setStep(1)
        setLoading(false)
        return
      }

      await addBuildingToCity(t, 'idea')
      setLoading(false)
      onComplete()
    } catch (e) {
      console.error('Onboarding error:', e)
      setError(`Error: ${e.message}. Please try again.`)
      setStep(1)
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      if (step === 0) setStep(1)
      else handleFound()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.screen}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className={styles.ambientGlow} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              className={styles.content}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div className={styles.brand} {...FADE(0.2)}>✦ IDEA CITY</motion.div>
              <motion.h1 className={styles.title} {...FADE(0.5)}>
                Your civilization has<br />not yet been founded.
              </motion.h1>
              <motion.p className={styles.sub} {...FADE(0.8)}>
                Every idea you hold is a building waiting to stand.<br />
                Every dream is a district waiting to form.
              </motion.p>
              <motion.button
                className={styles.startBtn}
                onClick={() => setStep(1)}
                onKeyDown={handleKey}
                {...FADE(1.1)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Begin founding ↗
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="input"
              className={styles.content}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: -20 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.brand}>✦ IDEA CITY</div>
              <h1 className={styles.title}>
                What is the first idea<br />that deserves to exist?
              </h1>
              <p className={styles.sub}>
                Type it below. Watch it become the first building<br />in your civilization.
              </p>

              {error && (
                <div style={{
                  background: 'rgba(255,107,107,0.12)',
                  border: '1px solid rgba(255,107,107,0.3)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  marginBottom: 16,
                  color: '#FF6B6B',
                  fontSize: 13,
                  textAlign: 'center',
                  maxWidth: 480,
                  width: '100%',
                }}>
                  {error}
                </div>
              )}

              <div className={styles.inputRow}>
                <input
                  ref={inputRef}
                  className={styles.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="e.g. Learn React, Write a novel, Build a startup…"
                  maxLength={48}
                />
                <motion.button
                  className={styles.foundBtn}
                  onClick={handleFound}
                  disabled={!title.trim()}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Found It ↗
                </motion.button>
              </div>
              <p className={styles.hint}>Press Enter to continue</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="founding"
              className={styles.content}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.brand}>✦ IDEA CITY</div>
              <motion.h1
                className={styles.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Founding your civilization…
              </motion.h1>
              <motion.div
                className={styles.loadDots}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span /><span /><span />
              </motion.div>
              <motion.p
                style={{ color: 'rgba(255,249,240,0.3)', fontSize: 12, marginTop: 24 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Connecting to database…
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}