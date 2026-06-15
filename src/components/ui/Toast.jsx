import { AnimatePresence, motion } from 'framer-motion'
import styles from './Toast.module.css'

export default function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className={styles.toast}
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,   scale: 1    }}
          exit={{    opacity: 0, y: -10,  scale: 0.95 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {toast.accent && (
            <span className={styles.accent}>{toast.accent}</span>
          )}
          <span className={styles.msg}>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
