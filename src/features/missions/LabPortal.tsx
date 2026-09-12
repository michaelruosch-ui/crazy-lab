import { useCallback, useEffect, useState } from 'react'
import { Button } from '../../components'
import './LabPortal.css'

interface LabPortalProps {
  profileId: string
  researcherName: string
}

function hasSeenPortal(profileId: string) {
  try {
    return window.sessionStorage.getItem(`crazy-lab-portal-${profileId}`) === 'seen'
  } catch {
    return false
  }
}

export function LabPortal({ profileId, researcherName }: LabPortalProps) {
  const [visible, setVisible] = useState(() => !hasSeenPortal(profileId))

  const dismiss = useCallback(() => {
    try {
      window.sessionStorage.setItem(`crazy-lab-portal-${profileId}`, 'seen')
    } catch {
      // Die Animation darf auch ohne verfügbaren Sitzungsspeicher funktionieren.
    }
    setVisible(false)
  }, [profileId])

  useEffect(() => {
    if (!visible) return
    const timeout = window.setTimeout(() => dismiss(), 4200)
    return () => window.clearTimeout(timeout)
  }, [dismiss, visible])

  if (!visible) return null

  return (
    <div className="lab-portal" role="dialog" aria-modal="true" aria-label="Crazy Lab öffnen">
      <div className="lab-portal__stars" aria-hidden="true">
        ✦ ✧ ✦ ✧ ✦
      </div>
      <div className="lab-portal__vortex" aria-hidden="true">
        <span>🧪</span>
      </div>
      <p className="lab-portal__eyebrow">Das geheime Labor erwacht …</p>
      <h1>Bereit, {researcherName}?</h1>
      <p>Hinter dem Portal wartet heute etwas Verrücktes.</p>
      <Button onClick={dismiss}>✨ Portal öffnen</Button>
    </div>
  )
}
