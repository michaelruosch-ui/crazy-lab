import type { Mission, MissionLocation } from './mission'
import type { LabCabinetItem } from './labCabinet'

export interface MissionFilters {
  maxDurationMinutes?: number
  maxBudgetChf?: number
  location?: MissionLocation
  maxMess?: number
  adultAvailable: boolean
  peopleAvailable?: 1 | 2
}

export const DEFAULT_MISSION_FILTERS: MissionFilters = {
  adultAvailable: true,
}

export function missionNeedsAdult(mission: Mission): boolean {
  return (
    mission.safetyLevel !== 'gruen' ||
    mission.safetyNotes.some((note) => /erwachsen|hilfe|helfen|aufsicht/i.test(note)) ||
    /erwachsen|hilfe|helfen|aufsicht/i.test(mission.generalHelpTip)
  )
}

export function minimumPeopleForMission(mission: Mission): 1 | 2 {
  return mission.primaryCategory === 'schwestern' ? 2 : 1
}

export function missionMatchesFilters(mission: Mission, filters: MissionFilters): boolean {
  if (
    filters.maxDurationMinutes !== undefined &&
    mission.durationMinutes > filters.maxDurationMinutes
  ) {
    return false
  }
  if (filters.maxBudgetChf !== undefined && mission.estimatedCostChf > filters.maxBudgetChf) {
    return false
  }
  if (
    filters.location !== undefined &&
    mission.location !== filters.location &&
    !(filters.location !== 'ueberall' && mission.location === 'ueberall')
  ) {
    return false
  }
  if (filters.maxMess !== undefined && mission.traits.unordentlich > filters.maxMess) return false
  if (!filters.adultAvailable && missionNeedsAdult(mission)) return false
  if (
    filters.peopleAvailable !== undefined &&
    minimumPeopleForMission(mission) > filters.peopleAvailable
  ) {
    return false
  }
  return true
}

export function filterMissions(missions: Mission[], filters: MissionFilters): Mission[] {
  return missions.filter((mission) => missionMatchesFilters(mission, filters))
}

export function missionUsesOnlyAvailableMaterials(
  mission: Mission,
  cabinetItems: LabCabinetItem[],
): boolean {
  const available = new Set(
    cabinetItems
      .filter((item) => item.quantityStatus === 'genug' || item.quantityStatus === 'viel')
      .map((item) => item.materialName.trim().toLocaleLowerCase('de')),
  )
  return mission.materials
    .filter((material) => !material.optional)
    .every((material) => available.has(material.name.trim().toLocaleLowerCase('de')))
}
