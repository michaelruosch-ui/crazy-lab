import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { DiaryEntry } from '../domain'

const DB_NAME = 'crazylab'
const DB_VERSION = 1

export const DIARY_STORE = 'diaryEntries'

interface CrazyLabDB extends DBSchema {
  [DIARY_STORE]: {
    key: string
    value: DiaryEntry
    indexes: { 'by-profile': string; 'by-completedAt': string }
  }
}

let dbPromise: Promise<IDBPDatabase<CrazyLabDB>> | undefined

const OPEN_TIMEOUT_MS = 4000
const MAX_ATTEMPTS = 3

function openOnce(): Promise<IDBPDatabase<CrazyLabDB>> {
  return openDB<CrazyLabDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(DIARY_STORE, { keyPath: 'id' })
      store.createIndex('by-profile', 'profileId')
      store.createIndex('by-completedAt', 'completedAt')
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
