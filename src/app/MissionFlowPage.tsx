import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMissionById } from '../data'
import { DEFAULT_PROFILE, generateId, type CompletionRating, type DiaryEntry } from '../domain'
import { MissionDetailView } from '../features/missions'
import { StepRunner } from '../features/mission-run'
import { CompletionForm } from '../features/ratings'
import { useSecretVault } from '../features/secret-vault'
import { Button } from '../components'
import { indexedDbDiaryRepository } from '../storage/diaryRepository'
import './MissionFlowPage.css'

interface MissionFlowPageProps {
  missionId: string
}

type Phase = 'detail' | 'run' | 'rating'
type SaveStatus = 'idle' | 'saving' | 'error'

function buildEntry(missionId: string, rating: CompletionRating, mission: NonNullable<ReturnType<typeof getMissionById>>): DiaryEntry {
  return {
    id: generateId(),
    profileId: DEFAULT_PROFILE.id,
    missionSnapshot: {
      missionId,
      contentVersion: mission.contentVersion,
      title: mission.title,
      primaryCategory: mission.primaryCategory,
      imagePlaceholder: mission.imagePlaceholder,
    },
    status: 'erfolgreich',
    rating,
    completedAt: new Date().toISOString(),
  }
}

function describeError(error: unknown): string {
  if (typeof window !== 'undefined' && !window.indexedDB) {
    return 'IndexedDbNichtVerfuegbar: Dieser Browser stellt in diesem Kontext kein indexedDB bereit.'
  }
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`
  }
  return String(error)
}

export function MissionFlowPage({ missionId }: MissionFlowPageProps) {
  const mission = getMissionById(missionId)
  const [phase, setPhase] = useState<Phase>('detail')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [pendingRating, setPendingRating] = useState<CompletionRating | null>(null)
  const [errorDetails, setErrorDetails] = useState<string>('')
  const navigate = useNavigate()
  const { savedMissionIds, toggle: toggleSaved } = useSecretVault(DEFAULT_PROFILE.id)

  if (!mission) {
    return (
      <div className="mission-flow__not-found">
        <p>Diese Mission konnte nicht gefunden werden.</p>
        <Link to="/">Zurück zur Startseite</Link>
      </div>
    )
  }

  const trySave = async (rating: CompletionRating) => {
    setSaveStatus('saving')
    try {
      const entry = buildEntry(mission.id, rating, mission)
      await indexedDbDiaryRepository.saveEntry(entry)
      navigate('/diary')
    } catch (error) {
      setPendingRating(rating)
      setErrorDetails(describeError(error))
      setSaveStatus('error')
    }
  }

  if (phase === 'detail') {
    return (
      <div className="mission-flow">
        <div className="mission-flow__toolbar">
          <Link to="/" className="mission-flow__back">
            ← Startseite
          </Link>
          <Button variant="ghost" onClick={() => toggleSaved(mission.id)}>
            {savedMissionIds.has(mission.id) ? '🗝️ Gemerkt' : '🗝️ Merken'}
          </Button>
        </div>
        <MissionDetailView mission={mission} onStart={() => setPhase('run')} />
      </div>
    )
  }

  if (phase === 'run') {
    return (
      <StepRunner
        mission={mission}
        onAllStepsDone={() => setPhase('rating')}
        onExit={() => setPhase('detail')}
      />
    )
  }

  return (
    <>
      <CompletionForm mission={mission} onSubmit={trySave} submitting={saveStatus === 'saving'} />
      {saveStatus === 'error' && (
        <div className="mission-flow__save-error" role="alert">
          <p>
            Speichern hat nicht geklappt. Bitte den Text unten Michael zeigen oder abfotografieren
            - das hilft bei der Fehlersuche.
          </p>
          <p className="mission-flow__save-error-details">{errorDetails}</p>
          <Button variant="primary" onClick={() => pendingRating && trySave(pendingRating)}>
            Nochmals versuchen
          </Button>
        </div>
      )}
    </>
  )
}
