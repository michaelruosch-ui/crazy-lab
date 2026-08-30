import type { Mission, MissionCategory } from './mission'
import type { PreferenceProfile } from './preferenceProfile'
import { scoreMissionForProfile } from './preferenceProfile'

const MAX_SUGGESTIONS_PER_CATEGORY = 5

/**
 * Missionen einer Kategorie, primäre Treffer vor sekundären, ohne aktuell versteckte Missionen.
 * Mit Präferenzprofil (sobald mindestens eine Bewertung vorliegt) werden besser passende
 * Missionen weiter vorne einsortiert, sonst bleibt die primär/sekundär-Reihenfolge erhalten
 * (stabile Sortierung).
 */
export function suggestionsForCategory(
  missions: Mission[],
  category: MissionCategory,
  hiddenMissionIds: ReadonlySet<string>,
  profile?: PreferenceProfile,
): Mission[] {
  const primary = missions.filter((m) => m.primaryCategory === category)
  const secondary = missions.filter(
    (m) => m.primaryCategory !== category && m.secondaryCategories.includes(category),
  )
  const candidates = [...primary, ...secondary].filter((m) => !hiddenMissionIds.has(m.id))

  if (profile && profile.ratedMissionCount > 0) {
    candidates.sort(
      (a, b) => scoreMissionForProfile(b, profile) - scoreMissionForProfile(a, profile),
    )
  }

  return candidates.slice(0, MAX_SUGGESTIONS_PER_CATEGORY)
}

/** Einfacher deterministischer Hash für einen String, für die tagesstabile Missionsauswahl. */
function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

/**
 * Wählt eine tagesstabile "Tagesmission" aus den aktuell sichtbaren Missionen. Dieselbe
 * Mission bleibt für den ganzen Tag gleich (Datum + Profil als Seed) und wechselt am nächsten
 * Tag automatisch. Berücksichtigt noch keine gelernten Vorlieben (Sprint 3).
 */
export function pickDailyMission(
  missions: Mission[],
  hiddenMissionIds: ReadonlySet<string>,
  profileId: string,
  today: Date,
): Mission | undefined {
  const available = missions.filter((m) => !hiddenMissionIds.has(m.id))
  if (available.length === 0) return undefined

  const dateKey = today.toISOString().slice(0, 10)
  const seed = hashString(`${profileId}:${dateKey}`)
  const sorted = [...available].sort((a, b) => a.id.localeCompare(b.id))
  return sorted[seed % sorted.length]
}
