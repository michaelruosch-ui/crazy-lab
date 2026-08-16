export type MissionCategory =
  | 'getraenk'
  | 'basteln'
  | 'experiment'
  | 'foto'
  | 'schwestern'

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
  steps: MissionStep[]
  generalHelpTip: string
  completionQuestion: string
  imagePlaceholder: string
}

export function findStepHelpTip(mission: Mission, stepId: string): string {
  const step = mission.steps.find((s) => s.id === stepId)
  return step?.helpTip ?? mission.generalHelpTip
}
