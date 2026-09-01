import type { CustomMission } from '../domain'
import { CUSTOM_MISSIONS_STORE, getDb } from './db'

export const indexedDbCustomMissionRepository = {
  async get(id: string): Promise<CustomMission | undefined> {
    return (await getDb()).get(CUSTOM_MISSIONS_STORE, id)
  },
  async getAll(profileId: string): Promise<CustomMission[]> {
    const missions = await (
      await getDb()
    ).getAllFromIndex(CUSTOM_MISSIONS_STORE, 'by-profile', profileId)
    return missions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },
  async save(mission: CustomMission): Promise<void> {
    await (await getDb()).put(CUSTOM_MISSIONS_STORE, mission)
  },
}
