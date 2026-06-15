import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CityProvider } from './context/CityContext'
import LoginPage from './pages/LoginPage'
import CityPage  from './pages/CityPage'

function AuthGuard({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null           // Let CityPage handle its own loader
  if (!user)   return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()

  // While auth resolves, show nothing (avoids flash)
  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: '#07090F',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 11, letterSpacing: '0.3em',
          color: '#F5A623',
        }}>
          ✦ IDEA CITY
        </span>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/*"
        element={
          <AuthGuard>
            <CityProvider>
              <CityPage />
            </CityProvider>
          </AuthGuard>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
