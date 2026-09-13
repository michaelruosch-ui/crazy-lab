export const VISITOR_PREVIEW_SLUG = 'besuch-20260913-v7m4'
export const VISITOR_PREVIEW_EXPIRES_AT = '2026-09-20T14:02:07+02:00'

const VISITOR_STORAGE_PREFIX = 'crazylab-visitor-20260913-v7m4'

export type VisitorAccessState = 'active' | 'expired'

export function isVisitorPreview(pathname = window.location.pathname): boolean {
  return pathname.split('/').includes(VISITOR_PREVIEW_SLUG)
}

export function scopedStorageKey(key: string, pathname = window.location.pathname): string {
  return isVisitorPreview(pathname) ? `${VISITOR_STORAGE_PREFIX}:${key}` : key
}

export function visitorDatabaseName(pathname = window.location.pathname): string {
  return isVisitorPreview(pathname) ? VISITOR_STORAGE_PREFIX : 'crazylab'
}

export function visitorAccessState(now: Date): VisitorAccessState {
  return now.getTime() < new Date(VISITOR_PREVIEW_EXPIRES_AT).getTime() ? 'active' : 'expired'
}

export async function loadVisitorAccessState(
  fetcher: typeof window.fetch = window.fetch.bind(window),
): Promise<VisitorAccessState> {
  const checkUrl = new URL(
    `${import.meta.env.BASE_URL}${VISITOR_PREVIEW_SLUG}/time.json?check=${Date.now()}`,
    window.location.origin,
  )
  const response = await fetcher(checkUrl, { cache: 'no-store' })
  if (!response.ok) throw new Error('Die Besuchszeit konnte nicht geprüft werden.')

  const serverDate = response.headers.get('date')
  if (!serverDate) throw new Error('Der Zeitstempel der Besuchsversion fehlt.')
  const now = new Date(serverDate)
  if (Number.isNaN(now.getTime()))
    throw new Error('Der Zeitstempel der Besuchsversion ist ungültig.')
  return visitorAccessState(now)
}
