import type { MascotVariant } from '../domain'
import { Mascot } from './Mascot'
import './SpeechBubble.css'

interface SpeechBubbleProps {
  text: string
  mascotVariant?: MascotVariant
}

export function SpeechBubble({ text, mascotVariant }: SpeechBubbleProps) {
  return (
    <div className="speech-bubble" role="status">
      <Mascot variant={mascotVariant} size="medium" talking />
      <p className="speech-bubble__text">{text}</p>
    </div>
  )
}
