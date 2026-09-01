import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CustomMission } from '../../domain'
import { DEFAULT_PROFILE } from '../../domain'
import { BackLink, MissionCard, SpeechBubble } from '../../components'
import { useProfile } from '../profile'
import { indexedDbCustomMissionRepository } from '../../storage/customMissionRepository'
import './CustomMissionsPage.css'

export function CustomMissionsPage() {
  const [items, setItems] = useState<CustomMission[]>([])
  const { profile } = useProfile(DEFAULT_PROFILE.id)

  useEffect(() => {
    void indexedDbCustomMissionRepository.getAll(DEFAULT_PROFILE.id).then(setItems)
  }, [])

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
              actions={<Link to={`/eigene-missionen/${mission.id}/bearbeiten`}>✏️ Bearbeiten</Link>}
            />
          ))}
        </div>
      )}
      <BackLink to="/">← Zurück zur Startseite</BackLink>
    </div>
  )
}
