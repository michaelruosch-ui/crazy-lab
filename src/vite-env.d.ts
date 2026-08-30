/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Lokaler Sicherungsdienst auf Michaels Mac; optional mit anderem Heimnetz-Endpunkt. */
  readonly VITE_LOCAL_BACKUP_URL?: string
  /** Gemeinsamer Zugriffsschlüssel für App und lokalen Mac-Sicherungsdienst. */
  readonly VITE_LOCAL_BACKUP_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
