import type { MascotId } from '../domain'
import { Button } from './Button'
import { Mascot } from './Mascot'
import './FriendlyError.css'

export function FriendlyError({
  message,
  details,
  onRetry,
  mascotId,
}: {
  message: string
  details?: string
  onRetry?: () => void
  mascotId?: MascotId
}) {
  return (
    <aside className="friendly-error" role="alert">
      <Mascot mascotId={mascotId} size="medium" talking />
      <div>
        <h2>Huch, ein Labor-Kobold war da!</h2>
        <p>{message}</p>
        {details && (
          <details>
            <summary>Technische Hinweise für Erwachsene</summary>
            <code>{details}</code>
          </details>
        )}
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            Nochmals versuchen
          </Button>
        )}
      </div>
    </aside>
  )
}
