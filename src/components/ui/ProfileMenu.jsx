import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useCity } from '../../context/CityContext'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { calcPopulation, fmtNum } from '../../utils/helpers'
import styles from './ProfileMenu.module.css'

export default function ProfileMenu({ onSignOut }) {
  const { user }            = useAuth()
  const { city, buildings } = useCity()
  const [open,        setOpen]        = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [name,        setName]        = useState(user?.displayName || 'Founder')
  const [desc,        setDesc]        = useState('')
  const [avatar,      setAvatar]      = useState(null) // base64
  const [saving,      setSaving]      = useState(false)
  const menuRef    = useRef(null)
  const fileRef    = useRef(null)
  const nameRef    = useRef(null)
  const descRef    = useRef(null)

  const pop       = fmtNum(calcPopulation(buildings))
  const districts = new Set(buildings.map(b => b.category)).size
  const initial   = (name || user?.displayName || user?.email || 'F').charAt(0).toUpperCase()
  const photoURL  = avatar || user?.photoURL

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Focus inputs when editing
  useEffect(() => { if (editingName) setTimeout(() => nameRef.current?.focus(), 50) }, [editingName])
  useEffect(() => { if (editingDesc) setTimeout(() => descRef.current?.focus(), 50) }, [editingDesc])

  // Load saved profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`ic_profile_${user?.uid}`)
    if (saved) {
      const p = JSON.parse(saved)
      if (p.name)   setName(p.name)
      if (p.desc)   setDesc(p.desc)
      if (p.avatar) setAvatar(p.avatar)
    }
  }, [user?.uid])

  function saveToLocal(updates) {
    const existing = JSON.parse(localStorage.getItem(`ic_profile_${user?.uid}`) || '{}')
    localStorage.setItem(`ic_profile_${user?.uid}`, JSON.stringify({ ...existing, ...updates }))
  }

  async function saveName() {
    if (!name.trim()) return
    setSaving(true)
    saveToLocal({ name })
    setEditingName(false)
    setSaving(false)
  }

  async function saveDesc() {
    setSaving(true)
    saveToLocal({ desc })
    setEditingDesc(false)
    setSaving(false)
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const b64 = ev.target.result
      setAvatar(b64)
      saveToLocal({ avatar: b64 })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div ref={menuRef} className={styles.wrap}>
      {/* Avatar button */}
      <button className={styles.avatarBtn} onClick={() => setOpen(o => !o)}>
        {photoURL ? (
          <img src={photoURL} alt="avatar" className={styles.avatarImg} />
        ) : (
          <span className={styles.avatarInitial}>{initial}</span>
        )}
        <div className={`${styles.onlineDot}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className={styles.header}>
              {/* Avatar + upload */}
              <div className={styles.avatarLarge} onClick={() => fileRef.current?.click()}>
                {photoURL ? (
                  <img src={photoURL} alt="avatar" className={styles.avatarLargeImg} />
                ) : (
                  <span className={styles.avatarLargeInitial}>{initial}</span>
                )}
                <div className={styles.avatarOverlay}>
                  <span>📷</span>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Name */}
              <div className={styles.nameWrap}>
                {editingName ? (
                  <div className={styles.inlineEdit}>
                    <input
                      ref={nameRef}
                      className={styles.inlineInput}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
                      maxLength={32}
                    />
                    <button className={styles.saveBtn} onClick={saveName}>✓</button>
                  </div>
                ) : (
                  <div className={styles.nameRow}>
                    <span className={styles.nameText}>{name}</span>
                    <button className={styles.editBtn} onClick={() => setEditingName(true)}>✏️</button>
                  </div>
                )}
                <span className={styles.email}>{user?.email}</span>
              </div>
            </div>

            {/* Description */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>About me</div>
              {editingDesc ? (
                <div className={styles.descEditWrap}>
                  <textarea
                    ref={descRef}
                    className={styles.descInput}
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Escape') setEditingDesc(false) }}
                    placeholder="What drives your civilization?"
                    maxLength={120}
                    rows={3}
                  />
                  <button className={styles.saveBtn} onClick={saveDesc}>Save</button>
                </div>
              ) : (
                <div className={styles.descRow} onClick={() => setEditingDesc(true)}>
                  <span className={styles.descText}>
                    {desc || 'Add a description…'}
                  </span>
                  <button className={styles.editBtn}>✏️</button>
                </div>
              )}
            </div>

            {/* City stats */}
            <div className={styles.section}>
              <div className={styles.sectionLabel}>My Civilization</div>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statVal} style={{ color: '#F5A623' }}>{pop}</span>
                  <span className={styles.statLbl}>residents</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statVal} style={{ color: '#00C9B1' }}>{districts}</span>
                  <span className={styles.statLbl}>districts</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statVal} style={{ color: '#8B6FE8' }}>{buildings.length}</span>
                  <span className={styles.statLbl}>buildings</span>
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            {/* Sign out */}
            <button
              className={styles.signOutBtn}
              onClick={() => { setOpen(false); onSignOut() }}
            >
              <span>🚪</span>
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}