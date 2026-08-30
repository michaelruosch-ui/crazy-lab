import type { LabCabinetItem } from '../domain'
import { getDb, LAB_CABINET_STORE } from './db'

export interface LabCabinetRepository {
  getAll(profileId: string): Promise<LabCabinetItem[]>
  save(item: LabCabinetItem): Promise<void>
  remove(id: string): Promise<void>
}

export const indexedDbLabCabinetRepository: LabCabinetRepository = {
  async getAll(profileId) {
    const db = await getDb()
    const items = await db.getAllFromIndex(LAB_CABINET_STORE, 'by-profile', profileId)
    return items.sort((a, b) => a.materialName.localeCompare(b.materialName, 'de'))
  },

  async save(item) {
    const db = await getDb()
    await db.put(LAB_CABINET_STORE, item)
  },

  async remove(id) {
    const db = await getDb()
    await db.delete(LAB_CABINET_STORE, id)
  },
}
