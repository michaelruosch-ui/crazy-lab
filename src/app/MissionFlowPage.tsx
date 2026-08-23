import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMissionById, STARTER_MISSION_ID } from '../data'
import { DEFAULT_PROFILE, type CompletionRating, type DiaryEntry } from '../domain'
import { MissionDetailView } from '../features/missions'
import { StepRunner } from '../features/mission-run'
import { CompletionForm } from '../features/ratings'
import { Button } from '../components'
import { indexedDbDiaryRepository } from '../storage/diaryRepository'
import './MissionFlowPage.css'

type Phase = 'detail' | 'run' | 'rating'
type SaveStatus = 'idle' | 'saving' | 'error'

function buildEntry(missionId: string, rating: CompletionRating, mission: NonNullable<ReturnType<typeof getMissionById>>): DiaryEntry {
  return {
    id: crypto.randomUUID(),
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

export function MissionFlowPage() {
  const mission = getMissionById(STARTER_MISSION_ID)
  const [phase, setPhase] = useState<Phase>('detail')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [pendingRating, setPendingRating] = useState<CompletionRating | null>(null)
  const navigate = useNavigate()

  if (!mission) {
    return <p>Diese Mission konnte nicht gefunden werden.</p>
  }

  const trySave = async (rating: CompletionRating) => {
    setSaveStatus('saving')
    try {
      const entry = buildEntry(mission.id, rating, mission)
      await indexedDbDiaryRepository.saveEntry(entry)
      navigate('/diary')
    } catch {
      setPendingRating(rating)
      setSaveStatus('error')
    }
  }

  if (phase === 'detail') {
    return <MissionDetailView mission={mission} onStart={() => setPhase('run')} />
  }

  if (phase === 'run') {
    return <StepRunner mission={mission} onAllStepsDone={() => setPhase('rating')} />
  }

  return (
    <>
      <CompletionForm mission={mission} onSubmit={trySave} submitting={saveStatus === 'saving'} />
      {saveStatus === 'error' && (
        <div className="mission-flow__save-error" role="alert">
          <p>
            Speichern hat nicht geklappt. Das kann bei der allerersten Nutzung als installierte
            App manchmal vorkommen - bitte nochmals versuchen.
          </p>
          <Button
            variant="primary"
            onClick={() => pendingRating && trySave(pendingRating)}
          >
            Nochmals versuchen
          </Button>
        </div>
      )}
    </>
  )
}
