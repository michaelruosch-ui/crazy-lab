import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  decodeSharedMission,
  generateId,
  canEditMissionCatalog,
  type CustomMission,
  type MissionCategory,
} from '../../domain'
import { BackLink, Button } from '../../components'
import { indexedDbCustomMissionRepository } from '../../storage/customMissionRepository'
import { useActiveProfileId } from '../profile'
import './CustomMissionsPage.css'

const CATEGORY_LABELS: Record<MissionCategory, string> = {
  getraenk: 'Getränk',
  basteln: 'Basteln',
  experiment: 'Experiment',
  foto: 'Foto-Challenge',
  schwestern: 'Schwestern-Mission',
}

const SAFETY_LABELS = {
  gruen: '🟢 Grün – allein okay',
  gelb: '🟡 Gelb – Erwachsene helfen',
  rot: '🔴 Rot – nur mit Erwachsenen',
}

export function SharedMissionImportPage() {
  const [searchParams] = useSearchParams()
  const shared = useMemo(
    () => decodeSharedMission(searchParams.get('mission') ?? ''),
    [searchParams],
  )
  const [importedId, setImportedId] = useState<string>()
  const [saving, setSaving] = useState(false)
  const { activeProfileId } = useActiveProfileId()
  const isProductOwner = canEditMissionCatalog(activeProfileId)

  async function importMission() {
    if (!shared || saving || !isProductOwner) return
    setSaving(true)
    const now = new Date().toISOString()
    const id = `mission-eigen-${generateId()}`
    const mission: CustomMission = {
      ...shared,
      id,
      profileId: activeProfileId,
      contentVersion: 1,
      secondaryCategories: [],
      imagePlaceholder: `eigen-${shared.primaryCategory}`,
      createdAt: now,
      updatedAt: now,
    }
    await indexedDbCustomMissionRepository.save(mission)
    setImportedId(id)
    setSaving(false)
  }

  if (!shared) {
    return (
      <div className="shared-mission-page">
        <h1>🧪 Missionslink ungültig</h1>
        <p className="shared-mission-page__notice">
          Dieser Link ist unvollständig oder beschädigt. Bitte lass dir die Mission noch einmal neu
          schicken.
        </p>
        <BackLink to="/">← Zurück zur Startseite</BackLink>
      </div>
    )
  }

  if (!isProductOwner) {
    return (
      <div className="shared-mission-page">
        <h1>🔒 Elenas Missionswerkstatt</h1>
        <p className="shared-mission-page__notice">
          Nur Elena darf als Product Owner Missionen in Crazy Lab aufnehmen. Veröffentlichte
          Missionen erscheinen später automatisch für alle Spielerinnen und Spieler.
        </p>
        <BackLink to="/">← Zurück zur Startseite</BackLink>
      </div>
    )
  }

  if (importedId) {
    return (
      <div className="shared-mission-page">
        <h1>🎉 Mission importiert!</h1>
        <p className="shared-mission-page__notice">
          „{shared.title}“ gehört jetzt als eigene Kopie zu deinem aktuellen Profil.
        </p>
        <Link className="custom-missions-page__create" to={`/mission/${importedId}`}>
          🚀 Mission jetzt starten
        </Link>
        <BackLink to="/eigene-missionen">✨ Zu meinen Missionen</BackLink>
      </div>
    )
  }

  return (
    <div className="shared-mission-page">
      <p className="shared-mission-page__eyebrow">Geteilte Crazy-Lab-Mission</p>
      <h1>🔎 Erst prüfen, dann importieren</h1>
      <section className="shared-mission-page__card">
        <h2>{shared.title}</h2>
        <p>{shared.shortDescription}</p>
        <dl>
          <div>
            <dt>Kategorie</dt>
            <dd>{CATEGORY_LABELS[shared.primaryCategory]}</dd>
          </div>
          <div>
            <dt>Dauer</dt>
            <dd>{shared.durationMinutes} Minuten</dd>
          </div>
          <div>
            <dt>Sicherheit</dt>
            <dd>{SAFETY_LABELS[shared.safetyLevel]}</dd>
          </div>
        </dl>
        {shared.safetyNotes.length > 0 && (
          <div className="shared-mission-page__safety">
            <strong>Das müsst ihr beachten:</strong>
            {shared.safetyNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        )}
        <h3>Materialien</h3>
        <ul>
          {shared.materials.map((item) => (
            <li key={item.id}>
              {item.name}
              {item.quantity ? ` – ${item.quantity}` : ''}
            </li>
          ))}
        </ul>
        <h3>Schritte</h3>
        <ol>
          {[...shared.steps]
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <li key={step.id}>{step.text}</li>
            ))}
        </ol>
      </section>
      <p className="shared-mission-page__privacy">
        🔒 Der Link enthält nur diese Mission. Keine Namen, Fotos oder Tagebuchdaten werden geteilt.
      </p>
      <Button onClick={importMission} disabled={saving}>
        {saving ? 'Wird importiert…' : 'Mission in mein Profil importieren'}
      </Button>
      <BackLink to="/">← Nicht importieren</BackLink>
    </div>
  )
}
