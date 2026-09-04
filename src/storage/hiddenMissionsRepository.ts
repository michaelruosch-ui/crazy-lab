import type { HiddenMissionEntry } from '../domain'
import { createHiddenMissionEntry, generateId, isInHistory } from '../domain'
import { HIDDEN_MISSIONS_STORE, getDb } from './db'

export interface HiddenMissionsRepository {
  hide(profileId: string, missionId: string, now?: Date): Promise<void>
  /** Sämtliche Einträge für vollständige Backups, auch wenn sie nicht mehr sichtbar sind. */
  getAll(profileId: string): Promise<HiddenMissionEntry[]>
  /** Alle Verlaufseinträge der letzten 14 Tage (auch bereits wieder aktive). */
  getHistory(profileId: string, now?: Date): Promise<HiddenMissionEntry[]>
}

export const indexedDbHiddenMissionsRepository: HiddenMissionsRepository = {
  async hide(profileId, missionId, now = new Date()) {
    const db = await getDb()
    const entry = createHiddenMissionEntry(generateId(), profileId, missionId, now)
    await db.put(HIDDEN_MISSIONS_STORE, entry)
  },

  async getAll(profileId) {
    const db = await getDb()
    return db.getAllFromIndex(HIDDEN_MISSIONS_STORE, 'by-profile', profileId)
  },

  async getHistory(profileId, now = new Date()) {
    const db = await getDb()
    const entries = await db.getAllFromIndex(HIDDEN_MISSIONS_STORE, 'by-profile', profileId)
    return entries
      .filter((entry) => isInHistory(entry, now))
      .sort((a, b) => b.hiddenAt.localeCompare(a.hiddenAt))
  },
}
