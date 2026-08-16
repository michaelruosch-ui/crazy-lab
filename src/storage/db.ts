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

export function getDb(): Promise<IDBPDatabase<CrazyLabDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CrazyLabDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(DIARY_STORE, { keyPath: 'id' })
        store.createIndex('by-profile', 'profileId')
        store.createIndex('by-completedAt', 'completedAt')
      },
    })
  }
  return dbPromise
}

/** Nur für Tests: erzwingt eine frische Verbindung nach dem Zurücksetzen der Fake-IndexedDB. */
export function resetDbConnection(): void {
  dbPromise = undefined
}
