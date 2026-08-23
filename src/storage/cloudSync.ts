import { createBackup, isBackupData, type BackupData } from './backup'

export interface CloudSyncConfig {
  url: string
  key: string
}

/**
 * Cloud-Endpunkt und Sync-Schlüssel kommen aus Build-Zeit-Umgebungsvariablen (siehe
 * .env.local.example) statt fest im Code zu stehen, weil die Worker-URL erst nach dem Deployment
 * bekannt ist. Fehlen sie (z. B. frischer Checkout ohne Cloud-Setup), ist Cloud-Sync einfach
 * deaktiviert - die App funktioniert dann wie zuvor rein lokal.
 */
function getConfig(): CloudSyncConfig | null {
  const url = import.meta.env.VITE_CLOUD_SYNC_URL
  const key = import.meta.env.VITE_CLOUD_SYNC_KEY
  if (!url || !key) return null
  return { url: url.replace(/\/$/, ''), key }
}

/**
 * Lädt den aktuellen Stand hoch. Bewusst "fire and forget": ein fehlgeschlagener Upload (kein
 * Internet, Worker nicht erreichbar) darf die App nie stören oder blockieren - das lokale
 * IndexedDB bleibt die alleinige Quelle der Wahrheit für das Gerät, die Cloud ist nur das
 * Sicherheitsnetz für Neuinstallationen (siehe DECISIONS.md ADR-019).
 */
export async function uploadBackupToCloud(
  profileId: string,
  config: CloudSyncConfig | null = getConfig(),
): Promise<void> {
  if (!config) return
  try {
    const backup = await createBackup(profileId)
    await fetch(`${config.url}/${config.key}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(backup),
    })
  } catch {
    // Absichtlich verschluckt - siehe Kommentar oben.
  }
}

/** Praktischer Name für Aufrufstellen, die nicht auf das Ergebnis warten wollen. */
export function scheduleCloudBackup(profileId: string): void {
  void uploadBackupToCloud(profileId)
}

export async function downloadBackupFromCloud(
  config: CloudSyncConfig | null = getConfig(),
): Promise<BackupData | null> {
  if (!config) return null
  try {
    const response = await fetch(`${config.url}/${config.key}`)
    if (!response.ok) return null
    const data: unknown = await response.json()
    return isBackupData(data) ? data : null
  } catch {
    return null
  }
}
