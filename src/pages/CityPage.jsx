import { useState, useEffect, useCallback, useRef } from 'react'
import { useCity } from '../context/CityContext'
import { useAuth } from '../context/AuthContext'
import { useCamera } from '../hooks/useCamera'
import { useToast } from '../hooks/useToast'
import { signOut } from '../services/auth'

import StarField      from '../components/city/StarField'
import CityCanvas     from '../components/city/CityCanvas'
import TopBar         from '../components/ui/TopBar'
import { ZoomControls, AddButton } from '../components/ui/Controls'
import BuildingDetail from '../components/ui/BuildingDetail'
import AddBuildingModal from '../components/ui/AddBuildingModal'
import Onboarding     from '../components/onboarding/Onboarding'
import Toast          from '../components/ui/Toast'

import styles from './CityPage.module.css'

export default function CityPage() {
  const { user }   = useAuth()
  const {
    city, buildings, cityLoading,
    addBuildingToCity, upgradeBuildingLevel, removeBuildingFromCity,
  } = useCity()

  const camera = useCamera()
  const { toast, showToast } = useToast()

  const [dayMode,      setDayMode]      = useState(() => localStorage.getItem('ic_day') === '1')
  const [showModal,    setShowModal]    = useState(false)
  const [selectedBld,  setSelectedBld]  = useState(null)
  const [showOnboard,  setShowOnboard]  = useState(false)
  const containerRef   = useRef(null)

  // ── Determine if onboarding is needed ─────
  useEffect(() => {
    if (!cityLoading && !city) setShowOnboard(true)
    if (city) setShowOnboard(false)
  }, [city, cityLoading])

  // ── Init camera once city loads ────────────
  useEffect(() => {
    if (city && containerRef.current) {
      const { offsetWidth: w, offsetHeight: h } = containerRef.current
      camera.initView(w, h)
    }
  }, [city])

  // ── After onboarding: zoom into first building ──
  function handleOnboardComplete() {
    setShowOnboard(false)
    // Small delay to let building render, then cinematic zoom
    setTimeout(() => {
      const first = buildings[0]
      if (first) {
        camera.smoothTo(
          window.innerWidth  / 2 - (first.positionX + 35) * 1.3,
          window.innerHeight / 2 - (first.positionY + 60) * 1.3,
          1.3,
          1600,
        )
      }
    }, 500)
  }

  // ── Day/Night ──────────────────────────────
  function toggleDay() {
    setDayMode((d) => {
      const next = !d
      localStorage.setItem('ic_day', next ? '1' : '0')
      showToast(next ? '☀️ Day Mode' : '🌙 Night Mode')
      return next
    })
  }

  // ── Add building ────────────────────────────
  async function handleAdd(title, category) {
    await addBuildingToCity(title, category)
    showToast(title, '✦ founded')
  }

  // ── Upgrade ────────────────────────────────
  async function handleUpgrade(buildingId) {
    await upgradeBuildingLevel(buildingId)
    const b = buildings.find((x) => x.id === buildingId)
    if (b) showToast(b.title, '↑ leveled up')
    // Refresh selected
    setSelectedBld((prev) => prev
      ? { ...prev, level: Math.min((prev.level || 1) + 1, 5) }
      : prev
    )
  }

  // ── Remove ──────────────────────────────────
  async function handleRemove(buildingId) {
    const b = buildings.find((x) => x.id === buildingId)
    await removeBuildingFromCity(buildingId)
    setSelectedBld(null)
    if (b) showToast(b.title, 'demolished')
  }

  // ── Select building + pan to it ─────────────
  function handleBuildingClick(building) {
    setSelectedBld(building)
    camera.panToWorld(building.positionX, building.positionY)
  }

  // ── Keyboard shortcuts ─────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'n' || e.key === 'N') setShowModal(true)
      if (e.key === 'Escape') { setShowModal(false); setSelectedBld(null) }
      if (e.key === 't' || e.key === 'T') toggleDay()
      if (e.key === '+' || e.key === '=') camera.zoomIn()
      if (e.key === '-')                   camera.zoomOut()
      if (e.key === '0')                   camera.goHome()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [camera, toggleDay])

  // ── Sign out ────────────────────────────────
  async function handleSignOut() {
    await signOut()
  }

  // ── Loading splash ─────────────────────────
  if (cityLoading) {
    return (
      <div className={styles.loadScreen}>
        <div className={styles.loadBrand}>✦ IDEA CITY</div>
        <div className={styles.loadDots}>
          <span /><span /><span />
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.page} ${dayMode ? styles.day : styles.night}`}
    >
      {/* Sky */}
      <div className={`${styles.sky} ${dayMode ? styles.skyDay : styles.skyNight}`} />

      {/* Stars (night only) */}
      <StarField visible={!dayMode} />

      {/* Ground gradient */}
      <div className={`${styles.ground} ${dayMode ? styles.groundDay : ''}`} />

      {/* City canvas — pan/zoom world */}
      {city && (
        <CityCanvas
          camera={camera}
          dayMode={dayMode}
          selectedId={selectedBld?.id}
          onBuildingClick={handleBuildingClick}
          onCanvasClick={() => setSelectedBld(null)}
        />
      )}

      {/* Onboarding overlay */}
      {showOnboard && (
        <Onboarding onComplete={handleOnboardComplete} />
      )}

      {/* UI overlay — always on top */}
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

          {/* Building detail panel */}
          {selectedBld && (
            <BuildingDetail
              building={selectedBld}
              onClose={() => setSelectedBld(null)}
              onUpgrade={handleUpgrade}
              onRemove={handleRemove}
            />
          )}

          {/* Toast */}
          <Toast toast={toast} />
        </div>
      )}

      {/* Add building modal */}
      <AddBuildingModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAdd}
      />
    </div>
  )
}
