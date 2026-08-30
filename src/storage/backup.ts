import type {
  DiaryEntry,
  HiddenMissionEntry,
  LabCabinetItem,
  Profile,
  SecretVaultEntry,
  ShoppingListItem,
} from '../domain'
import { indexedDbDiaryRepository } from './diaryRepository'
import { indexedDbHiddenMissionsRepository } from './hiddenMissionsRepository'
import { indexedDbProfileRepository } from './profileRepository'
import { indexedDbSecretVaultRepository } from './secretVaultRepository'
import { indexedDbLabCabinetRepository } from './labCabinetRepository'
import { indexedDbShoppingListRepository } from './shoppingListRepository'

const BACKUP_FORMAT = 'crazylab-backup'
const BACKUP_VERSION = 1

export interface BackupData {
  format: typeof BACKUP_FORMAT
  version: typeof BACKUP_VERSION
  exportedAt: string
  profile: Profile | null
  diaryEntries: DiaryEntry[]
  secretVaultEntries: SecretVaultEntry[]
  hiddenMissions: HiddenMissionEntry[]
  labCabinetItems?: LabCabinetItem[]
  shoppingListItems?: ShoppingListItem[]
}

/** Liest alle lokalen Daten eines Profils zusammen, um sie als Datei sichern zu können. */
export async function createBackup(profileId: string): Promise<BackupData> {
  const [
    profile,
    diaryEntries,
    secretVaultEntries,
    hiddenMissions,
    labCabinetItems,
    shoppingListItems,
  ] = await Promise.all([
    indexedDbProfileRepository.get(profileId),
    indexedDbDiaryRepository.getAllEntries(profileId),
    indexedDbSecretVaultRepository.getAll(profileId),
    indexedDbHiddenMissionsRepository.getHistory(profileId),
    indexedDbLabCabinetRepository.getAll(profileId),
    indexedDbShoppingListRepository.getAll(profileId),
  ])

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    profile: profile ?? null,
    diaryEntries,
    secretVaultEntries,
    hiddenMissions,
    labCabinetItems,
    shoppingListItems,
  }
}

export function isBackupData(value: unknown): value is BackupData {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<BackupData>
  return (
    candidate.format === BACKUP_FORMAT &&
    candidate.version === BACKUP_VERSION &&
    Array.isArray(candidate.diaryEntries) &&
    Array.isArray(candidate.secretVaultEntries) &&
    Array.isArray(candidate.hiddenMissions)
  )
}

/**
 * Schreibt eine zuvor exportierte Datensicherung zurück. Tagebuch und Profil werden mit ihren
 * ursprünglichen IDs/Zeitstempeln wiederhergestellt (reines Überschreiben). Geheimfach und
 * Verlauf laufen über die bestehenden Repository-Methoden, die dafür neue IDs vergeben - das
 * eigentliche Verstecken-Datum wird beim Verlauf aber aus dem Backup übernommen, damit "3 Tage
 * verstecken" bzw. der 14-Tage-Verlauf korrekt weiterlaufen.
 */
export async function restoreBackup(data: BackupData): Promise<void> {
  if (data.profile) {
    await indexedDbProfileRepository.save(data.profile)
  }

  for (const entry of data.diaryEntries) {
    await indexedDbDiaryRepository.saveEntry(entry)
  }

  for (const entry of data.secretVaultEntries) {
    await indexedDbSecretVaultRepository.save(entry.profileId, entry.missionId)
  }

  for (const entry of data.hiddenMissions) {
    await indexedDbHiddenMissionsRepository.hide(
      entry.profileId,
      entry.missionId,
      new Date(entry.hiddenAt),
    )
  }

  for (const item of data.labCabinetItems ?? []) {
    await indexedDbLabCabinetRepository.save(item)
  }

  for (const item of data.shoppingListItems ?? []) {
    await indexedDbShoppingListRepository.save(item)
  }
}

export function backupFileName(): string {
  const date = new Date().toISOString().slice(0, 10)
  return `crazylab-backup-${date}.json`
}
