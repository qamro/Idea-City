/**
 * Core game constants — categories, building metadata, district configs
 */

export const CATEGORIES = {
  idea: {
    icon:        '💡',
    label:       'Idea',
    color:       '#F5A623',
    colorGlow:   'rgba(245,166,35,0.18)',
    colorBorder: 'rgba(245,166,35,0.22)',
    type:        'house',
    population:  42,
    districtName:'Idea Quarter',
  },
  skill: {
    icon:        '⚡',
    label:       'Skill',
    color:       '#00C9B1',
    colorGlow:   'rgba(0,201,177,0.14)',
    colorBorder: 'rgba(0,201,177,0.22)',
    type:        'school',
    population:  88,
    districtName:'Skill Academy',
  },
  project: {
    icon:        '🏗',
    label:       'Project',
    color:       '#8B6FE8',
    colorGlow:   'rgba(139,111,232,0.14)',
    colorBorder: 'rgba(139,111,232,0.22)',
    type:        'factory',
    population:  130,
    districtName:'Workshop District',
  },
  goal: {
    icon:        '🎯',
    label:       'Goal',
    color:       '#FF6B6B',
    colorGlow:   'rgba(255,107,107,0.14)',
    colorBorder: 'rgba(255,107,107,0.22)',
    type:        'tower',
    population:  200,
    districtName:'Ambition Row',
  },
  dream: {
    icon:        '✨',
    label:       'Dream',
    color:       '#C77DFF',
    colorGlow:   'rgba(199,125,255,0.14)',
    colorBorder: 'rgba(199,125,255,0.22)',
    type:        'pagoda',
    population:  55,
    districtName:'Dream Spire',
  },
  learning: {
    icon:        '📚',
    label:       'Learning',
    color:       '#6BCB77',
    colorGlow:   'rgba(107,203,119,0.14)',
    colorBorder: 'rgba(107,203,119,0.22)',
    type:        'library',
    population:  75,
    districtName:'Knowledge Grove',
  },
  achievement: {
    icon:        '🏆',
    label:       'Achievement',
    color:       '#FFD166',
    colorGlow:   'rgba(255,209,102,0.14)',
    colorBorder: 'rgba(255,209,102,0.22)',
    type:        'monument',
    population:  310,
    districtName:'Hall of Fame',
  },
  business: {
    icon:        '🏢',
    label:       'Business',
    color:       '#4FC3F7',
    colorGlow:   'rgba(79,195,247,0.14)',
    colorBorder: 'rgba(79,195,247,0.22)',
    type:        'company',
    population:  180,
    districtName:'Commerce Hub',
  },
}

// Natural district origin positions on the 5000×4000 world
export const DISTRICT_ORIGINS = {
  idea:        { x: 2380, y: 1920 },
  skill:       { x: 2080, y: 2060 },
  project:     { x: 2620, y: 2200 },
  goal:        { x: 2320, y: 2360 },
  dream:       { x: 1880, y: 1960 },
  learning:    { x: 2140, y: 1780 },
  achievement: { x: 2560, y: 1860 },
  business:    { x: 2720, y: 2060 },
}

// Building level definitions
export const LEVELS = {
  1: { label: 'Seedling',   sizeMult: 1.0 },
  2: { label: 'Established',sizeMult: 1.25 },
  3: { label: 'Thriving',   sizeMult: 1.55 },
  4: { label: 'Landmark',   sizeMult: 1.85 },
  5: { label: 'Icon',       sizeMult: 2.2 },
}

// City center
export const WORLD_W  = 5000
export const WORLD_H  = 4000
export const CENTER_X = 2500
export const CENTER_Y = 2000
