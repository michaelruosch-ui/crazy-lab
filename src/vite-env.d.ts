/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Basis-URL des Cloud-Sync-Workers (siehe .env.local.example). Optional. */
  readonly VITE_CLOUD_SYNC_URL?: string
  /** Unerratbarer Schlüssel, unter dem das Familien-Backup in der Cloud liegt. Optional. */
  readonly VITE_CLOUD_SYNC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
