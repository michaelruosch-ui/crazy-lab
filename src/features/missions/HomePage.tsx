import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { missions } from '../../data'
import type { MissionCategory } from '../../domain'
import {
  DEFAULT_MISSION_FILTERS,
  buildPreferenceProfile,
  canEditMissionCatalog,
  filterMissions,
  isBirthdayToday,
  missionUsesOnlyAvailableMaterials,
  pickDailyMission,
  suggestionsForCategory,
} from '../../domain'
import { Mascot, MissionCard, ResearchAchievements } from '../../components'
import { useSecretVault } from '../secret-vault'
import { useDiaryEntries } from '../diary'
import { useActiveProfileId, useProfile } from '../profile'
import { useHiddenMissions } from './useHiddenMissions'
import { MissionSection } from './MissionSection'
import { MissionFiltersPanel } from './MissionFiltersPanel'
import { LabPortal } from './LabPortal'
import { indexedDbExperimentProgressRepository } from '../../storage/experimentProgressRepository'
import { useLabCabinet } from '../lab-cabinet/useLabCabinet'
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
  const [onlyAvailableMaterials, setOnlyAvailableMaterials] = useState(false)
  const { activeProfileId } = useActiveProfileId()
  const { profile } = useProfile(activeProfileId)
  const { savedMissionIds, toggle: toggleSaved } = useSecretVault(activeProfileId)
  const { currentlyHiddenMissionIds, hide } = useHiddenMissions(activeProfileId)
  const { entries: diaryEntries } = useDiaryEntries(activeProfileId)
  const { items: cabinetItems } = useLabCabinet(activeProfileId)
  const preferenceProfile = buildPreferenceProfile(activeProfileId, diaryEntries)
  const completedMissionIds = new Set(diaryEntries.map((entry) => entry.missionSnapshot.missionId))

  useEffect(() => {
    let cancelled = false
    indexedDbExperimentProgressRepository.getAll(activeProfileId).then((progress) => {
      if (!cancelled) setOngoingExperimentIds(progress.map((item) => item.missionId))
    })
    return () => {
      cancelled = true
    }
  }, [activeProfileId])

  const ongoingExperiments = ongoingExperimentIds
    .map((missionId) => missions.find((mission) => mission.id === missionId))
    .filter((mission) => mission !== undefined)

  const researcherName = profile?.researcherName ?? 'Forscherin'
  const mascotId = profile?.mascotVariant ?? 'blutiger-kuschelbaer'
  const today = new Date()
  const todaysBirthdays = (profile?.birthdays ?? []).filter((b) => isBirthdayToday(b, today))
  const matchingMissions = filterMissions(missions, filters).filter(
    (mission) =>
      !onlyAvailableMaterials ||
      (mission.primaryCategory !== 'foto' &&
        missionUsesOnlyAvailableMaterials(mission, cabinetItems)),
  )
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
    activeProfileId,
    today,
    new Set([...categoryMissionIds, ...completedMissionIds]),
  )
  const personalSuggestions = CATEGORY_SECTIONS.map(({ category }) =>
    categorySuggestions.get(category)?.at(0),
  )
    .filter((mission) => mission !== undefined)
    .slice(0, 3)
  const personalSuggestionIds = new Set(personalSuggestions.map((mission) => mission.id))

  return (
    <div className="home-page">
      <LabPortal profileId={activeProfileId} researcherName={researcherName} />
      <header className="home-page__header">
        <Mascot mascotId={mascotId} size="small" />
        <div>
          <h1>🔮 Crazy Lab</h1>
          <p>Willkommen zurück im Labor, {researcherName}!</p>
        </div>
      </header>

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

      {dailyMission && todaysBirthdays.length > 0 && (
        <section className="home-page__daily home-page__daily--birthday">
          <h2>🎂 Geburtstagsmission für {todaysBirthdays.map((b) => b.personName).join(' & ')}!</h2>
          <p>Heute ist ein besonderer Tag - wie wäre es damit?</p>
          <MissionCard mission={dailyMission} featured />
        </section>
      )}

      {dailyMission && todaysBirthdays.length === 0 && (
        <section className="home-page__daily">
          <p className="home-page__eyebrow">Nur heute für dich</p>
          <h2>✨ Deine Tagesmission</h2>
          <MissionCard mission={dailyMission} featured />
        </section>
      )}

      {personalSuggestions.length > 0 && (
        <section className="home-page__suggestions">
          <div className="home-page__section-heading">
            <div>
              <p className="home-page__eyebrow">Dein nächstes Abenteuer</p>
              <h2>🔮 Für dich entdeckt</h2>
            </div>
            <span>3 Ideen</span>
          </div>
          <div className="home-page__suggestion-rail">
            {personalSuggestions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </section>
      )}

      <section className="home-page__explore">
        <div className="home-page__section-heading">
          <div>
            <p className="home-page__eyebrow">Du entscheidest</p>
            <h2>🗺️ Labor erkunden</h2>
          </div>
        </div>
        <button
          type="button"
          className={`home-page__available-toggle ${onlyAvailableMaterials ? 'is-active' : ''}`}
          aria-pressed={onlyAvailableMaterials}
          onClick={() => setOnlyAvailableMaterials((value) => !value)}
        >
          🧰 Missionen, für die ich alles zu Hause habe
        </button>
        <MissionFiltersPanel
          filters={filters}
          resultCount={matchingAvailableCount}
          onChange={setFilters}
        />
      </section>

      {matchingAvailableCount === 0 && (
        <p className="home-page__no-match">
          🕵️ Keine offene Mission passt zu allen Filtern. Lösche einen Filter und schau nochmals.
        </p>
      )}

      <div className="home-page__categories">
        {CATEGORY_SECTIONS.map(({ category, title }) => (
          <MissionSection
            key={category}
            title={title}
            missions={(categorySuggestions.get(category) ?? []).filter(
              (mission) => !personalSuggestionIds.has(mission.id),
            )}
            savedMissionIds={savedMissionIds}
            onToggleSave={toggleSaved}
            onHide={hide}
          />
        ))}
      </div>

      <ResearchAchievements entries={diaryEntries} />

      <nav className="home-page__nav">
        {canEditMissionCatalog(activeProfileId) && (
          <Link to="/eigene-missionen" className="home-page__nav-link">
            ✨ Eigene Missionen
          </Link>
        )}
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
