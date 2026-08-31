export interface LocalBackupSnapshot {
  id: string
  profileId: string
  createdAt: string
  /** JSON bleibt intern und wird nie als technische Datei angezeigt. */
  dataJson: string
  fingerprint: string
}
