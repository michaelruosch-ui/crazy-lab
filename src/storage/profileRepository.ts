import type { Profile } from '../domain'
import { PROFILES_STORE, getDb } from './db'

export interface ProfileRepository {
  get(id: string): Promise<Profile | undefined>
  getAll(): Promise<Profile[]>
  save(profile: Profile): Promise<void>
}

export const indexedDbProfileRepository: ProfileRepository = {
  async get(id) {
    const db = await getDb()
    return db.get(PROFILES_STORE, id)
  },

  async getAll() {
    const db = await getDb()
    return db.getAll(PROFILES_STORE)
  },

  async save(profile) {
    const db = await getDb()
    await db.put(PROFILES_STORE, profile)
  },
}
