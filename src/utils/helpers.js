import { CATEGORIES, DISTRICT_ORIGINS, LEVELS } from './constants'

/**
 * Find a non-overlapping position for a new building of a given category.
 * Buildings radiate outward from their district origin in a spiral.
 */
export function findBuildingPosition(category, existingBuildings) {
  const origin = DISTRICT_ORIGINS[category] || { x: 2500, y: 2000 }
  const same   = existingBuildings.filter((b) => b.category === category)
  const ring   = Math.floor(same.length / 6)
  const slot   = same.length % 6
  const angle  = (slot / 6) * Math.PI * 2 - Math.PI / 2
  const radius = 100 + ring * 95

  return {
    positionX: Math.round(origin.x + Math.cos(angle) * radius - 35),
    positionY: Math.round(origin.y + Math.sin(angle) * radius - 60),
  }
}

/**
 * Compute city population from buildings
 */
export function calcPopulation(buildings) {
  return buildings.reduce((sum, b) => {
    const cat = CATEGORIES[b.category]
    const lvl = b.level || 1
    return sum + (cat ? cat.population : 50) * lvl
  }, 0)
}

/**
 * Get display label for a building level
 */
export function getLevelLabel(level) {
  return LEVELS[level]?.label || 'Seedling'
}

/**
 * Size multiplier for SVG rendering
 */
export function getLevelMult(level) {
  return LEVELS[level]?.sizeMult || 1
}

/**
 * Format large numbers nicely
 */
export function fmtNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

/**
 * Clamp a value between min and max
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

/**
 * Ease in-out quadratic
 */
export function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/**
 * Truncate a string to n characters
 */
export function truncate(str, n = 16) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

/**
 * Generate unique ID (fallback when uuid not available)
 */
export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
