import { Link } from 'react-router-dom'
import { missions } from '../../data'
import type { MissionCategory } from '../../domain'
import {
  DEFAULT_PROFILE,
  buildPreferenceProfile,
  isBirthdayToday,
  pickDailyMission,
  suggestionsForCategory,
} from '../../domain'
import { Mascot, MissionCard } from '../../components'
import { useSecretVault } from '../secret-vault'
import { useDiaryEntries } from '../diary'
import { useProfile } from '../profile'
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
  const { profile } = useProfile(DEFAULT_PROFILE.id)
  const { savedMissionIds, toggle: toggleSaved } = useSecretVault(DEFAULT_PROFILE.id)
  const { currentlyHiddenMissionIds, hide } = useHiddenMissions(DEFAULT_PROFILE.id)
  const { entries: diaryEntries } = useDiaryEntries(DEFAULT_PROFILE.id)
  const preferenceProfile = buildPreferenceProfile(DEFAULT_PROFILE.id, diaryEntries)
  const completedMissionIds = new Set(diaryEntries.map((entry) => entry.missionSnapshot.missionId))

  const researcherName = profile?.researcherName ?? DEFAULT_PROFILE.researcherName
  const mascotId = profile?.mascotVariant ?? DEFAULT_PROFILE.mascotVariant
  const today = new Date()
  const todaysBirthdays = (profile?.birthdays ?? []).filter((b) => isBirthdayToday(b, today))

  const categorySuggestions = new Map(
    CATEGORY_SECTIONS.map(({ category }) => [
      category,
      suggestionsForCategory(
        missions,
        category,
        currentlyHiddenMissionIds,
        preferenceProfile,
        completedMissionIds,
      ),
    ]),
  )
  const categoryMissionIds = new Set(
    [...categorySuggestions.values()].flat().map((mission) => mission.id),
  )

  const dailyMission = pickDailyMission(
    missions,
    currentlyHiddenMissionIds,
    DEFAULT_PROFILE.id,
    today,
    new Set([...categoryMissionIds, ...completedMissionIds]),
  )

  return (
    <div className="home-page">
      <header className="home-page__header">
        <Mascot mascotId={mascotId} size="small" />
        <div>
          <h1>🔮 Crazy Lab</h1>
          <p>Willkommen zurück im Labor, {researcherName}!</p>
        </div>
      </header>

      {dailyMission && todaysBirthdays.length > 0 && (
        <section className="home-page__daily home-page__daily--birthday">
          <h2>🎂 Geburtstagsmission für {todaysBirthdays.map((b) => b.personName).join(' & ')}!</h2>
          <p>Heute ist ein besonderer Tag - wie wäre es damit?</p>
          <MissionCard mission={dailyMission} />
        </section>
      )}

      {dailyMission && todaysBirthdays.length === 0 && (
        <section className="home-page__daily">
          <h2>✨ Tagesmission</h2>
          <MissionCard mission={dailyMission} />
        </section>
      )}

      {CATEGORY_SECTIONS.map(({ category, title }) => (
        <MissionSection
          key={category}
          title={title}
          missions={categorySuggestions.get(category) ?? []}
          savedMissionIds={savedMissionIds}
          onToggleSave={toggleSaved}
          onHide={hide}
        />
      ))}

      <nav className="home-page__nav">
        <Link to="/laborschrank" className="home-page__nav-link">
          🧰 Laborschrank
        </Link>
        <Link to="/geheimfach" className="home-page__nav-link">
          🗝️ Gemerkte Missionen
        </Link>
        <Link to="/verlauf" className="home-page__nav-link">
          📜 Verlauf
        </Link>
        <Link to="/diary" className="home-page__nav-link">
          📖 Geheimnisvolles Labortagebuch
        </Link>
        <Link to="/profil" className="home-page__nav-link">
          👤 Profil
        </Link>
      </nav>
    </div>
  )
}
