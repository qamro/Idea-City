import { useState, useEffect, useCallback, useRef } from 'react'
import { useCity } from '../context/CityContext'
import { useAuth } from '../context/AuthContext'
import { useCamera } from '../hooks/useCamera'
import { useToast } from '../hooks/useToast'
import { signOut } from '../services/auth'

import StarField        from '../components/city/StarField'
import CityCanvas       from '../components/city/CityCanvas'
import TopBar           from '../components/ui/TopBar'
import { ZoomControls, AddButton } from '../components/ui/Controls'
import BuildingDetail   from '../components/ui/BuildingDetail'
import AddBuildingModal from '../components/ui/AddBuildingModal'
import Onboarding       from '../components/onboarding/Onboarding'
import Toast            from '../components/ui/Toast'

import styles from './CityPage.module.css'

export default function CityPage() {
  const { user }   = useAuth()
  const {
    city, buildings, cityLoading,
    addBuildingToCity, upgradeBuildingLevel, removeBuildingFromCity,
  } = useCity()

  const camera = useCamera()
  const { toast, showToast } = useToast()

  const [dayMode,     setDayMode]     = useState(() => localStorage.getItem('ic_day') === '1')
  const [showModal,   setShowModal]   = useState(false)
  const [selectedBld, setSelectedBld] = useState(null)
  const [showOnboard, setShowOnboard] = useState(false)
  const [showSignOut, setShowSignOut] = useState(false)
  const containerRef  = useRef(null)

  // Show "sign out" button after 4 seconds of loading
  useEffect(() => {
    if (cityLoading) {
      const t = setTimeout(() => setShowSignOut(true), 4000)
      return () => clearTimeout(t)
    } else {
      setShowSignOut(false)
    }
  }, [cityLoading])

  useEffect(() => {
    if (!cityLoading && !city) setShowOnboard(true)
    if (city) setShowOnboard(false)
  }, [city, cityLoading])

  useEffect(() => {
    if (city && containerRef.current) {
      const { offsetWidth: w, offsetHeight: h } = containerRef.current
      camera.initView(w, h)
    }
  }, [city])

  function handleOnboardComplete() {
    setShowOnboard(false)
    setTimeout(() => {
      const first = buildings[0]
      if (first) {
        camera.smoothTo(
          window.innerWidth  / 2 - (first.positionX + 35) * 1.3,
          window.innerHeight / 2 - (first.positionY + 60) * 1.3,
          1.3, 1600,
        )
      }
    }, 500)
  }

  function toggleDay() {
    setDayMode((d) => {
      const next = !d
      localStorage.setItem('ic_day', next ? '1' : '0')
      showToast(next ? '☀️ Day Mode' : '🌙 Night Mode')
      return next
    })
  }

  async function handleAdd(title, category) {
    await addBuildingToCity(title, category)
    showToast(title, '✦ founded')
  }

  async function handleUpgrade(buildingId) {
    await upgradeBuildingLevel(buildingId)
    const b = buildings.find((x) => x.id === buildingId)
    if (b) showToast(b.title, '↑ leveled up')
    setSelectedBld((prev) =>
      prev ? { ...prev, level: Math.min((prev.level || 1) + 1, 5) } : prev
    )
  }

  async function handleRemove(buildingId) {
    const b = buildings.find((x) => x.id === buildingId)
    await removeBuildingFromCity(buildingId)
    setSelectedBld(null)
    if (b) showToast(b.title, 'demolished')
  }

  function handleBuildingClick(building) {
    setSelectedBld(building)
    camera.panToWorld(building.positionX, building.positionY)
  }

  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'n' || e.key === 'N') setShowModal(true)
      if (e.key === 'Escape') { setShowModal(false); setSelectedBld(null) }
      if (e.key === 't' || e.key === 'T') toggleDay()
      if (e.key === '+' || e.key === '=') camera.zoomIn()
      if (e.key === '-') camera.zoomOut()
      if (e.key === '0') camera.goHome()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [camera])

  async function handleSignOut() {
    await signOut()
  }

  // ── Loading screen with escape hatch ────────
  if (cityLoading) {
    return (
      <div className={styles.loadScreen}>
        <div className={styles.loadBrand}>✦ IDEA CITY</div>
        <div className={styles.loadDots}>
          <span /><span /><span />
        </div>
        {showSignOut && (
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <p style={{ color: 'rgba(255,249,240,0.4)', fontSize: 13 }}>
              Taking too long to connect…
            </p>
            <button
              onClick={handleSignOut}
              style={{
                background: 'rgba(255,107,107,0.15)',
                border: '1px solid rgba(255,107,107,0.3)',
                borderRadius: 50,
                padding: '10px 24px',
                color: '#FF6B6B',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Sign Out & Try Again
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.page} ${dayMode ? styles.day : styles.night}`}
    >
      <div className={`${styles.sky} ${dayMode ? styles.skyDay : styles.skyNight}`} />
      <StarField visible={!dayMode} />
      <div className={`${styles.ground} ${dayMode ? styles.groundDay : ''}`} />

      {city && (
        <CityCanvas
          camera={camera}
          dayMode={dayMode}
          selectedId={selectedBld?.id}
          onBuildingClick={handleBuildingClick}
          onCanvasClick={() => setSelectedBld(null)}
        />
      )}

      {showOnboard && <Onboarding onComplete={handleOnboardComplete} />}

      {city && (
        <div className={styles.uiLayer}>
          <TopBar
            dayMode={dayMode}
            onToggleDay={toggleDay}
            onSignOut={handleSignOut}
            userName={user?.displayName || user?.email || ''}
          />
          <ZoomControls
            onZoomIn={() => camera.zoomIn()}
            onZoomOut={() => camera.zoomOut()}
            onHome={() => camera.goHome()}
          />
          <AddButton onClick={() => setShowModal(true)} />
          {selectedBld && (
            <BuildingDetail
              building={selectedBld}
              onClose={() => setSelectedBld(null)}
              onUpgrade={handleUpgrade}
              onRemove={handleRemove}
            />
          )}
          <Toast toast={toast} />
        </div>
      )}

      <AddBuildingModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAdd}
      />
    </div>
  )
}