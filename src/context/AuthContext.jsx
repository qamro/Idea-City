import { createContext, useContext, useEffect, useState } from 'react'
import { onAuth } from '../services/auth'
import { ensureUser } from '../services/db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(undefined)  // undefined = loading
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuth(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await ensureUser(firebaseUser)
        } catch (e) {
          // Firestore might be offline — still set the user so the app continues
          console.warn('ensureUser failed (offline?):', e.message)
        }
        setUser(firebaseUser)
      } else {
        setUser(null)
      }
      // Always clear loading no matter what
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
