import { useEffect, useState, type ReactNode } from 'react'
import {
  isVisitorPreview,
  loadVisitorAccessState,
  visitorPreviewConfig,
  type VisitorAccessState,
} from '../visitorPreview'
import { Button } from './Button'
import './VisitorPreviewGate.css'

type CheckState = VisitorAccessState | 'checking' | 'unavailable'

export function VisitorPreviewGate({ children }: { children: ReactNode }) {
  const visitorPreview = isVisitorPreview()
  const previewConfig = visitorPreviewConfig()
  const [state, setState] = useState<CheckState>(visitorPreview ? 'checking' : 'active')
  const expiryLabel = previewConfig
    ? new Intl.DateTimeFormat('de-CH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Zurich',
      }).format(new Date(previewConfig.expiresAt))
    : ''

  const checkAccess = async () => {
    setState('checking')
    try {
      setState(await loadVisitorAccessState())
    } catch {
      setState('unavailable')
    }
  }

  useEffect(() => {
    if (!visitorPreview) return
    let current = true
    void loadVisitorAccessState()
      .then((next) => {
        if (current) setState(next)
      })
      .catch(() => {
        if (current) setState('unavailable')
      })
    return () => {
      current = false
    }
  }, [visitorPreview])

  useEffect(() => {
    if (!visitorPreview || state !== 'active') return
    const verifyOnReturn = () => {
      if (document.visibilityState !== 'visible') return
      void loadVisitorAccessState()
        .then((next) => {
          if (next === 'expired') setState('expired')
        })
        .catch(() => undefined)
    }
    document.addEventListener('visibilitychange', verifyOnReturn)
    return () => document.removeEventListener('visibilitychange', verifyOnReturn)
  }, [state, visitorPreview])

  if (!visitorPreview) return children

  if (state === 'checking') {
    return (
      <main className="visitor-gate" aria-live="polite">
        <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="Crazy Lab" />
        <h1>Besuchspass wird geprüft …</h1>
        <p>Das geheime Labor öffnet gleich seine Tür.</p>
      </main>
    )
  }

  if (state === 'expired') {
    return (
      <main className="visitor-gate">
        <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="Crazy Lab" />
        <span className="visitor-gate__sparkles" aria-hidden="true">
          ✦ 🧪 ✦
        </span>
        <h1>Der Besuchspass ist abgelaufen</h1>
        <p>
          Danke, dass du Crazy Lab ausprobiert hast! Diese zeitlich begrenzte Testversion ist nun
          geschlossen.
        </p>
      </main>
    )
  }

  if (state === 'unavailable') {
    return (
      <main className="visitor-gate">
        <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="Crazy Lab" />
        <h1>Das Labor braucht Internet</h1>
        <p>Prüfe kurz die Verbindung. Danach kann dein Besuchspass kontrolliert werden.</p>
        <Button onClick={() => void checkAccess()}>Nochmals versuchen</Button>
      </main>
    )
  }

  return (
    <div className="visitor-preview">
      <aside className="visitor-preview__notice">
        🎟️ Besuchsversion · gültig bis {expiryLabel}
      </aside>
      {children}
    </div>
  )
}
