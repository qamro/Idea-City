import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCity } from '../../context/CityContext'
import styles from './Onboarding.module.css'

const FADE_UP = (delay) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function Onboarding({ onComplete }) {
  const { foundCity, addBuildingToCity } = useCity()
  const [step,    setStep]    = useState(0)   // 0 = welcome, 1 = input, 2 = founding
  const [title,   setTitle]   = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (step === 1) setTimeout(() => inputRef.current?.focus(), 400)
  }, [step])

  async function handleFound() {
    const t = title.trim()
    if (!t) { inputRef.current?.focus(); return }
    setLoading(true)
    setStep(2)

    // Create the city named after the user's first idea
    const cityName = `${t} City`
    const cityId = await foundCity(cityName)

    // Place the first building
    if (cityId) {
      await addBuildingToCity(t, 'idea')
    }

    setLoading(false)
    onComplete()
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
        {/* Background ambient glow */}
        <div className={styles.ambientGlow} />

        {/* Step 0 — Welcome */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              className={styles.content}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div className={styles.brand} {...FADE_UP(0.2)}>
                ✦ IDEA CITY
              </motion.div>

              <motion.h1 className={styles.title} {...FADE_UP(0.5)}>
                Your civilization has<br />not yet been founded.
              </motion.h1>

              <motion.p className={styles.sub} {...FADE_UP(0.8)}>
                Every idea you hold is a building waiting to stand.<br />
                Every dream is a district waiting to form.
              </motion.p>

              <motion.button
                className={styles.startBtn}
                onClick={() => setStep(1)}
                onKeyDown={handleKey}
                {...FADE_UP(1.1)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Begin founding ↗
              </motion.button>
            </motion.div>
          )}

          {/* Step 1 — First idea input */}
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

          {/* Step 2 — Founding animation */}
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
