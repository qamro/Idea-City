import { motion } from 'framer-motion'
import { useCity } from '../../context/CityContext'
import { calcPopulation, fmtNum } from '../../utils/helpers'
import { CATEGORIES } from '../../utils/constants'
import styles from './TopBar.module.css'

export default function TopBar({ dayMode, onToggleDay, onSignOut, userName }) {
  const { city, buildings } = useCity()

  const pop       = fmtNum(calcPopulation(buildings))
  const districts = new Set(buildings.map((b) => b.category)).size
  const count     = buildings.length

  return (
    <motion.div
      className={styles.bar}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* City name */}
      <span className={styles.cityName}>
        {city?.cityName?.toUpperCase() || 'IDEA CITY'}
      </span>

      <div className={styles.divider} />

      {/* Stats */}
      <Stat dot="#F5A623" value={pop}      label="pop" />
      <Stat dot="#00C9B1" value={districts} label="districts" />
      <Stat dot="#8B6FE8" value={count}    label="buildings" />

      <div className={styles.divider} />

      {/* Day/Night */}
      <button
        className={`${styles.timeToggle} ${dayMode ? styles.day : ''}`}
        onClick={onToggleDay}
        title={dayMode ? 'Switch to night' : 'Switch to day'}
      >
        <motion.div
          className={styles.toggleBall}
          animate={{ x: dayMode ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {dayMode ? '☀️' : '🌙'}
        </motion.div>
      </button>

      {/* User avatar / sign out */}
      {userName && (
        <button className={styles.avatar} onClick={onSignOut} title="Sign out">
          {userName.charAt(0).toUpperCase()}
        </button>
      )}
    </motion.div>
  )
}

function Stat({ dot, value, label }) {
  return (
    <div className={styles.stat}>
      <div className={styles.dot} style={{ background: dot }} />
      <strong className={styles.val}>{value}</strong>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
