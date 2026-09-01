import type { DiaryEntry } from '../domain'
import { DIARY_STORE, getDb } from './db'

export interface DiaryRepository {
  saveEntry(entry: DiaryEntry): Promise<void>
  getAllEntries(profileId?: string): Promise<DiaryEntry[]>
  getEntry(id: string): Promise<DiaryEntry | undefined>
  removeEntry(id: string): Promise<void>
}

export const indexedDbDiaryRepository: DiaryRepository = {
  async saveEntry(entry) {
    const db = await getDb()
    await db.put(DIARY_STORE, entry)
  },

  async getAllEntries(profileId) {
    const db = await getDb()
    const all = await db.getAllFromIndex(DIARY_STORE, 'by-completedAt')
    const sorted = all.sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    return profileId ? sorted.filter((entry) => entry.profileId === profileId) : sorted
  },

  async getEntry(id) {
    const db = await getDb()
    return db.get(DIARY_STORE, id)
  },
  async removeEntry(id) {
    const db = await getDb()
    await db.delete(DIARY_STORE, id)
  },
}
