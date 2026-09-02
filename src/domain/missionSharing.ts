import type { CustomMission } from './customMission'
import type {
  Difficulty,
  MaterialItem,
  MissionCategory,
  MissionLocation,
  MissionStep,
  MissionTraits,
  SafetyLevel,
} from './mission'

const CATEGORIES: MissionCategory[] = ['getraenk', 'basteln', 'experiment', 'foto', 'schwestern']
const DIFFICULTIES: Difficulty[] = ['leicht', 'mittel', 'schwer']
const SAFETY_LEVELS: SafetyLevel[] = ['gruen', 'gelb', 'rot']
const LOCATIONS: MissionLocation[] = ['kueche', 'zimmer', 'bad', 'garten', 'ueberall']

export interface SharedMission {
  version: 1
  title: string
  shortDescription: string
  primaryCategory: MissionCategory
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
}

export function missionForSharing(mission: CustomMission): SharedMission {
  return {
    version: 1,
    title: mission.title,
    shortDescription: mission.shortDescription,
    primaryCategory: mission.primaryCategory,
    durationMinutes: mission.durationMinutes,
    difficulty: mission.difficulty,
    estimatedCostChf: mission.estimatedCostChf,
    materials: mission.materials,
    safetyLevel: mission.safetyLevel,
    safetyNotes: mission.safetyNotes,
    location: mission.location,
    traits: mission.traits,
    steps: mission.steps,
    generalHelpTip: mission.generalHelpTip,
    completionQuestion: mission.completionQuestion,
  }
}

function toBase64Url(value: string): string {
  const bytes = encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex: string) =>
    String.fromCharCode(Number.parseInt(hex, 16)),
  )
  return btoa(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  const bytes = atob(padded)
  return decodeURIComponent(
    Array.from(
      bytes,
      (character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
    ).join(''),
  )
}

export function encodeSharedMission(mission: CustomMission): string {
  return toBase64Url(JSON.stringify(missionForSharing(mission)))
}

function isShortString(value: unknown, maximum = 500): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maximum
}

function isTraits(value: unknown): value is MissionTraits {
  if (!value || typeof value !== 'object') return false
  const traits = value as Record<string, unknown>
  return ['gruselig', 'farbig', 'suess', 'kreativ', 'unordentlich', 'aufwand'].every(
    (key) => typeof traits[key] === 'number' && traits[key] >= 0 && traits[key] <= 5,
  )
}

export function decodeSharedMission(encoded: string): SharedMission | undefined {
  if (!encoded || encoded.length > 30_000) return undefined
  try {
    const value: unknown = JSON.parse(fromBase64Url(encoded))
    if (!value || typeof value !== 'object') return undefined
    const mission = value as Record<string, unknown>
    if (
      mission.version !== 1 ||
      !isShortString(mission.title, 100) ||
      !isShortString(mission.shortDescription, 1_000) ||
      !CATEGORIES.includes(mission.primaryCategory as MissionCategory) ||
      !DIFFICULTIES.includes(mission.difficulty as Difficulty) ||
      !SAFETY_LEVELS.includes(mission.safetyLevel as SafetyLevel) ||
      !LOCATIONS.includes(mission.location as MissionLocation) ||
      typeof mission.durationMinutes !== 'number' ||
      mission.durationMinutes < 1 ||
      mission.durationMinutes > 1_440 ||
      typeof mission.estimatedCostChf !== 'number' ||
      mission.estimatedCostChf < 0 ||
      mission.estimatedCostChf > 10_000 ||
      !isTraits(mission.traits) ||
      !Array.isArray(mission.materials) ||
      mission.materials.length < 1 ||
      mission.materials.length > 100 ||
      !mission.materials.every(
        (item) =>
          item &&
          typeof item === 'object' &&
          isShortString((item as MaterialItem).id, 100) &&
          isShortString((item as MaterialItem).name, 200) &&
          typeof (item as MaterialItem).optional === 'boolean' &&
          typeof (item as MaterialItem).consumable === 'boolean',
      ) ||
      !Array.isArray(mission.steps) ||
      mission.steps.length < 2 ||
      mission.steps.length > 100 ||
      !mission.steps.every(
        (step) =>
          step &&
          typeof step === 'object' &&
          isShortString((step as MissionStep).id, 100) &&
          isShortString((step as MissionStep).text, 1_000) &&
          typeof (step as MissionStep).order === 'number',
      ) ||
      !Array.isArray(mission.safetyNotes) ||
      mission.safetyNotes.length > 20 ||
      !mission.safetyNotes.every((note) => typeof note === 'string' && note.length <= 1_000) ||
      !isShortString(mission.generalHelpTip, 1_000) ||
      !isShortString(mission.completionQuestion, 1_000)
    )
      return undefined
    return value as SharedMission
  } catch {
    return undefined
  }
}
