import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type {
  DiaryEntry,
  ExperimentProgress,
  HiddenMissionEntry,
  LabCabinetItem,
  LocalBackupSnapshot,
  Profile,
  SecretVaultEntry,
  ShoppingListItem,
  CustomMission,
} from '../domain'

const DB_NAME = 'crazylab'
const DB_VERSION = 8

export const DIARY_STORE = 'diaryEntries'
export const SECRET_VAULT_STORE = 'secretVaultEntries'
export const HIDDEN_MISSIONS_STORE = 'hiddenMissions'
export const PROFILES_STORE = 'profiles'
export const LAB_CABINET_STORE = 'labCabinetItems'
export const SHOPPING_LIST_STORE = 'shoppingListItems'
export const LOCAL_BACKUPS_STORE = 'localBackupSnapshots'
export const EXPERIMENT_PROGRESS_STORE = 'experimentProgress'
export const CUSTOM_MISSIONS_STORE = 'customMissions'

interface CrazyLabDB extends DBSchema {
  [DIARY_STORE]: {
    key: string
    value: DiaryEntry
    indexes: { 'by-profile': string; 'by-completedAt': string }
  }
  [SECRET_VAULT_STORE]: {
    key: string
    value: SecretVaultEntry
    indexes: { 'by-profile': string; 'by-mission': string }
  }
  [HIDDEN_MISSIONS_STORE]: {
    key: string
    value: HiddenMissionEntry
    indexes: { 'by-profile': string; 'by-mission': string }
  }
  [PROFILES_STORE]: {
    key: string
    value: Profile
  }
  [LAB_CABINET_STORE]: {
    key: string
    value: LabCabinetItem
    indexes: { 'by-profile': string; 'by-material': string }
  }
  [SHOPPING_LIST_STORE]: {
    key: string
    value: ShoppingListItem
    indexes: { 'by-profile': string; 'by-material': string }
  }
  [LOCAL_BACKUPS_STORE]: {
    key: string
    value: LocalBackupSnapshot
    indexes: { 'by-profile': string; 'by-createdAt': string }
  }
  [EXPERIMENT_PROGRESS_STORE]: {
    key: string
    value: ExperimentProgress
    indexes: { 'by-profile': string; 'by-mission': string }
  }
  [CUSTOM_MISSIONS_STORE]: {
    key: string
    value: CustomMission
    indexes: { 'by-profile': string; 'by-updatedAt': string }
  }
}

let dbPromise: Promise<IDBPDatabase<CrazyLabDB>> | undefined

const OPEN_TIMEOUT_MS = 4000
const MAX_ATTEMPTS = 3

function openOnce(): Promise<IDBPDatabase<CrazyLabDB>> {
  return openDB<CrazyLabDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const diaryStore = db.createObjectStore(DIARY_STORE, { keyPath: 'id' })
        diaryStore.createIndex('by-profile', 'profileId')
        diaryStore.createIndex('by-completedAt', 'completedAt')
      }
      if (oldVersion < 2) {
        const vaultStore = db.createObjectStore(SECRET_VAULT_STORE, { keyPath: 'id' })
        vaultStore.createIndex('by-profile', 'profileId')
        vaultStore.createIndex('by-mission', 'missionId')

        const hiddenStore = db.createObjectStore(HIDDEN_MISSIONS_STORE, { keyPath: 'id' })
        hiddenStore.createIndex('by-profile', 'profileId')
        hiddenStore.createIndex('by-mission', 'missionId')
      }
      if (oldVersion < 3) {
        db.createObjectStore(PROFILES_STORE, { keyPath: 'id' })
      }
      if (oldVersion < 4) {
        const cabinetStore = db.createObjectStore(LAB_CABINET_STORE, { keyPath: 'id' })
        cabinetStore.createIndex('by-profile', 'profileId')
        cabinetStore.createIndex('by-material', 'materialName')
      }
      if (oldVersion < 5) {
        const shoppingStore = db.createObjectStore(SHOPPING_LIST_STORE, { keyPath: 'id' })
        shoppingStore.createIndex('by-profile', 'profileId')
        shoppingStore.createIndex('by-material', 'materialName')
      }
      if (oldVersion < 6) {
        const backupStore = db.createObjectStore(LOCAL_BACKUPS_STORE, { keyPath: 'id' })
        backupStore.createIndex('by-profile', 'profileId')
        backupStore.createIndex('by-createdAt', 'createdAt')
      }
      if (oldVersion < 7) {
        const progressStore = db.createObjectStore(EXPERIMENT_PROGRESS_STORE, { keyPath: 'id' })
        progressStore.createIndex('by-profile', 'profileId')
        progressStore.createIndex('by-mission', 'missionId')
      }
      if (oldVersion < 8) {
        const customStore = db.createObjectStore(CUSTOM_MISSIONS_STORE, { keyPath: 'id' })
        customStore.createIndex('by-profile', 'profileId')
        customStore.createIndex('by-updatedAt', 'updatedAt')
      }
    },
  })
}

