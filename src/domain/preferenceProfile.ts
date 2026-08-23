import type { AdjustmentTag } from './rating'
import type { DiaryEntry } from './diary'
import type { Mission, MissionTraits } from './mission'

type TraitKey = keyof MissionTraits

/**
 * Wie sich jeder strukturierte Anpassungswunsch aus der Abschlussbewertung auf die
 * Merkmals-Affinität im Präferenzprofil auswirkt. Bewusst eine einfache, nachvollziehbare
 * Tabelle statt eines trainierten Modells - jede Änderung lässt sich direkt auf eine konkrete
 * Bewertung zurückführen.
 */
const ADJUSTMENT_TRAIT_EFFECTS: Partial<Record<AdjustmentTag, Partial<Record<TraitKey, number>>>> = {
  gruseliger: { gruselig: 1 },
  weniger_gruselig: { gruselig: -1 },
  farbiger: { farbig: 1 },
  weniger_suess: { suess: -1 },
  einfacher: { aufwand: -1 },
  schwieriger: { aufwand: 1 },
}

const ZERO_TRAITS: MissionTraits = {
  gruselig: 0,
  farbig: 0,
  suess: 0,
  kreativ: 0,
  unordentlich: 0,
  aufwand: 0,
}

export interface PreferenceProfile {
  profileId: string
  /** Positiv = mehr davon gewünscht, negativ = weniger, 0 = kein Signal. Unbeschränkt (kein 0-5-Limit wie bei Missionsmerkmalen). */
  traitAffinity: MissionTraits
  /** Anzahl Bewertungen, aus denen das Profil entstanden ist. */
  ratedMissionCount: number
}

/**
 * Baut das Präferenzprofil frisch aus allen Tagebucheinträgen eines Profils auf. Bewusst keine
 * separate Speicherung - der Tagebucheintrag mit seinen `rating.adjustments` bleibt die einzige
 * Quelle der Wahrheit, damit das Profil nie von den tatsächlichen Bewertungen abweichen kann.
 * `entries` muss bereits auf ein Profil gefiltert sein (z. B. via `DiaryRepository.getAllEntries(profileId)`).
 */
export function buildPreferenceProfile(profileId: string, entries: DiaryEntry[]): PreferenceProfile {
  const traitAffinity: MissionTraits = { ...ZERO_TRAITS }

  for (const entry of entries) {
    for (const tag of entry.rating.adjustments) {
      const effects = ADJUSTMENT_TRAIT_EFFECTS[tag]
      if (!effects) continue
      for (const trait of Object.keys(effects) as TraitKey[]) {
        traitAffinity[trait] += effects[trait] ?? 0
      }
    }
  }

  return { profileId, traitAffinity, ratedMissionCount: entries.length }
}

/**
 * Bewertet, wie gut eine Mission zum Präferenzprofil passt (Skalarprodukt aus Missionsmerkmalen
 * und Merkmals-Affinität). Höher = passender. 0, solange das Profil noch kein Signal hat.
 */
export function scoreMissionForProfile(mission: Mission, profile: PreferenceProfile): number {
  let score = 0
  for (const trait of Object.keys(mission.traits) as TraitKey[]) {
    score += mission.traits[trait] * profile.traitAffinity[trait]
  }
  return score
}
