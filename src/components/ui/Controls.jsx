import { motion } from 'framer-motion'
import styles from './Controls.module.css'

export function ZoomControls({ onZoomIn, onZoomOut, onHome }) {
  return (
    <motion.div
      className={styles.zoomWrap}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <button className={styles.zBtn} onClick={onZoomIn}  title="Zoom in">+</button>
      <button className={styles.zBtn} onClick={onZoomOut} title="Zoom out">−</button>
      <button className={styles.zBtn} onClick={onHome}    title="Reset view" style={{ fontSize: 13 }}>⌂</button>
    </motion.div>
  )
}

export function AddButton({ onClick }) {
  return (
    <motion.button
      className={styles.addBtn}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1   }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{   scale: 0.93 }}
      title="Add new building (N)"
    >
      +
    </motion.button>
  )
}
