import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMissionById } from '../data'
import {
  DEFAULT_PROFILE,
  generateId,
  rankDrinkVariants,
  shoppingItemsForMission,
  type CompletionRating,
  type DiaryEntry,
  type ExperimentProgress,
} from '../domain'
import { MissionDetailView } from '../features/missions'
import { StepRunner } from '../features/mission-run'
import { CompletionForm } from '../features/ratings'
import { useSecretVault } from '../features/secret-vault'
import { useProfile } from '../features/profile'
import { useDiaryEntries } from '../features/diary'
import { BackLink, Button } from '../components'
import { indexedDbDiaryRepository } from '../storage/diaryRepository'
import { indexedDbShoppingListRepository } from '../storage/shoppingListRepository'
import { indexedDbLabCabinetRepository } from '../storage/labCabinetRepository'
import { indexedDbExperimentProgressRepository } from '../storage/experimentProgressRepository'
import './MissionFlowPage.css'

interface MissionFlowPageProps {
  missionId: string
}

type Phase = 'detail' | 'run' | 'rating'
type SaveStatus = 'idle' | 'saving' | 'error'

function buildEntry(
  missionId: string,
  rating: CompletionRating,
  mission: NonNullable<ReturnType<typeof getMissionById>>,
): DiaryEntry {
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
  const [shoppingMessage, setShoppingMessage] = useState('')
  const [experimentProgress, setExperimentProgress] = useState<ExperimentProgress>()
  const navigate = useNavigate()
  const { savedMissionIds, toggle: toggleSaved } = useSecretVault(DEFAULT_PROFILE.id)
  const { profile } = useProfile(DEFAULT_PROFILE.id)
  const { entries } = useDiaryEntries(DEFAULT_PROFILE.id)
  const rankedVariants = mission ? rankDrinkVariants(mission, entries) : []
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined)
  const effectiveVariant =
    selectedVariant ?? rankedVariants[0]?.name ?? mission?.drinkProfile?.variants[0]?.name

  useEffect(() => {
    if (!mission?.experimentProfile) return
    void indexedDbExperimentProgressRepository
      .get(DEFAULT_PROFILE.id, mission.id)
      .then(setExperimentProgress)
  }, [mission])

  if (!mission) {
    return (
      <div className="mission-flow__not-found">
        <p>Diese Mission konnte nicht gefunden werden.</p>
        <BackLink to="/">← Zurück zur Startseite</BackLink>
      </div>
    )
  }

  const trySave = async (rating: CompletionRating) => {
    setSaveStatus('saving')
    try {
      const entry = buildEntry(mission.id, rating, mission)
      await indexedDbDiaryRepository.saveEntry(entry)
      if (experimentProgress) {
        await indexedDbExperimentProgressRepository.remove(experimentProgress.id)
      }
      navigate('/diary')
    } catch (error) {
      setPendingRating(rating)
      setErrorDetails(describeError(error))
      setSaveStatus('error')
    }
  }

  const saveExperimentProgress = async (checkedStepIds: string[]) => {
    if (!mission.experimentProfile) return
    const now = new Date().toISOString()
    const progress: ExperimentProgress = {
      id: experimentProgress?.id ?? `${DEFAULT_PROFILE.id}:${mission.id}`,
      profileId: DEFAULT_PROFILE.id,
      missionId: mission.id,
      checkedStepIds,
      startedAt: experimentProgress?.startedAt ?? now,
      updatedAt: now,
    }
    setExperimentProgress(progress)
    await indexedDbExperimentProgressRepository.save(progress)
  }

  const addToShoppingList = async () => {
    const [existingShoppingItems, cabinetItems] = await Promise.all([
      indexedDbShoppingListRepository.getAll(DEFAULT_PROFILE.id),
      indexedDbLabCabinetRepository.getAll(DEFAULT_PROFILE.id),
    ])
    const unavailableNames = new Set([
      ...existingShoppingItems.map((item) => item.materialName),
      ...cabinetItems
        .filter((item) => item.quantityStatus === 'genug' || item.quantityStatus === 'viel')
        .map((item) => item.materialName),
    ])
    const additions = shoppingItemsForMission(mission, DEFAULT_PROFILE.id).filter(
      (item) => !unavailableNames.has(item.materialName),
    )
    await Promise.all(additions.map((item) => indexedDbShoppingListRepository.save(item)))
    setShoppingMessage(
      additions.length > 0
        ? `${additions.length} Material${additions.length === 1 ? '' : 'ien'} hinzugefügt.`
        : 'Alles ist bereits vorhanden oder auf der Einkaufsliste.',
    )
  }

  if (phase === 'detail') {
    return (
      <div className="mission-flow">
        <MissionDetailView
          mission={mission}
          onStart={() => setPhase('run')}
          rankedVariants={rankedVariants}
          selectedVariant={effectiveVariant}
          onSelectVariant={setSelectedVariant}
          onAddToShoppingList={addToShoppingList}
          shoppingMessage={shoppingMessage}
        />
        <div className="mission-flow__secondary-actions">
          <Button variant="ghost" onClick={() => toggleSaved(mission.id)}>
            {savedMissionIds.has(mission.id) ? '🗝️ Gemerkt' : '🗝️ Merken'}
          </Button>
        </div>
        <BackLink to="/">← Zurück zur Startseite</BackLink>
      </div>
    )
  }

  if (phase === 'run') {
    return (
      <StepRunner
        mission={mission}
        onAllStepsDone={() => setPhase('rating')}
        onExit={() => setPhase('detail')}
        mascotId={profile?.mascotVariant}
        initialCheckedStepIds={experimentProgress?.checkedStepIds}
        onProgress={mission.experimentProfile ? saveExperimentProgress : undefined}
        onPause={mission.experimentProfile?.durationDays ? () => navigate('/') : undefined}
      />
    )
  }

  return (
    <>
      <CompletionForm
        mission={mission}
        onSubmit={trySave}
        submitting={saveStatus === 'saving'}
        mascotId={profile?.mascotVariant}
        drinkVariant={effectiveVariant}
      />
      {saveStatus === 'error' && (
        <div className="mission-flow__save-error" role="alert">
          <p>
            Speichern hat nicht geklappt. Bitte den Text unten Michael zeigen oder abfotografieren -
            das hilft bei der Fehlersuche.
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
