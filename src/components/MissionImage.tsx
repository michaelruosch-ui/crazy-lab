import './MissionImage.css'

const ICONS: Record<string, string> = {
  'potion-red': '🧪',
  'craft-ghost-bed': '👻',
  'experiment-color-ghost': '🌈',
  'photo-levitation': '📷',
  'potion-sisters': '⚗️',
  'potion-ghost-mist': '🌫️',
  'potion-vampire-smoothie': '🧛',
  'potion-alien-fizz': '👽',
  'potion-moon-layers': '🌙',
  'potion-dragon-apple': '🐉',
  'potion-monster-eyes': '👁️',
  'potion-rainbow-lab': '🌈',
  'potion-cocoa-ghost': '☕',
  'potion-pink-cloud': '☁️',
  'potion-lemon-glow': '⚡',
  'potion-swamp-monster': '🧌',
  'potion-blood-moon': '🌑',
  'potion-galaxy-fizz': '🌌',
  'potion-color-oracle': '🔮',
  'potion-banana-ghost': '👻',
  'potion-cherry-lava': '🌋',
}

interface MissionImageProps {
  placeholder: string
  title: string
}

export function MissionImage({ placeholder, title }: MissionImageProps) {
  const icon = ICONS[placeholder] ?? '🔮'
  return (
    <div className="mission-image" role="img" aria-label={title}>
      <span className="mission-image__icon">{icon}</span>
    </div>
  )
}
