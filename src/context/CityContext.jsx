import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import {
  getCityByOwner, createCity, updateCity,
  subscribeBuildings, addBuilding, updateBuilding, removeBuilding,
  subscribeAchievements, unlockAchievement,
  upsertDistrict,
} from '../services/db'
import { findBuildingPosition, calcPopulation } from '../utils/helpers'
import { CATEGORIES } from '../utils/constants'

const CityContext = createContext(null)

export function CityProvider({ children }) {
  const { user }         = useAuth()
  const [city,          setCity]          = useState(null)
  const [buildings,     setBuildings]     = useState([])
  const [achievements,  setAchievements]  = useState([])
  const [cityLoading,   setCityLoading]   = useState(true)
  const [spawnQueue,    setSpawnQueue]    = useState([])

  const unsubBldRef  = useRef(null)
  const unsubAchvRef = useRef(null)

  // ── Bootstrap city for signed-in user ──────
  useEffect(() => {
    if (!user) {
      setCity(null); setBuildings([]); setCityLoading(false)
      return
    }
    let mounted = true

    ;(async () => {
      setCityLoading(true)
      try {
        let existing = await getCityByOwner(user.uid)

        if (!existing) {
          if (mounted) setCityLoading(false)
          return
        }

        if (mounted) setCity(existing)

        unsubBldRef.current?.()
        unsubBldRef.current = subscribeBuildings(existing.id, (blds) => {
          if (mounted) setBuildings(blds)
        })

        unsubAchvRef.current?.()
        unsubAchvRef.current = subscribeAchievements(existing.id, (achvs) => {
          if (mounted) setAchievements(achvs)
        })
      } catch (e) {
        console.error('CityContext bootstrap error:', e.message)
      } finally {
        if (mounted) setCityLoading(false)
      }
    })()

    return () => {
      mounted = false
      unsubBldRef.current?.()
      unsubAchvRef.current?.()
    }
  }, [user])

  // ── Keep population in sync ─────────────────
  useEffect(() => {
    if (!city?.id || !buildings.length) return
    const pop = calcPopulation(buildings)
    if (pop !== city.population) {
      updateCity(city.id, { population: pop }).catch(() => {})
      setCity((c) => c ? { ...c, population: pop } : c)
    }
  }, [buildings, city?.id])

  // ── Found city (first-time flow) ────────────
  const foundCity = useCallback(async (cityName) => {
    if (!user) return null
    try {
      const cityId = await createCity(user.uid, cityName)
      const newCity = { id: cityId, ownerId: user.uid, cityName, population: 0, level: 1 }
      setCity(newCity)

      unsubBldRef.current?.()
      unsubBldRef.current = subscribeBuildings(cityId, setBuildings)
      unsubAchvRef.current?.()
      unsubAchvRef.current = subscribeAchievements(cityId, setAchievements)

      return cityId
    } catch (e) {
      console.error('foundCity error:', e.message)
      return null
    }
  }, [user])

  // ── Add building ────────────────────────────
  const addBuildingToCity = useCallback(async (title, category) => {
    if (!city?.id) return null
    try {
      const pos = findBuildingPosition(category, buildings)
      const data = {
        cityId:    city.id,
        title,
        category,
        level:     1,
        positionX: pos.positionX,
        positionY: pos.positionY,
      }
      const id = await addBuilding(city.id, data)
      setSpawnQueue((q) => [...q, id])

      upsertDistrict(city.id, category, {
        name: CATEGORIES[category]?.districtName || category,
        category,
      }).catch(() => {})

      checkMilestones(buildings.length + 1)
      return id
    } catch (e) {
      console.error('addBuilding error:', e.message)
      return null
    }
  }, [city, buildings])

  // ── Upgrade building ────────────────────────
  const upgradeBuildingLevel = useCallback(async (buildingId) => {
    if (!city?.id) return
    try {
      const b = buildings.find((x) => x.id === buildingId)
      if (!b || (b.level || 1) >= 5) return
      const newLevel = (b.level || 1) + 1
      await updateBuilding(city.id, buildingId, { level: newLevel })
      setSpawnQueue((q) => [...q, buildingId])
    } catch (e) {
      console.error('upgradeBuilding error:', e.message)
    }
  }, [city, buildings])

  // ── Remove building ─────────────────────────
  const removeBuildingFromCity = useCallback(async (buildingId) => {
    if (!city?.id) return
    try {
      await removeBuilding(city.id, buildingId)
    } catch (e) {
      console.error('removeBuilding error:', e.message)
    }
  }, [city])

  // ── Achievement milestones ──────────────────
  const checkMilestones = useCallback(async (count) => {
    if (!city?.id) return
    try {
      const milestones = {
        1:   { title: 'First Light',        description: 'Founded your civilization' },
        5:   { title: 'Village',            description: 'Five ideas standing tall' },
        10:  { title: 'Town of Thought',    description: 'A decade of buildings' },
        25:  { title: 'City of Ideas',      description: 'Twenty-five structures!' },
        50:  { title: 'Metropolis of Mind', description: 'Fifty buildings and counting' },
        100: { title: 'Legendary Skyline',  description: 'One hundred ideas — extraordinary' },
      }
      if (milestones[count]) {
        const { title, description } = milestones[count]
        const already = achievements.some((a) => a.title === title)
        if (!already) await unlockAchievement(city.id, title, description)
      }
    } catch (e) {
      console.error('checkMilestones error:', e.message)
    }
  }, [city, achievements])

  // ── Clear spawn queue entry ─────────────────
  const clearSpawn = useCallback((id) => {
    setSpawnQueue((q) => q.filter((x) => x !== id))
  }, [])

  return (
    <CityContext.Provider value={{
      city,
      buildings,
      achievements,
      cityLoading,
      spawnQueue,
      foundCity,
      addBuildingToCity,
      upgradeBuildingLevel,
      removeBuildingFromCity,
      clearSpawn,
    }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  return useContext(CityContext)
}
