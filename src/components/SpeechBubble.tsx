import { Mascot } from './Mascot'
import './SpeechBubble.css'

interface SpeechBubbleProps {
  text: string
}

export function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="speech-bubble" role="status">
      <Mascot size="medium" talking />
      <p className="speech-bubble__text">{text}</p>
    </div>
  )
}