/**
 * Manche mobilen Browser (bekannter Safari-Bug bei "Zum Home-Bildschirm"-Apps) lassen den
 * allerersten IndexedDB-Öffnen-Aufruf nach der Installation hängen, ohne je aufzulösen oder
 * abzulehnen. Wir brechen deshalb nach einem Timeout ab und versuchen es erneut, statt für
 * immer auf eine nie auflösende Promise zu warten.
 */
async function openWithRetry(): Promise<IDBPDatabase<CrazyLabDB>> {
  let lastError: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await Promise.race([
        openOnce(),
        new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error('Öffnen der lokalen Datenbank hat zu lange gedauert.')),
            OPEN_TIMEOUT_MS,
          )
        }),
      ])
    } catch (error) {
      lastError = error
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error('Lokale Datenbank konnte nicht geöffnet werden.')
}

export function getDb(): Promise<IDBPDatabase<CrazyLabDB>> {
  if (!dbPromise) {
    dbPromise = openWithRetry().catch((error: unknown) => {
      // Fehlgeschlagene Verbindung nicht dauerhaft cachen, damit ein erneuter Aufruf
      // (z. B. über "Nochmals versuchen") wirklich einen neuen Versuch startet.
      dbPromise = undefined
      throw error
    })
  }
  return dbPromise
}

/** Entfernt vor einer Wiederherstellung alle profilbezogenen Nutzdaten, nicht die Sicherungen. */
export async function clearProfileData(profileId: string): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(
    [
      DIARY_STORE,
      SECRET_VAULT_STORE,
      HIDDEN_MISSIONS_STORE,
      LAB_CABINET_STORE,
      SHOPPING_LIST_STORE,
      EXPERIMENT_PROGRESS_STORE,
      CUSTOM_MISSIONS_STORE,
    ],
    'readwrite',
  )

  const diary = tx.objectStore(DIARY_STORE)
  for (const key of await diary.index('by-profile').getAllKeys(profileId)) await diary.delete(key)
  const vault = tx.objectStore(SECRET_VAULT_STORE)
  for (const key of await vault.index('by-profile').getAllKeys(profileId)) await vault.delete(key)
  const hidden = tx.objectStore(HIDDEN_MISSIONS_STORE)
  for (const key of await hidden.index('by-profile').getAllKeys(profileId)) await hidden.delete(key)
  const cabinet = tx.objectStore(LAB_CABINET_STORE)
  for (const key of await cabinet.index('by-profile').getAllKeys(profileId))
    await cabinet.delete(key)
  const shopping = tx.objectStore(SHOPPING_LIST_STORE)
  for (const key of await shopping.index('by-profile').getAllKeys(profileId))
    await shopping.delete(key)
  const progress = tx.objectStore(EXPERIMENT_PROGRESS_STORE)
  for (const key of await progress.index('by-profile').getAllKeys(profileId))
    await progress.delete(key)
  const customMissions = tx.objectStore(CUSTOM_MISSIONS_STORE)
  for (const key of await customMissions.index('by-profile').getAllKeys(profileId))
    await customMissions.delete(key)
  await tx.done
}

/** Nur für Tests: erzwingt eine frische Verbindung nach dem Zurücksetzen der Fake-IndexedDB. */
export function resetDbConnection(): void {
  dbPromise = undefined
}
