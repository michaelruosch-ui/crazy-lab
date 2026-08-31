import { generateId, type LocalBackupSnapshot } from '../domain'
import { createBackup, isBackupData, restoreBackup } from './backup'
import { getDb, LOCAL_BACKUPS_STORE } from './db'

const MAX_LOCAL_SNAPSHOTS = 10

function fingerprint(dataJson: string): string {
  let hash = 0
  for (let index = 0; index < dataJson.length; index += 1) {
    hash = (hash * 31 + dataJson.charCodeAt(index)) >>> 0
  }
  return `${dataJson.length}-${hash}`
}

export async function getLocalSnapshots(profileId: string): Promise<LocalBackupSnapshot[]> {
  const db = await getDb()
  const snapshots = await db.getAllFromIndex(LOCAL_BACKUPS_STORE, 'by-profile', profileId)
  return snapshots.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function saveLocalSnapshot(profileId: string): Promise<LocalBackupSnapshot> {
  const backup = await createBackup(profileId)
  const stableDataJson = JSON.stringify({ ...backup, exportedAt: '' })
  const nextFingerprint = fingerprint(stableDataJson)
  const existing = await getLocalSnapshots(profileId)
  if (existing[0]?.fingerprint === nextFingerprint) return existing[0]

  const snapshot: LocalBackupSnapshot = {
    id: generateId(),
    profileId,
    createdAt: backup.exportedAt,
    dataJson: JSON.stringify(backup),
    fingerprint: nextFingerprint,
  }
  const db = await getDb()
  await db.put(LOCAL_BACKUPS_STORE, snapshot)

  for (const oldSnapshot of existing.slice(MAX_LOCAL_SNAPSHOTS - 1)) {
    await db.delete(LOCAL_BACKUPS_STORE, oldSnapshot.id)
  }
  return snapshot
}

export async function restoreLocalSnapshot(snapshot: LocalBackupSnapshot): Promise<void> {
  const parsed: unknown = JSON.parse(snapshot.dataJson)
  if (!isBackupData(parsed)) throw new Error('Ungültiger Sicherungsstand')
  await restoreBackup(parsed)
}
