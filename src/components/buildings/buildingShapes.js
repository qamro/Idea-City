/**
 * Building SVG shapes — 8 architectural types, 5 levels each
 * All shapes are pure SVG strings, rendered via dangerouslySetInnerHTML
 */

const WINDOW_ANIM = 'windowFlicker'

function win(x, y, w, h, color, anim = false) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="${color}" opacity="0.85" ${anim ? `style="animation:${WINDOW_ANIM} ${3 + Math.random() * 3}s ease-in-out infinite"` : ''}/>`
}

// ── house ────────────────────────────────────────────────────
function house(W, H, c) {
  const mid = W / 2
  return `
    <polygon points="${mid},4 2,${H * 0.44} ${W - 2},${H * 0.44}" fill="${c}" opacity="0.94"/>
    <rect x="5" y="${H * 0.42}" width="${W - 10}" height="${H * 0.58}" rx="2" fill="${c}" opacity="0.86"/>
    ${win(W * 0.08, H * 0.5, W * 0.28, H * 0.26, c + '44', true)}
    ${win(W * 0.64, H * 0.5, W * 0.28, H * 0.26, c + '44', true)}
    <rect x="${W * 0.34}" y="${H * 0.65}" width="${W * 0.32}" height="${H * 0.35}" rx="1" fill="${c}33"/>
    <circle cx="${mid}" cy="${H * 0.42}" r="2.5" fill="${c}99"/>
  `
}

// ── school ────────────────────────────────────────────────────
function school(W, H, c) {
  const cols = Math.max(3, Math.round(W / 18))
  const wins = Array.from({ length: cols }, (_, i) => {
    const gx = W * 0.04 + (i / cols) * W * 0.92
    return win(gx, H * 0.36, W * 0.08, H * 0.2, c + '44', true)
  }).join('')
  return `
    <rect x="2" y="${H * 0.28}" width="${W - 4}" height="${H * 0.72}" rx="2" fill="${c}" opacity="0.84"/>
    <rect x="${W * 0.3}" y="${H * 0.08}" width="${W * 0.4}" height="${H * 0.24}" rx="2" fill="${c}"/>
    <rect x="${W * 0.42}" y="2" width="${W * 0.16}" height="${H * 0.12}" rx="1" fill="${c}cc"/>
    ${wins}
    <rect x="${W * 0.32}" y="${H * 0.6}" width="${W * 0.36}" height="${H * 0.4}" rx="1" fill="${c}22"/>
  `
}

// ── factory ────────────────────────────────────────────────────
function factory(W, H, c) {
  return `
    <rect x="2" y="${H * 0.44}" width="${W - 4}" height="${H * 0.56}" rx="1" fill="${c}" opacity="0.82"/>
    <rect x="${W * 0.04}" y="${H * 0.18}" width="${W * 0.24}" height="${H * 0.3}" rx="1" fill="${c}cc"/>
    <rect x="${W * 0.35}" y="${H * 0.06}" width="${W * 0.2}" height="${H * 0.42}" rx="1" fill="${c}cc"/>
    <rect x="${W * 0.63}" y="${H * 0.16}" width="${W * 0.2}" height="${H * 0.32}" rx="1" fill="${c}cc"/>
    ${win(W * 0.08, H * 0.52, W * 0.22, H * 0.28, c + '33', true)}
    ${win(W * 0.39, H * 0.52, W * 0.22, H * 0.28, c + '33', true)}
    ${win(W * 0.7, H * 0.52, W * 0.22, H * 0.28, c + '33', true)}
    <rect x="0" y="${H * 0.42}" width="${W}" height="${H * 0.06}" rx="0" fill="${c}55"/>
  `
}

// ── tower ────────────────────────────────────────────────────
function tower(W, H, c) {
  const rows = Math.max(5, Math.round(H / 16))
  const wins = Array.from({ length: rows }, (_, i) => {
    const gy = H * 0.06 + (i / rows) * H * 0.7
    return `
      ${win(W * 0.18, gy, W * 0.25, H * 0.06, c + '33', true)}
      ${win(W * 0.57, gy, W * 0.25, H * 0.06, c + '33', true)}
    `
  }).join('')
  return `
    <rect x="${W * 0.28}" y="2" width="${W * 0.44}" height="${H * 0.98}" rx="3" fill="${c}" opacity="0.9"/>
    <rect x="${W * 0.12}" y="${H * 0.54}" width="${W * 0.76}" height="${H * 0.46}" rx="2" fill="${c}"/>
    ${wins}
    <circle cx="${W / 2}" cy="2" r="3.5" fill="${c}bb"/>
    <line x1="${W / 2}" y1="2" x2="${W / 2}" y2="-14" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
  `
}

// ── pagoda ────────────────────────────────────────────────────
function pagoda(W, H, c) {
  const tiers = [
    { top: 0.0, bot: 0.24, wMul: 0.22 },
    { top: 0.24, bot: 0.52, wMul: 0.44 },
    { top: 0.52, bot: 0.78, wMul: 0.68 },
  ]
  return tiers.map(({ top, bot, wMul }) => {
    const eW = W * wMul
    const eX = (W - eW) / 2
    return `
      <polygon points="${W / 2},${H * top + 2} ${eX},${H * bot} ${eX + eW},${H * bot}" fill="${c}" opacity="0.9"/>
      <rect x="${eX - 4}" y="${H * bot - 4}" width="${eW + 8}" height="${H * 0.06}" rx="1" fill="${c}"/>
    `
  }).join('') + `
    <rect x="${W * 0.34}" y="${H * 0.78}" width="${W * 0.32}" height="${H * 0.22}" rx="1" fill="${c}33"/>
    <circle cx="${W / 2}" cy="${H * 0.04}" r="4" fill="${c}cc"/>
  `
}

// ── library ────────────────────────────────────────────────────
function library(W, H, c) {
  const colCount = Math.max(4, Math.round(W / 14))
  const cols = Array.from({ length: colCount }, (_, i) => {
    const gx = W * 0.04 + (i / colCount) * W * 0.92
    return win(gx, H * 0.42, W * 0.07, H * 0.36, c + '44', true)
  }).join('')
  return `
    <rect x="2" y="${H * 0.32}" width="${W - 4}" height="${H * 0.68}" rx="2" fill="${c}" opacity="0.86"/>
    <polygon points="${W / 2},${H * 0.06} 2,${H * 0.34} ${W - 2},${H * 0.34}" fill="${c}ee"/>
    ${cols}
    <rect x="${W * 0.3}" y="${H * 0.76}" width="${W * 0.4}" height="${H * 0.24}" rx="1" fill="${c}22"/>
    <rect x="${W * 0.08}" y="${H * 0.76}" width="${W * 0.16}" height="${H * 0.24}" rx="1" fill="${c}22"/>
    <rect x="${W * 0.76}" y="${H * 0.76}" width="${W * 0.16}" height="${H * 0.24}" rx="1" fill="${c}22"/>
    <rect x="${W * 0.44}" y="${H * 0.22}" width="${W * 0.12}" height="${H * 0.14}" rx="50" fill="${c}66"/>
  `
}

// ── monument ────────────────────────────────────────────────────
function monument(W, H, c) {
  const mid = W / 2
  return `
    <polygon points="${mid},2 ${mid - 7},${H * 0.56} ${mid + 7},${H * 0.56}" fill="${c}"/>
    <rect x="${mid - 14}" y="${H * 0.54}" width="28" height="${H * 0.1}" rx="1" fill="${c}"/>
    <rect x="${mid - 20}" y="${H * 0.62}" width="40" height="${H * 0.1}" rx="1" fill="${c}"/>
    <rect x="${mid - 26}" y="${H * 0.7}" width="52" height="${H * 0.1}" rx="1" fill="${c}" opacity="0.92"/>
    <rect x="${mid - 32}" y="${H * 0.78}" width="64" height="${H * 0.22}" rx="2" fill="${c}" opacity="0.88"/>
    <circle cx="${mid}" cy="${H * 0.12}" r="4.5" fill="${c}cc"/>
    <circle cx="${mid}" cy="${H * 0.12}" r="2" fill="${c}"/>
  `
}

// ── company ────────────────────────────────────────────────────
function company(W, H, c) {
  const rows = Math.max(6, Math.round(H / 14))
  const wins = Array.from({ length: rows }, (_, r) => {
    return [0, 1, 2].map((col) => {
      const gx = W * 0.07 + col * (W * 0.31)
      const gy = H * 0.1 + (r / rows) * H * 0.8
      return win(gx, gy, W * 0.22, H * 0.07, c + '30', true)
    }).join('')
  }).join('')
  return `
    <rect x="4" y="2" width="${W - 8}" height="${H - 2}" rx="3" fill="${c}" opacity="0.82"/>
    <rect x="0" y="2" width="${W}" height="${H * 0.08}" rx="2" fill="${c}"/>
    ${wins}
    <rect x="${W * 0.25}" y="${H * 0.84}" width="${W * 0.5}" height="${H * 0.16}" rx="1" fill="${c}33"/>
  `
}

// ── Shape dispatch ────────────────────────────────────────────
const SHAPE_FNS = { house, school, factory, tower, pagoda, library, monument, company }

/**
 * Generate an SVG string for a building
 * @param {string} type      - architectural type
 * @param {string} color     - hex color
 * @param {number} level     - 1–5
 */
export function buildingSVGString(type, color, level = 1) {
  const BASE_W = 54
  const BASE_H = 52
  const mult   = 1 + (level - 1) * 0.28
  const W      = Math.round(BASE_W * mult)
  const H      = Math.round(BASE_H * mult)

  const fn     = SHAPE_FNS[type] || SHAPE_FNS.house
  const inner  = fn(W, H, color)

  return { svg: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`, W, H }
}
