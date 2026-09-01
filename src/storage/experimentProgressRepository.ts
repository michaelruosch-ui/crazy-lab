import type { ExperimentProgress } from '../domain'
import { EXPERIMENT_PROGRESS_STORE, getDb } from './db'

export const indexedDbExperimentProgressRepository = {
  async get(profileId: string, missionId: string): Promise<ExperimentProgress | undefined> {
    const db = await getDb()
    const items = await db.getAllFromIndex(EXPERIMENT_PROGRESS_STORE, 'by-profile', profileId)
    return items.find((item) => item.missionId === missionId)
  },
  async save(progress: ExperimentProgress): Promise<void> {
    const db = await getDb()
    await db.put(EXPERIMENT_PROGRESS_STORE, progress)
  },
  async remove(id: string): Promise<void> {
    const db = await getDb()
    await db.delete(EXPERIMENT_PROGRESS_STORE, id)
  },
  async getAll(profileId: string): Promise<ExperimentProgress[]> {
    const db = await getDb()
    return db.getAllFromIndex(EXPERIMENT_PROGRESS_STORE, 'by-profile', profileId)
  },
}
