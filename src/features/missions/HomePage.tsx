import { Link } from 'react-router-dom'
import { missions } from '../../data'
import type { MissionCategory } from '../../domain'
import { DEFAULT_PROFILE, pickDailyMission, suggestionsForCategory } from '../../domain'
import { MissionCard } from '../../components'
import { useSecretVault } from '../secret-vault'
import { useHiddenMissions } from './useHiddenMissions'
import { MissionSection } from './MissionSection'
import './HomePage.css'

const CATEGORY_SECTIONS: { category: MissionCategory; title: string }[] = [
  { category: 'getraenk', title: '🧃 Getränke' },
  { category: 'basteln', title: '🎨 Basteln' },
  { category: 'experiment', title: '🧪 Experimente' },
  { category: 'foto', title: '📷 Foto-Challenges' },
  { category: 'schwestern', title: '👭 Schwestern-Missionen' },
]

export function HomePage() {
  const { savedMissionIds, toggle: toggleSaved } = useSecretVault(DEFAULT_PROFILE.id)
  const { currentlyHiddenMissionIds, hide } = useHiddenMissions(DEFAULT_PROFILE.id)

  const dailyMission = pickDailyMission(
    missions,
    currentlyHiddenMissionIds,
    DEFAULT_PROFILE.id,
    new Date(),
  )

  return (
    <div className="home-page">
      <header className="home-page__header">
        <h1>🔮 Crazy Lab</h1>
        <p>Willkommen zurück im Labor, {DEFAULT_PROFILE.researcherName}!</p>
      </header>

      {dailyMission && (
        <section className="home-page__daily">
          <h2>✨ Tagesmission</h2>
          <MissionCard mission={dailyMission} />
        </section>
      )}

      {CATEGORY_SECTIONS.map(({ category, title }) => (
        <MissionSection
          key={category}
          title={title}
          missions={suggestionsForCategory(missions, category, currentlyHiddenMissionIds)}
          savedMissionIds={savedMissionIds}
          onToggleSave={toggleSaved}
          onHide={hide}
        />
      ))}

      <nav className="home-page__nav">
        <Link to="/geheimfach" className="home-page__nav-link">
          🗝️ Geheimfach
        </Link>
        <Link to="/verlauf" className="home-page__nav-link">
          📜 Verlauf
        </Link>
        <Link to="/diary" className="home-page__nav-link">
          📖 Geheimnisvolles Labortagebuch
        </Link>
      </nav>
    </div>
  )
}
