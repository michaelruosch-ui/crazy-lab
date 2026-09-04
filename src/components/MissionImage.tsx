/* eslint-disable react-refresh/only-export-components */
import type { CSSProperties } from 'react'
import './MissionImage.css'

const SYMBOLS = ['🧪', '⚗️', '🔬', '✨', '🌈', '👻', '🐉', '📷', '🌙', '🪄', '🧿', '🦠']
const MOODS = ['lustig', 'gruselig', 'eklig', 'magisch', 'geheimnisvoll', 'niedlich'] as const

function hashText(value: string) {
  let hash = 2166136261
  for (const character of value) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function getMissionVisualSpec(placeholder: string, title: string) {
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
