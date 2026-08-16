import './MissionImage.css'

const ICONS: Record<string, string> = {
  'potion-red': '🧪',
  'craft-ghost-bed': '👻',
  'experiment-color-ghost': '🌈',
  'photo-levitation': '📷',
  'potion-sisters': '⚗️',
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
