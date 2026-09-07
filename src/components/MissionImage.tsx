/* eslint-disable react-refresh/only-export-components */
import type { CSSProperties } from 'react'
import './MissionImage.css'

const SYMBOLS = ['🧪', '⚗️', '🔬', '✨', '🌈', '👻', '🐉', '📷', '🌙', '🪄', '🧿', '🦠']
const MOODS = ['lustig', 'gruselig', 'eklig', 'magisch', 'geheimnisvoll', 'niedlich'] as const

export const CUSTOM_IMAGE_BACKGROUNDS = [
  { id: 'violet', label: 'Violettes Labor', hue: 276, secondHue: 205 },
  { id: 'aqua', label: 'Türkiser Nebel', hue: 178, secondHue: 225 },
  { id: 'acid', label: 'Giftgrüner Schleim', hue: 96, secondHue: 164 },
  { id: 'blood', label: 'Blutroter Mond', hue: 344, secondHue: 16 },
  { id: 'gold', label: 'Goldener Zauber', hue: 38, secondHue: 288 },
  { id: 'midnight', label: 'Geheimnisvolle Nacht', hue: 228, secondHue: 275 },
] as const

export const CUSTOM_IMAGE_SYMBOLS = [
  { id: 'potion', label: 'Zaubertrank', symbol: '🧪' },
  { id: 'ghost', label: 'Geist', symbol: '👻' },
  { id: 'monster', label: 'Monster', symbol: '👾' },
  { id: 'microscope', label: 'Mikroskop', symbol: '🔬' },
  { id: 'camera', label: 'Kamera', symbol: '📷' },
  { id: 'dragon', label: 'Drache', symbol: '🐉' },
  { id: 'moon', label: 'Mond', symbol: '🌙' },
  { id: 'wand', label: 'Zauberstab', symbol: '🪄' },
  { id: 'plant', label: 'Pflanze', symbol: '🌱' },
  { id: 'idea', label: 'Erfindung', symbol: '💡' },
] as const

export const CUSTOM_IMAGE_MOODS = MOODS.map((id) => ({
  id,
  label: id.charAt(0).toUpperCase() + id.slice(1),
}))

export interface CustomMissionImageSelection {
  background: (typeof CUSTOM_IMAGE_BACKGROUNDS)[number]['id']
  symbol: (typeof CUSTOM_IMAGE_SYMBOLS)[number]['id']
  mood: (typeof MOODS)[number]
}

export const DEFAULT_CUSTOM_IMAGE: CustomMissionImageSelection = {
  background: 'violet',
  symbol: 'potion',
  mood: 'magisch',
}

export function encodeCustomMissionImage(selection: CustomMissionImageSelection): string {
  return `custom-v1:${selection.background}:${selection.symbol}:${selection.mood}`
}

export function decodeCustomMissionImage(placeholder: string): CustomMissionImageSelection {
  const [prefix, background, symbol, mood] = placeholder.split(':')
  if (
    prefix === 'custom-v1' &&
    CUSTOM_IMAGE_BACKGROUNDS.some((item) => item.id === background) &&
    CUSTOM_IMAGE_SYMBOLS.some((item) => item.id === symbol) &&
    MOODS.some((item) => item === mood)
  ) {
    return { background, symbol, mood } as CustomMissionImageSelection
  }
  return DEFAULT_CUSTOM_IMAGE
}

function hashText(value: string) {
  let hash = 2166136261
  for (const character of value) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function getMissionVisualSpec(placeholder: string, title: string) {
  if (placeholder.startsWith('custom-v1:')) {
    const selection = decodeCustomMissionImage(placeholder)
    const background = CUSTOM_IMAGE_BACKGROUNDS.find((item) => item.id === selection.background)!
    const symbol = CUSTOM_IMAGE_SYMBOLS.find((item) => item.id === selection.symbol)!
    const hash = hashText(`${placeholder}:${title}`)
    return {
      fingerprint: `${placeholder}-${title}`,
      hue: background.hue,
      secondHue: background.secondHue,
      symbol: symbol.symbol,
      accent: selection.mood === 'gruselig' ? '🕸️' : selection.mood === 'eklig' ? '🦠' : '✨',
      mood: selection.mood,
      tilt: (hash % 13) - 6,
    }
  }
  const hash = hashText(`${placeholder}:${title}`)
  return {
    fingerprint: `${hash}-${placeholder}`,
    hue: hash % 360,
    secondHue: (hash * 7 + 83) % 360,
    symbol: SYMBOLS[hash % SYMBOLS.length],
    accent: SYMBOLS[(hash >>> 7) % SYMBOLS.length],
    mood: MOODS[(hash >>> 12) % MOODS.length],
    tilt: (hash % 19) - 9,
  }
}

export function MissionImage({ placeholder, title }: { placeholder: string; title: string }) {
  const visual = getMissionVisualSpec(placeholder, title)
  const style = {
    '--mission-hue': visual.hue,
    '--mission-hue-2': visual.secondHue,
    '--mission-tilt': `${visual.tilt}deg`,
  } as CSSProperties
  return (
    <div className="mission-image" style={style} role="img" aria-label={`${title}, ${visual.mood}`}>
      <span className="mission-image__bubble mission-image__bubble--one" aria-hidden="true" />
      <span className="mission-image__bubble mission-image__bubble--two" aria-hidden="true" />
      <span className="mission-image__accent" aria-hidden="true">
        {visual.accent}
      </span>
      <span className="mission-image__icon" aria-hidden="true">
        {visual.symbol}
      </span>
      <span className="mission-image__spark" aria-hidden="true">
        ✦
      </span>
    </div>
  )
}
