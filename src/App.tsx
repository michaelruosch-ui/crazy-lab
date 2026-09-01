import { useEffect, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import { MissionFlowPage } from './app/MissionFlowPage'
import { HomePage, HistoryPage } from './features/missions'
import { DiaryPage, DiaryEntryDetailPage } from './features/diary'
import { SecretVaultPage } from './features/secret-vault'
import { OnboardingFlow } from './features/onboarding'
import { ProfilePage, useProfile } from './features/profile'
import { LabCabinetPage } from './features/lab-cabinet'
import { ShoppingListPage } from './features/shopping-list'
import { DEFAULT_PROFILE } from './domain'
import { requestPersistentStorage } from './storage/persistentStorage'
import { useAutomaticSnapshots } from './storage/useAutomaticSnapshots'
import { indexedDbCustomMissionRepository } from './storage/customMissionRepository'
import type { CustomMission } from './domain'
import { CustomMissionEditorPage, CustomMissionsPage } from './features/custom-missions'
import { useAtmosphereSettings } from './features/atmosphere'
import { AppShell } from './components/AppShell'

function MissionRoute() {
  const { missionId } = useParams<{ missionId: string }>()
  const [customMission, setCustomMission] = useState<CustomMission | null>()

  useEffect(() => {
    if (!missionId?.startsWith('mission-eigen-')) {
      return
    }
    void indexedDbCustomMissionRepository
      .get(missionId)
      .then((mission) => setCustomMission(mission ?? null))
  }, [missionId])

  if (!missionId) return null
  if (missionId.startsWith('mission-eigen-') && customMission === undefined)
    return <p className="app-loading">Lade Mission...</p>
  return (
    <MissionFlowPage
      key={`${missionId}-${customMission?.contentVersion ?? 'katalog'}`}
      missionId={missionId}
      missionOverride={customMission ?? undefined}
    />
  )
}

export function App() {
  const { settings } = useAtmosphereSettings()
  const { profile, loading, save } = useProfile(DEFAULT_PROFILE.id)
  useAutomaticSnapshots(profile?.onboardingCompletedAt ? profile.id : undefined)
  useEffect(() => {
    void requestPersistentStorage()
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', !settings.animationsEnabled)
  }, [settings.animationsEnabled])

  if (loading) {
    return <p className="app-loading">Lade...</p>
  }

  if (!profile || !profile.onboardingCompletedAt) {
    return <OnboardingFlow onComplete={save} />
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/mission/:missionId" element={<MissionRoute />} />
        <Route path="/geheimfach" element={<SecretVaultPage />} />
        <Route path="/verlauf" element={<HistoryPage />} />
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/diary/:entryId" element={<DiaryEntryDetailPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/laborschrank" element={<LabCabinetPage />} />
        <Route path="/einkaufsliste" element={<ShoppingListPage />} />
        <Route path="/eigene-missionen" element={<CustomMissionsPage />} />
        <Route path="/eigene-missionen/neu" element={<CustomMissionEditorPage />} />
        <Route
          path="/eigene-missionen/:missionId/bearbeiten"
          element={<CustomMissionEditorPage />}
        />
      </Route>
    </Routes>
  )
}
