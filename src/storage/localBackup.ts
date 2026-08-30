import { createBackup, isBackupData, type BackupData } from './backup'

const DEFAULT_LOCAL_BACKUP_URL = 'https://192.168.1.106:4175/backup'

function getBackupUrl(): string {
  return import.meta.env.VITE_LOCAL_BACKUP_URL ?? DEFAULT_LOCAL_BACKUP_URL
}

function getBackupToken(): string | undefined {
  return import.meta.env.VITE_LOCAL_BACKUP_TOKEN
}

/**
 * Speichert eine zusätzliche Kopie auf Michaels Mac, sofern der lokale Sicherungsdienst gerade
 * erreichbar ist. IndexedDB auf dem iPhone bleibt immer die primäre Datenquelle.
 */
export async function uploadBackupToMac(
  profileId: string,
  backupUrl = getBackupUrl(),
  token = getBackupToken(),
): Promise<void> {
  if (!token) return
  try {
    const backup = await createBackup(profileId)
    await fetch(backupUrl, {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(backup),
    })
  } catch {
    // Der Mac darf ausgeschaltet sein; lokales Speichern auf dem iPhone funktioniert weiter.
  }
}

export function scheduleLocalBackup(profileId: string): void {
  void uploadBackupToMac(profileId)
}

export async function downloadBackupFromMac(
  backupUrl = getBackupUrl(),
  token = getBackupToken(),
): Promise<BackupData | null> {
  if (!token) return null
  try {
    const response = await fetch(backupUrl, { headers: { authorization: `Bearer ${token}` } })
    if (!response.ok) return null
    const data: unknown = await response.json()
    return isBackupData(data) ? data : null
  } catch {
    return null
  }
}
