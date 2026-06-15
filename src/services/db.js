/**
 * Firestore database service
 * Handles all reads/writes for cities, buildings, districts, achievements
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// ── Collection refs ──────────────────────────
const usersCol       = () => collection(db, 'users')
const citiesCol      = () => collection(db, 'cities')
const buildingsCol   = (cityId) => collection(db, 'cities', cityId, 'buildings')
const districtsCol   = (cityId) => collection(db, 'cities', cityId, 'districts')
const achievementsCol= (cityId) => collection(db, 'cities', cityId, 'achievements')

// ── Users ────────────────────────────────────
export async function ensureUser(user) {
  const ref = doc(usersCol(), user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:       user.uid,
      name:      user.displayName || 'Founder',
      email:     user.email || '',
      photoURL:  user.photoURL || '',
      createdAt: serverTimestamp(),
    })
  }
  return snap.data()
}

// ── Cities ───────────────────────────────────
export async function getCityByOwner(uid) {
  const q = query(citiesCol(), where('ownerId', '==', uid))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function createCity(uid, cityName) {
  const ref = await addDoc(citiesCol(), {
    ownerId:    uid,
    cityName,
    createdAt:  serverTimestamp(),
    population: 0,
    level:      1,
  })
  return ref.id
}

export async function updateCity(cityId, data) {
  await updateDoc(doc(citiesCol(), cityId), data)
}

// ── Buildings ────────────────────────────────
export function subscribeBuildings(cityId, callback) {
  const q = query(buildingsCol(cityId), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => {
    const buildings = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(buildings)
  })
}

export async function addBuilding(cityId, data) {
  const ref = await addDoc(buildingsCol(cityId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateBuilding(cityId, buildingId, data) {
  await updateDoc(doc(buildingsCol(cityId), buildingId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function removeBuilding(cityId, buildingId) {
  await deleteDoc(doc(buildingsCol(cityId), buildingId))
}

// ── Districts ────────────────────────────────
export async function getDistricts(cityId) {
  const snap = await getDocs(districtsCol(cityId))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function upsertDistrict(cityId, category, data) {
  const q = query(districtsCol(cityId), where('category', '==', category))
  const snap = await getDocs(q)
  if (snap.empty) {
    await addDoc(districtsCol(cityId), { category, ...data, createdAt: serverTimestamp() })
  } else {
    await updateDoc(doc(districtsCol(cityId), snap.docs[0].id), data)
  }
}

// ── Achievements ─────────────────────────────
export function subscribeAchievements(cityId, callback) {
  const q = query(achievementsCol(cityId), orderBy('unlockedAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const achievements = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(achievements)
  })
}

export async function unlockAchievement(cityId, title, description) {
  await addDoc(achievementsCol(cityId), {
    title,
    description,
    unlockedAt: serverTimestamp(),
  })
}
