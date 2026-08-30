import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type {
  DiaryEntry,
  HiddenMissionEntry,
  LabCabinetItem,
  Profile,
  SecretVaultEntry,
  ShoppingListItem,
} from '../domain'

const DB_NAME = 'crazylab'
const DB_VERSION = 5

export const DIARY_STORE = 'diaryEntries'
export const SECRET_VAULT_STORE = 'secretVaultEntries'
export const HIDDEN_MISSIONS_STORE = 'hiddenMissions'
export const PROFILES_STORE = 'profiles'
export const LAB_CABINET_STORE = 'labCabinetItems'
export const SHOPPING_LIST_STORE = 'shoppingListItems'

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

/** Nur für Tests: erzwingt eine frische Verbindung nach dem Zurücksetzen der Fake-IndexedDB. */
export function resetDbConnection(): void {
  dbPromise = undefined
}
