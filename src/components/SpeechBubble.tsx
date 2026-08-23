import type { MascotId } from '../domain'
import { Mascot } from './Mascot'
import './SpeechBubble.css'

interface SpeechBubbleProps {
  text: string
  mascotId?: MascotId
}

export function SpeechBubble({ text, mascotId }: SpeechBubbleProps) {
  return (
    <div className="speech-bubble" role="status">
      <Mascot mascotId={mascotId} size="medium" talking />
      <p className="speech-bubble__text">{text}</p>
    </div>
  )
}
