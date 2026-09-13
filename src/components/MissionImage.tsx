/* eslint-disable react-refresh/only-export-components */
import type { CSSProperties } from 'react'
import './MissionImage.css'

const SYMBOLS = ['🧪', '⚗️', '🔬', '✨', '🌈', '👻', '🐉', '📷', '🌙', '🪄', '🧿', '🦠']
const MOODS = ['lustig', 'gruselig', 'eklig', 'magisch', 'geheimnisvoll', 'niedlich'] as const

const PREMIUM_MISSION_ART: Record<string, { position: string; mood: string }> = {
  'der blutkleim': { position: '0% 0%', mood: 'lustig-gruselig' },
  'das leuchtende geisterportal': { position: '50% 0%', mood: 'magisch' },
  'der blutrote schatten-trank': { position: '100% 0%', mood: 'geheimnisvoll' },
  'regen im glas': { position: '0% 100%', mood: 'wissenschaftlich-magisch' },
  'das monster-frühstück': { position: '50% 100%', mood: 'lustig' },
  'die mini-schatzsuche': { position: '100% 100%', mood: 'abenteuerlich' },
}

export function getPremiumMissionArt(title: string) {
  return PREMIUM_MISSION_ART[title.trim().toLocaleLowerCase('de-CH')]
}

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

export const CUSTOM_IMAGE_SCENES = [
  { id: 'three-moons', label: 'Drei Monde', mood: 'geheimnisvoll', position: '0% 0%' },
  { id: 'alien-lab', label: 'Alien-Labor', mood: 'lustig', position: '33.333% 0%' },
  { id: 'dragon-egg', label: 'Kristall-Drachenei', mood: 'niedlich', position: '66.667% 0%' },
  { id: 'mushroom-garden', label: 'Pilzgarten im Glas', mood: 'magisch', position: '100% 0%' },
  { id: 'witch-cauldron', label: 'Hexenkessel', mood: 'gruselig', position: '0% 50%' },
  { id: 'slime-garden', label: 'Schleimgarten', mood: 'eklig', position: '33.333% 50%' },
  { id: 'robot-inventor', label: 'Roboter-Erfinder', mood: 'lustig', position: '66.667% 50%' },
  { id: 'candy-storm', label: 'Süssigkeiten-Sturm', mood: 'niedlich', position: '100% 50%' },
  { id: 'ghost-library', label: 'Geisterbibliothek', mood: 'gruselig', position: '0% 100%' },
  {
    id: 'underwater-lab',
    label: 'Unterwasser-Labor',
    mood: 'geheimnisvoll',
    position: '33.333% 100%',
  },
  { id: 'crystal-volcano', label: 'Kristall-Vulkan', mood: 'gruselig', position: '66.667% 100%' },
  { id: 'cosmic-teacup', label: 'Planeten-Teetasse', mood: 'magisch', position: '100% 100%' },
] as const

type CustomMissionSceneId = (typeof CUSTOM_IMAGE_SCENES)[number]['id']

export interface CustomMissionImageSelection {
  scene: CustomMissionSceneId
}

export const DEFAULT_CUSTOM_IMAGE: CustomMissionImageSelection = {
  scene: 'three-moons',
}

export function encodeCustomMissionImage(selection: CustomMissionImageSelection): string {
  return `custom-v2:${selection.scene}`
}

export function decodeCustomMissionImage(placeholder: string): CustomMissionImageSelection {
  const [version, scene] = placeholder.split(':')
  if (version === 'custom-v2' && CUSTOM_IMAGE_SCENES.some((item) => item.id === scene)) {
    return { scene: scene as CustomMissionSceneId }
  }
  const [prefix, background, symbol, mood] = placeholder.split(':')
  if (
    prefix === 'custom-v1' &&
    CUSTOM_IMAGE_BACKGROUNDS.some((item) => item.id === background) &&
    CUSTOM_IMAGE_SYMBOLS.some((item) => item.id === symbol) &&
    MOODS.some((item) => item === mood)
  ) {
    const legacyMoodScenes: Record<(typeof MOODS)[number], CustomMissionSceneId> = {
      lustig: 'robot-inventor',
      gruselig: 'witch-cauldron',
      eklig: 'slime-garden',
      magisch: 'cosmic-teacup',
      geheimnisvoll: 'three-moons',
      niedlich: 'dragon-egg',
    }
    return { scene: legacyMoodScenes[mood as (typeof MOODS)[number]] }
  }
  return DEFAULT_CUSTOM_IMAGE
}

export function getCustomMissionScene(placeholder: string) {
  if (!placeholder.startsWith('custom-v2:')) return undefined
  const selection = decodeCustomMissionImage(placeholder)
  return CUSTOM_IMAGE_SCENES.find((item) => item.id === selection.scene)
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
    const [, backgroundId, symbolId, mood = 'magisch'] = placeholder.split(':')
    const background =
      CUSTOM_IMAGE_BACKGROUNDS.find((item) => item.id === backgroundId) ??
      CUSTOM_IMAGE_BACKGROUNDS[0]
    const symbol =
      CUSTOM_IMAGE_SYMBOLS.find((item) => item.id === symbolId) ?? CUSTOM_IMAGE_SYMBOLS[0]
    const hash = hashText(`${placeholder}:${title}`)
    return {
      fingerprint: `${placeholder}-${title}`,
      hue: background.hue,
      secondHue: background.secondHue,
      symbol: symbol.symbol,
      accent: mood === 'gruselig' ? '🕸️' : mood === 'eklig' ? '🦠' : '✨',
      mood,
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
  const premium = getPremiumMissionArt(title)
  if (premium) {
    const premiumStyle = {
      backgroundImage: `url(${import.meta.env.BASE_URL}mission-art/free-missions-atlas.jpg)`,
      backgroundPosition: premium.position,
    }
    return (
      <div
        className="mission-image mission-image--premium"
        style={premiumStyle}
        role="img"
        aria-label={`${title}, ${premium.mood}`}
      />
    )
  }
  const customScene = getCustomMissionScene(placeholder)
  if (customScene) {
    const customStyle = {
      backgroundImage: `url(${import.meta.env.BASE_URL}mission-art/custom-covers-v2.jpg)`,
      backgroundPosition: customScene.position,
    }
    return (
      <div
        className="mission-image mission-image--premium mission-image--custom-premium"
        style={customStyle}
        role="img"
        aria-label={`${title}, ${customScene.label}, ${customScene.mood}`}
      />
    )
  }
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
