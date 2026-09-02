import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CustomMission } from '../../domain'
import { encodeSharedMission } from '../../domain'
import { BackLink, Button, MissionCard, SpeechBubble } from '../../components'
import { useActiveProfileId, useProfile } from '../profile'
import { indexedDbCustomMissionRepository } from '../../storage/customMissionRepository'
import './CustomMissionsPage.css'

export function CustomMissionsPage() {
  const [items, setItems] = useState<CustomMission[]>([])
  const { activeProfileId } = useActiveProfileId()
  const { profile } = useProfile(activeProfileId)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void indexedDbCustomMissionRepository.getAll(activeProfileId).then(setItems)
  }, [activeProfileId])

  async function shareMission(mission: CustomMission) {
    const url = `${window.location.origin}${window.location.pathname}#/mission-import?mission=${encodeSharedMission(mission)}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Crazy Lab: ${mission.title}`,
          text: 'Probier meine Crazy-Lab-Mission aus!',
          url,
        })
        setMessage('Mission zum Teilen geöffnet.')
        return
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setMessage('Link kopiert! Du kannst ihn jetzt verschicken.')
        return
      }
      window.prompt('Kopiere diesen Missionslink:', url)
      setMessage('Der Missionslink ist bereit zum Kopieren.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      window.prompt('Kopiere diesen Missionslink:', url)
    }
  }

  return (
    <div className="custom-missions-page">
      <h1>✨ Eigene Missionen</h1>
      <SpeechBubble
        mascotId={profile?.mascotVariant}
        text="Du hast die Idee – ich helfe dir, daraus eine klare und sichere Mission zu machen!"
      />
      <Link className="custom-missions-page__create" to="/eigene-missionen/neu">
        ➕ Neue Mission erfinden
      </Link>
      {message && (
        <p role="status" className="custom-missions-page__message">
          {message}
        </p>
      )}

      {items.length === 0 ? (
        <p className="custom-missions-page__empty">
          Noch keine eigene Mission. Du kannst neu anfangen oder bei einer normalen Mission auf „Als
          eigene Mission kopieren“ tippen.
        </p>
      ) : (
        <div className="custom-missions-page__list">
          {items.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              actions={
                <div className="custom-missions-page__actions">
                  <Link to={`/eigene-missionen/${mission.id}/bearbeiten`}>✏️ Bearbeiten</Link>
                  <Button variant="secondary" onClick={() => void shareMission(mission)}>
                    🔗 Mission teilen
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}
      <BackLink to="/">← Zurück zur Startseite</BackLink>
    </div>
  )
}
