export type MissionCategory = 'getraenk' | 'basteln' | 'experiment' | 'foto' | 'schwestern'

export type Difficulty = 'leicht' | 'mittel' | 'schwer'

export type SafetyLevel = 'gruen' | 'gelb' | 'rot'

export type MissionLocation = 'kueche' | 'zimmer' | 'bad' | 'garten' | 'ueberall'

export interface MaterialItem {
  id: string
  name: string
  quantity?: string
  optional: boolean
  consumable: boolean
}

export interface MissionStep {
  id: string
  order: number
  text: string
  timerSeconds?: number
  helpTip?: string
}

/** Merkmale 0 (nicht vorhanden) bis 5 (sehr stark). */
export interface MissionTraits {
  gruselig: number
  farbig: number
  suess: number
  kreativ: number
  unordentlich: number
  aufwand: number
}

export type DrinkTaste = 'suess' | 'sauer' | 'fruchtig' | 'cremig' | 'prickelnd'

export interface DrinkVariant {
  name: string
  description: string
}

/**
 * Strukturierte Getränkemerkmale aus Sprint 6. Sie machen den Katalog filter- und lernfähig,
 * ohne die differenzierte Getränke-Bewertung aus Sprint 7 vorwegzunehmen.
 */
export interface DrinkProfile {
  tastes: DrinkTaste[]
  servingTemperature: 'kalt' | 'warm'
  appearance: string[]
  equipment: string[]
  variants: DrinkVariant[]
}

export interface ExperimentProfile {
  researchQuestion: string
  hypothesisPrompt: string
  observationPrompt: string
  explanation: string
  durationDays?: number
}

export interface PhotoProfile {
  tips: string[]
  frames: string[]
  effects: string[]
}

export interface SisterProfile {
  secretTaskElena: string
  secretTaskSister: string
  jointFinish: string
  timeChallengeSeconds?: number
}

export interface Mission {
  id: string
  contentVersion: number
  title: string
  shortDescription: string
  primaryCategory: MissionCategory
  secondaryCategories: MissionCategory[]
  durationMinutes: number
  difficulty: Difficulty
  estimatedCostChf: number
  materials: MaterialItem[]
  safetyLevel: SafetyLevel
  safetyNotes: string[]
  location: MissionLocation
  traits: MissionTraits
  drinkProfile?: DrinkProfile
  experimentProfile?: ExperimentProfile
  photoProfile?: PhotoProfile
  sisterProfile?: SisterProfile
  steps: MissionStep[]
  generalHelpTip: string
  completionQuestion: string
  imagePlaceholder: string
}

export function findStepHelpTip(mission: Mission, stepId: string): string {
  const step = mission.steps.find((s) => s.id === stepId)
  return step?.helpTip ?? mission.generalHelpTip
}
