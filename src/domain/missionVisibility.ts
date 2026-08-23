const HIDE_DAYS = 3
const HISTORY_DAYS = 14
const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Eine "3 Tage verstecken"-Aktion. Die Mission verschwindet für `HIDE_DAYS` Tage aus den
 * aktiven Vorschlägen und bleibt danach noch bis `historyUntil` (insgesamt `HISTORY_DAYS` Tage
 * ab dem Verstecken) im Verlauf auffindbar.
 */
export interface HiddenMissionEntry {
  id: string
  profileId: string
  missionId: string
  hiddenAt: string
  hideUntil: string
  historyUntil: string
}

export function createHiddenMissionEntry(
  id: string,
  profileId: string,
  missionId: string,
  now: Date,
): HiddenMissionEntry {
  const hiddenAt = now.toISOString()
  return {
    id,
    profileId,
    missionId,
    hiddenAt,
    hideUntil: new Date(now.getTime() + HIDE_DAYS * DAY_MS).toISOString(),
    historyUntil: new Date(now.getTime() + HISTORY_DAYS * DAY_MS).toISOString(),
  }
}

export function isCurrentlyHidden(entry: HiddenMissionEntry, now: Date): boolean {
  return new Date(entry.hideUntil).getTime() > now.getTime()
}

export function isInHistory(entry: HiddenMissionEntry, now: Date): boolean {
  return new Date(entry.historyUntil).getTime() > now.getTime()
}
