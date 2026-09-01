import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { missions } from '../../data'
import type { MissionCategory } from '../../domain'
import {
  DEFAULT_PROFILE,
  DEFAULT_MISSION_FILTERS,
  buildPreferenceProfile,
  filterMissions,
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
import { MissionFiltersPanel } from './MissionFiltersPanel'
import { indexedDbExperimentProgressRepository } from '../../storage/experimentProgressRepository'
import './HomePage.css'

const CATEGORY_SECTIONS: { category: MissionCategory; title: string }[] = [
  { category: 'getraenk', title: '🧃 Getränke' },
  { category: 'basteln', title: '🎨 Basteln' },
  { category: 'experiment', title: '🧪 Experimente' },
  { category: 'foto', title: '📷 Foto-Challenges' },
  { category: 'schwestern', title: '👭 Schwestern-Missionen' },
]

export function HomePage() {
  const [filters, setFilters] = useState(DEFAULT_MISSION_FILTERS)
  const [ongoingExperimentIds, setOngoingExperimentIds] = useState<string[]>([])
  const { profile } = useProfile(DEFAULT_PROFILE.id)
  const { savedMissionIds, toggle: toggleSaved } = useSecretVault(DEFAULT_PROFILE.id)
  const { currentlyHiddenMissionIds, hide } = useHiddenMissions(DEFAULT_PROFILE.id)
  const { entries: diaryEntries } = useDiaryEntries(DEFAULT_PROFILE.id)
  const preferenceProfile = buildPreferenceProfile(DEFAULT_PROFILE.id, diaryEntries)
  const completedMissionIds = new Set(diaryEntries.map((entry) => entry.missionSnapshot.missionId))

  useEffect(() => {
    let cancelled = false
    indexedDbExperimentProgressRepository.getAll(DEFAULT_PROFILE.id).then((progress) => {
      if (!cancelled) setOngoingExperimentIds(progress.map((item) => item.missionId))
    })
    return () => {
      cancelled = true
    }
  }, [])

  const ongoingExperiments = ongoingExperimentIds
    .map((missionId) => missions.find((mission) => mission.id === missionId))
    .filter((mission) => mission !== undefined)

  const researcherName = profile?.researcherName ?? DEFAULT_PROFILE.researcherName
  const mascotId = profile?.mascotVariant ?? DEFAULT_PROFILE.mascotVariant
  const today = new Date()
  const todaysBirthdays = (profile?.birthdays ?? []).filter((b) => isBirthdayToday(b, today))
  const matchingMissions = filterMissions(missions, filters)
  const matchingAvailableCount = matchingMissions.filter(
    (mission) => !currentlyHiddenMissionIds.has(mission.id) && !completedMissionIds.has(mission.id),
  ).length

  const categorySuggestions = new Map(
    CATEGORY_SECTIONS.map(({ category }) => [
      category,
      suggestionsForCategory(
        matchingMissions,
        category,
        currentlyHiddenMissionIds,
        preferenceProfile,
        completedMissionIds,
      ),
    ]),
  )
  const categoryMissionIds = new Set(
    Array.from(categorySuggestions.values())
      .reduce((all, categoryMissions) => all.concat(categoryMissions), [])
      .map((mission) => mission.id),
  )

  const dailyMission = pickDailyMission(
    matchingMissions,
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

      <MissionFiltersPanel
        filters={filters}
        resultCount={matchingAvailableCount}
        onChange={setFilters}
      />

      {ongoingExperiments.length > 0 && (
        <section className="home-page__ongoing">
          <h2>🌱 Laufende Versuche</h2>
          <p>Deine bisherigen Schritte sind sicher. Hier kannst du direkt weitermachen.</p>
          {ongoingExperiments.map((mission) => (
            <Link key={mission.id} to={`/mission/${mission.id}`}>
              🧪 {mission.title} fortsetzen
            </Link>
          ))}
        </section>
      )}

      {matchingAvailableCount === 0 && (
        <p className="home-page__no-match">
          🕵️ Keine offene Mission passt zu allen Filtern. Lösche einen Filter und schau nochmals.
        </p>
      )}

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
        <Link to="/eigene-missionen" className="home-page__nav-link">
          ✨ Eigene Missionen
        </Link>
        <Link to="/einkaufsliste" className="home-page__nav-link">
          🛒 Einkaufsliste
        </Link>
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
