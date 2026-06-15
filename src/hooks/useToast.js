import { useState, useCallback, useRef } from 'react'

export function useToast() {
  const [toast,    setToast]    = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message, accent = null) => {
    clearTimeout(timerRef.current)
    setToast({ message, accent, id: Date.now() })
    timerRef.current = setTimeout(() => setToast(null), 2800)
  }, [])

  const hideToast = useCallback(() => {
    clearTimeout(timerRef.current)
    setToast(null)
  }, [])

  return { toast, showToast, hideToast }
}
