import { Routes, Route } from 'react-router-dom'
import { MissionFlowPage } from './app/MissionFlowPage'
import { DiaryPage } from './features/diary'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<MissionFlowPage />} />
      <Route path="/diary" element={<DiaryPage />} />
    </Routes>
  )
}
