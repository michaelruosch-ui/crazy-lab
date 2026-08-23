import { Routes, Route, useParams } from 'react-router-dom'
import { MissionFlowPage } from './app/MissionFlowPage'
import { HomePage, HistoryPage } from './features/missions'
import { DiaryPage, DiaryEntryDetailPage } from './features/diary'
import { SecretVaultPage } from './features/secret-vault'

function MissionRoute() {
  const { missionId } = useParams<{ missionId: string }>()
  if (!missionId) return null
  return <MissionFlowPage key={missionId} missionId={missionId} />
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mission/:missionId" element={<MissionRoute />} />
      <Route path="/geheimfach" element={<SecretVaultPage />} />
      <Route path="/verlauf" element={<HistoryPage />} />
      <Route path="/diary" element={<DiaryPage />} />
      <Route path="/diary/:entryId" element={<DiaryEntryDetailPage />} />
    </Routes>
  )
}
