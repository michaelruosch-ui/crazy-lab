import type { SecretVaultEntry } from '../domain'
import { generateId } from '../domain'
import { SECRET_VAULT_STORE, getDb } from './db'

export interface SecretVaultRepository {
  isSaved(profileId: string, missionId: string): Promise<boolean>
  save(profileId: string, missionId: string): Promise<void>
  remove(profileId: string, missionId: string): Promise<void>
  getAll(profileId: string): Promise<SecretVaultEntry[]>
}

async function findEntry(
  profileId: string,
  missionId: string,
): Promise<SecretVaultEntry | undefined> {
  const db = await getDb()
  const entries = await db.getAllFromIndex(SECRET_VAULT_STORE, 'by-profile', profileId)
  return entries.find((entry) => entry.missionId === missionId)
}

export const indexedDbSecretVaultRepository: SecretVaultRepository = {
  async isSaved(profileId, missionId) {
    return Boolean(await findEntry(profileId, missionId))
  },

  async save(profileId, missionId) {
    const existing = await findEntry(profileId, missionId)
    if (existing) return
    const db = await getDb()
    const entry: SecretVaultEntry = {
      id: generateId(),
      profileId,
      missionId,
      savedAt: new Date().toISOString(),
    }
    await db.put(SECRET_VAULT_STORE, entry)
  },

  async remove(profileId, missionId) {
    const existing = await findEntry(profileId, missionId)
    if (!existing) return
    const db = await getDb()
    await db.delete(SECRET_VAULT_STORE, existing.id)
  },

  async getAll(profileId) {
    const db = await getDb()
    const entries = await db.getAllFromIndex(SECRET_VAULT_STORE, 'by-profile', profileId)
    return entries.sort((a, b) => b.savedAt.localeCompare(a.savedAt))
  },
}
