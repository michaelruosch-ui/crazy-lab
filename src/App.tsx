import { useEffect, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import { MissionFlowPage } from './app/MissionFlowPage'
import { HomePage, HistoryPage } from './features/missions'
import { DiaryPage, DiaryEntryDetailPage } from './features/diary'
import { SecretVaultPage } from './features/secret-vault'
import { OnboardingFlow } from './features/onboarding'
import { ProfilePage, useProfile } from './features/profile'
import { DEFAULT_PROFILE } from './domain'
import { downloadBackupFromMac } from './storage/localBackup'
import { restoreBackup } from './storage/backup'
import { requestPersistentStorage } from './storage/persistentStorage'

function MissionRoute() {
  const { missionId } = useParams<{ missionId: string }>()
  if (!missionId) return null
  return <MissionFlowPage key={missionId} missionId={missionId} />
}

export function App() {
  const { profile, loading, save, reload } = useProfile(DEFAULT_PROFILE.id)
  const [backupCheckDone, setBackupCheckDone] = useState(false)
  const profileReady = Boolean(profile && profile.onboardingCompletedAt)

  useEffect(() => {
    void requestPersistentStorage()
  }, [])

  useEffect(() => {
    if (loading || profileReady || backupCheckDone) return
    // Bei leerem iPhone-Speicher versucht die App einmalig, Michaels lokalen Mac zu erreichen.
    let cancelled = false
    downloadBackupFromMac()
      .then(async (backup) => {
        if (cancelled) return
        if (backup) {
          await restoreBackup(backup)
          await reload()
        }
      })
      .finally(() => {
        if (!cancelled) setBackupCheckDone(true)
      })
    return () => {
      cancelled = true
    }
  }, [loading, profileReady, backupCheckDone, reload])

  if (loading || (!profileReady && !backupCheckDone)) {
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
