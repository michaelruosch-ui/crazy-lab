import { missions } from './missions'

export { missions }

/** Sprint 1 zeigt direkt diese Beispielmission als ersten Bildschirm. */
export const STARTER_MISSION_ID = 'mission-blutroter-schatten-trank'

export function getMissionById(id: string) {
  return missions.find((mission) => mission.id === id)
}
