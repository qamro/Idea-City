import { useState } from 'react'
import { motion } from 'framer-motion'
import { signInWithGoogle, signInWithGitHub } from '../services/auth'
import styles from './LoginPage.module.css'

const FADE = (delay = 0) => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function LoginPage() {
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(null) // 'google' | 'github' | null

  async function handleGoogle() {
    setError(null)
    setLoading('google')
    try {
      await signInWithGoogle()
    } catch (e) {
      setError('Could not sign in with Google. Please try again.')
      setLoading(null)
    }
  }

  async function handleGitHub() {
    setError(null)
    setLoading('github')
    try {
      await signInWithGitHub()
    } catch (e) {
      setError('Could not sign in with GitHub. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className={styles.page}>
      {/* Ambient orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* City silhouette */}
      <div className={styles.skyline}>
        <CityLine />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <motion.div className={styles.brand} {...FADE(0.1)}>
          ✦ IDEA CITY
        </motion.div>

        <motion.h1 className={styles.title} {...FADE(0.35)}>
          A civilization built<br />from your mind.
        </motion.h1>

        <motion.p className={styles.sub} {...FADE(0.6)}>
          Every idea becomes a building.<br />
          Every goal becomes a landmark.<br />
          Your city grows as you grow.
        </motion.p>

        <motion.div className={styles.authBox} {...FADE(0.85)}>
          <p className={styles.authLabel}>Begin your civilization</p>

          <button
            className={`${styles.authBtn} ${styles.google}`}
            onClick={handleGoogle}
            disabled={!!loading}
          >
            {loading === 'google' ? (
              <span className={styles.spinner} />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          <button
            className={`${styles.authBtn} ${styles.github}`}
            onClick={handleGitHub}
            disabled={!!loading}
          >
            {loading === 'github' ? (
              <span className={styles.spinner} />
            ) : (
              <GitHubIcon />
            )}
            Continue with GitHub
          </button>

          {error && (
            <motion.p
              className={styles.error}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <p className={styles.fine}>
            By continuing, you agree to build something meaningful.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// ── Decorative city silhouette ────────────────
function CityLine() {
  return (
    <svg
      viewBox="0 0 1440 220"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax meet"
      className={styles.citylineSVG}
    >
      {/* Far-back skyline */}
      <g opacity="0.18">
        {BUILDINGS_FAR.map((b, i) => (
          <rect key={i} x={b.x} y={220 - b.h} width={b.w} height={b.h} rx="1" fill="#F5A623" />
        ))}
      </g>
      {/* Mid skyline */}
      <g opacity="0.32">
        {BUILDINGS_MID.map((b, i) => (
          <rect key={i} x={b.x} y={220 - b.h} width={b.w} height={b.h} rx="1" fill="#8B6FE8" />
        ))}
      </g>
      {/* Front skyline */}
      <g opacity="0.55">
        {BUILDINGS_FRONT.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={220 - b.h} width={b.w} height={b.h} rx="1" fill="#F5A623" />
            {/* windows */}
            {Array.from({ length: Math.floor(b.h / 18) }, (_, r) =>
              Array.from({ length: Math.floor(b.w / 12) }, (_, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={b.x + 3 + c * 12}
                  y={220 - b.h + 6 + r * 18}
                  width={6} height={8}
                  rx="1"
                  fill="#F5A623"
                  opacity={Math.random() > 0.4 ? 0.6 : 0.1}
                />
              ))
            )}
          </g>
        ))}
      </g>
      {/* Ground line */}
      <rect x="0" y="218" width="1440" height="2" fill="rgba(245,166,35,0.2)" />
    </svg>
  )
}

const BUILDINGS_FAR = [
  { x: 20,  h: 80,  w: 18 }, { x: 50,  h: 110, w: 22 }, { x: 85,  h: 65,  w: 16 },
  { x: 120, h: 140, w: 24 }, { x: 160, h: 90,  w: 20 }, { x: 200, h: 120, w: 18 },
  { x: 240, h: 75,  w: 16 }, { x: 270, h: 160, w: 26 }, { x: 310, h: 95,  w: 20 },
  { x: 350, h: 130, w: 22 }, { x: 390, h: 70,  w: 18 }, { x: 430, h: 145, w: 24 },
  { x: 470, h: 88,  w: 20 }, { x: 510, h: 115, w: 22 }, { x: 560, h: 95,  w: 18 },
  { x: 600, h: 170, w: 28 }, { x: 645, h: 80,  w: 20 }, { x: 685, h: 125, w: 22 },
  { x: 730, h: 100, w: 18 }, { x: 770, h: 155, w: 26 }, { x: 820, h: 85,  w: 20 },
  { x: 860, h: 130, w: 24 }, { x: 910, h: 95,  w: 18 }, { x: 950, h: 160, w: 28 },
  { x: 1000,h: 75,  w: 20 }, { x: 1040,h: 140, w: 24 }, { x: 1090,h: 90,  w: 18 },
  { x: 1130,h: 120, w: 22 }, { x: 1180,h: 80,  w: 18 }, { x: 1220,h: 150, w: 26 },
  { x: 1270,h: 95,  w: 20 }, { x: 1310,h: 130, w: 22 }, { x: 1360,h: 70,  w: 16 },
  { x: 1400,h: 110, w: 24 },
]

const BUILDINGS_MID = [
  { x: 0,   h: 100, w: 30 }, { x: 40,  h: 150, w: 35 }, { x: 90,  h: 80,  w: 28 },
  { x: 135, h: 180, w: 38 }, { x: 190, h: 120, w: 32 }, { x: 240, h: 200, w: 40 },
  { x: 295, h: 95,  w: 28 }, { x: 340, h: 165, w: 36 }, { x: 395, h: 110, w: 30 },
  { x: 445, h: 190, w: 38 }, { x: 500, h: 85,  w: 28 }, { x: 545, h: 155, w: 34 },
  { x: 600, h: 130, w: 32 }, { x: 650, h: 210, w: 40 }, { x: 710, h: 100, w: 30 },
  { x: 760, h: 175, w: 36 }, { x: 820, h: 125, w: 32 }, { x: 875, h: 195, w: 38 },
  { x: 935, h: 90,  w: 28 }, { x: 980, h: 160, w: 36 }, { x: 1040,h: 140, w: 32 },
  { x: 1095,h: 185, w: 38 }, { x: 1155,h: 105, w: 30 }, { x: 1205,h: 170, w: 36 },
  { x: 1265,h: 120, w: 32 }, { x: 1320,h: 200, w: 40 }, { x: 1380,h: 90,  w: 28 },
  { x: 1420,h: 150, w: 34 },
]

const BUILDINGS_FRONT = [
  { x: 10,  h: 130, w: 44 }, { x: 65,  h: 200, w: 48 }, { x: 125, h: 160, w: 40 },
  { x: 180, h: 240, w: 52 }, { x: 250, h: 140, w: 44 }, { x: 310, h: 220, w: 50 },
  { x: 380, h: 175, w: 44 }, { x: 440, h: 260, w: 54 }, { x: 515, h: 150, w: 42 },
  { x: 575, h: 230, w: 50 }, { x: 645, h: 185, w: 46 }, { x: 715, h: 280, w: 56 },
  { x: 795, h: 155, w: 44 }, { x: 860, h: 245, w: 52 }, { x: 935, h: 195, w: 48 },
  { x: 1010,h: 265, w: 54 }, { x: 1090,h: 145, w: 42 }, { x: 1150,h: 225, w: 50 },
  { x: 1225,h: 180, w: 46 }, { x: 1295,h: 255, w: 52 }, { x: 1375,h: 160, w: 44 },
]

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}
