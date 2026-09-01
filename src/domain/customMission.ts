import type { Mission } from './mission'

export interface CustomMission extends Mission {
  profileId: string
  createdAt: string
  updatedAt: string
  sourceMissionId?: string
}

export function isCustomMissionSafe(
  mission: Pick<Mission, 'safetyLevel' | 'safetyNotes'>,
): boolean {
  return (
    mission.safetyLevel === 'gruen' || mission.safetyNotes.some((note) => note.trim().length >= 10)
  )
}
