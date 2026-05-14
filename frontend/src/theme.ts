import type { Theme, ThemeName } from './types'

export const THEMES: Record<ThemeName, Theme> = {
  gold:   { label: 'Gold',   accent: '#C5A55A', accentDim: '#a08840' },
  blue:   { label: 'Blue',   accent: '#3B82F6', accentDim: '#1d4ed8' },
  red:    { label: 'Red',    accent: '#EF4444', accentDim: '#b91c1c' },
  green:  { label: 'Green',  accent: '#22C55E', accentDim: '#15803d' },
  olive:  { label: 'Olive',  accent: '#84CC16', accentDim: '#4d7c0f' },
  violet: { label: 'Violet', accent: '#8B5CF6', accentDim: '#6d28d9' },
  purple: { label: 'Purple', accent: '#A855F7', accentDim: '#7e22ce' },
  pink:   { label: 'Pink',   accent: '#EC4899', accentDim: '#be185d' },
  orange: { label: 'Orange', accent: '#F97316', accentDim: '#c2410c' },
}

const STORAGE_KEY = 'denon-dashboard-theme'

export function getTheme(serverDefault?: string): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeName | null
  if (stored && THEMES[stored]) return stored
  if (serverDefault && THEMES[serverDefault as ThemeName]) return serverDefault as ThemeName
  return 'gold'
}

export function applyTheme(name: ThemeName): ThemeName {
  const key: ThemeName = THEMES[name] ? name : 'gold'
  const t = THEMES[key]
  const root = document.documentElement
  root.style.setProperty('--accent', t.accent)
  root.style.setProperty('--accent-dim', t.accentDim)
  return key
}

export function setTheme(name: ThemeName): ThemeName {
  const applied = applyTheme(name)
  localStorage.setItem(STORAGE_KEY, applied)
  return applied
}
