import type { Mission } from './mission'

/** Von Michael und Elena am 2026-09-07 verbindlich für den App-Store-Einstieg gewählt. */
export const FREE_CATALOG_MISSION_IDS = new Set([
  'mission-geisterportal',
  'mission-blutroter-schatten-trank',
  'mission-neu-experiment-regen-glas',
  'mission-neu-foto-monster-frühstück',
  'mission-neu-schwestern-zimmer-schatzsuche',
])

export const FREE_PRODUCT_OWNER_MISSION_TITLE = 'Der Blutkleim'

function normalizeTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('de-CH')
}

/**
 * Der Blutkleim wurde von Elena auf ihrem Gerät erfunden und besitzt deshalb eine lokale,
 * zufällige ID. Bis er redaktionell in den Katalog übernommen wird, identifizieren wir ihn über
 * seinen verbindlich festgelegten Titel. Alle übrigen Gratismissionen besitzen stabile Katalog-IDs.
 */
export function isMissionFree(mission: Pick<Mission, 'id' | 'title'>): boolean {
  return (
    FREE_CATALOG_MISSION_IDS.has(mission.id) ||
    normalizeTitle(mission.title) === normalizeTitle(FREE_PRODUCT_OWNER_MISSION_TITLE)
  )
}
