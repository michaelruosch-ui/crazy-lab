import { useEffect, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import { MissionFlowPage } from './app/MissionFlowPage'
import { HomePage, HistoryPage } from './features/missions'
import { DiaryPage, DiaryEntryDetailPage } from './features/diary'
import { SecretVaultPage } from './features/secret-vault'
import { OnboardingFlow } from './features/onboarding'
import { ProfilePage, useProfile } from './features/profile'
import { DEFAULT_PROFILE } from './domain'
import { downloadBackupFromCloud } from './storage/cloudSync'
import { restoreBackup } from './storage/backup'

function MissionRoute() {
  const { missionId } = useParams<{ missionId: string }>()
  if (!missionId) return null
  return <MissionFlowPage key={missionId} missionId={missionId} />
}

export function App() {
  const { profile, loading, save, reload } = useProfile(DEFAULT_PROFILE.id)
  const [cloudCheckDone, setCloudCheckDone] = useState(false)
  const profileReady = Boolean(profile && profile.onboardingCompletedAt)

  useEffect(() => {
    if (loading || profileReady || cloudCheckDone) return
    // Kein lokales Profil (z. B. frische Installation) - einmalig prüfen, ob in der Cloud
    // bereits ein Stand für diese Familie liegt, bevor Elena das Onboarding nochmal durchlaufen
    // müsste (siehe DECISIONS.md ADR-019). Ohne Internet oder ohne Cloud-Setup bleibt das
    // Verhalten unverändert wie zuvor.
    let cancelled = false
    downloadBackupFromCloud()
      .then(async (backup) => {
        if (cancelled) return
        if (backup) {
          await restoreBackup(backup)
          await reload()
        }
      })
      .finally(() => {
        if (!cancelled) setCloudCheckDone(true)
      })
    return () => {
      cancelled = true
    }
  }, [loading, profileReady, cloudCheckDone, reload])

  if (loading || (!profileReady && !cloudCheckDone)) {
    return <p className="app-loading">Lade...</p>
  }

  if (!profile || !profile.onboardingCompletedAt) {
    return <OnboardingFlow onComplete={save} />
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mission/:missionId" element={<MissionRoute />} />
      <Route path="/geheimfach" element={<SecretVaultPage />} />
      <Route path="/verlauf" element={<HistoryPage />} />
      <Route path="/diary" element={<DiaryPage />} />
      <Route path="/diary/:entryId" element={<DiaryEntryDetailPage />} />
      <Route path="/profil" element={<ProfilePage />} />
    </Routes>
  )
}
