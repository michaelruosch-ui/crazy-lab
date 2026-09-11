import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CustomMission } from '../../domain'
import { canEditMissionCatalog } from '../../domain'
import { BackLink, Button, MissionCard, ParentGate, SpeechBubble } from '../../components'
import { useActiveProfileId, useProfile } from '../profile'
import { indexedDbCustomMissionRepository } from '../../storage/customMissionRepository'
import './CustomMissionsPage.css'
import { useLanguage } from '../../i18n'

export function CustomMissionsPage() {
  const { t } = useLanguage()
  const [items, setItems] = useState<CustomMission[]>([])
  const { activeProfileId } = useActiveProfileId()
  const { profile } = useProfile(activeProfileId)
  const [message, setMessage] = useState('')
  const [missionAwaitingApproval, setMissionAwaitingApproval] = useState<CustomMission | null>(null)
  const isProductOwner = canEditMissionCatalog(activeProfileId)

  useEffect(() => {
    void indexedDbCustomMissionRepository.getAll(activeProfileId).then(setItems)
  }, [activeProfileId])

  async function markReadyForReview(mission: CustomMission) {
    const updated: CustomMission = {
      ...mission,
      publicationStatus: 'ready-for-review',
      updatedAt: new Date().toISOString(),
    }
    await indexedDbCustomMissionRepository.save(updated)
    setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    setMessage(t('publicationReadyMessage').replace('{title}', mission.title))
  }

  return (
    <div className="custom-missions-page">
      <h1>✨ Eigene Missionen</h1>
      <p className="shared-mission-page__privacy">🌐 {t('originalLanguageHint')}</p>
      <SpeechBubble
        mascotId={profile?.mascotVariant}
        text={
          isProductOwner
            ? 'Du hast die Idee – ich helfe dir, daraus eine klare und sichere Mission zu machen!'
            : 'Die Missionswerkstatt gehört Elena als Product Owner. Du kannst veröffentlichte Missionen spielen.'
        }
      />
      {isProductOwner && (
        <Link className="custom-missions-page__create" to="/eigene-missionen/neu">
          ➕ Neue Mission erfinden
        </Link>
      )}
      {isProductOwner && (
        <p className="shared-mission-page__notice">
          🌍 Nur du kannst Missionen für alle freigeben. Vor dem nächsten App-Update werden Inhalt
          und Sicherheit noch einmal geprüft.
        </p>
      )}
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
                isProductOwner ? (
                  <div className="custom-missions-page__actions">
                    <Link to={`/eigene-missionen/${mission.id}/bearbeiten`}>✏️ Bearbeiten</Link>
                    {mission.publicationStatus === 'ready-for-review' ? (
                      <strong>✅ Für das nächste App-Update freigegeben</strong>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => setMissionAwaitingApproval(mission)}
                      >
                        🌍 Für alle freigeben
                      </Button>
                    )}
                  </div>
                ) : undefined
              }
            />
          ))}
        </div>
      )}
      <ParentGate
        open={missionAwaitingApproval !== null}
        reason="Diese Mission wird für den gemeinsamen, von Elena geprüften Katalog vorgemerkt."
        onAuthorized={() =>
          missionAwaitingApproval ? markReadyForReview(missionAwaitingApproval) : undefined
        }
        onClose={() => setMissionAwaitingApproval(null)}
      />
      <BackLink to="/">← Zurück zur Startseite</BackLink>
    </div>
  )
}
