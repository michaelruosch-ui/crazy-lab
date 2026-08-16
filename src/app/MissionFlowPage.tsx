import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMissionById, STARTER_MISSION_ID } from '../data'
import { DEFAULT_PROFILE, type CompletionRating, type DiaryEntry } from '../domain'
import { MissionDetailView } from '../features/missions'
import { StepRunner } from '../features/mission-run'
import { CompletionForm } from '../features/ratings'
import { indexedDbDiaryRepository } from '../storage/diaryRepository'

type Phase = 'detail' | 'run' | 'rating'

export function MissionFlowPage() {
  const mission = getMissionById(STARTER_MISSION_ID)
  const [phase, setPhase] = useState<Phase>('detail')
  const navigate = useNavigate()

  if (!mission) {
    return <p>Diese Mission konnte nicht gefunden werden.</p>
  }

  const handleRatingSubmit = async (rating: CompletionRating) => {
    const entry: DiaryEntry = {
      id: crypto.randomUUID(),
      profileId: DEFAULT_PROFILE.id,
      missionSnapshot: {
        missionId: mission.id,
        contentVersion: mission.contentVersion,
        title: mission.title,
        primaryCategory: mission.primaryCategory,
        imagePlaceholder: mission.imagePlaceholder,
      },
      status: 'erfolgreich',
      rating,
      completedAt: new Date().toISOString(),
    }
    await indexedDbDiaryRepository.saveEntry(entry)
    navigate('/diary')
  }

  if (phase === 'detail') {
    return <MissionDetailView mission={mission} onStart={() => setPhase('run')} />
  }

  if (phase === 'run') {
    return <StepRunner mission={mission} onAllStepsDone={() => setPhase('rating')} />
  }

  return <CompletionForm mission={mission} onSubmit={handleRatingSubmit} />
}
