export const VISITOR_PREVIEW_SLUG = 'freunde-20260925-oct31-k9p7'
export const VISITOR_PREVIEW_EXPIRES_AT = '2026-11-01T00:00:00+01:00'

interface VisitorPreviewConfig {
  slug: string
  expiresAt: string
  storagePrefix: string
}

const VISITOR_PREVIEWS: VisitorPreviewConfig[] = [
  {
    slug: VISITOR_PREVIEW_SLUG,
    expiresAt: VISITOR_PREVIEW_EXPIRES_AT,
    storagePrefix: 'crazylab-friends-20260925-oct31-k9p7',
  },
  {
    slug: 'besuch-20260913-v7m4',
    expiresAt: '2026-09-20T14:02:07+02:00',
    storagePrefix: 'crazylab-visitor-20260913-v7m4',
  },
]

export type VisitorAccessState = 'active' | 'expired'

export function visitorPreviewConfig(
  pathname = window.location.pathname,
): VisitorPreviewConfig | undefined {
  const pathSegments = pathname.split('/')
  return VISITOR_PREVIEWS.find(({ slug }) => pathSegments.includes(slug))
}

export function isVisitorPreview(pathname = window.location.pathname): boolean {
  return visitorPreviewConfig(pathname) !== undefined
}

export function scopedStorageKey(key: string, pathname = window.location.pathname): string {
  const preview = visitorPreviewConfig(pathname)
  return preview ? `${preview.storagePrefix}:${key}` : key
}

export function visitorDatabaseName(pathname = window.location.pathname): string {
  return visitorPreviewConfig(pathname)?.storagePrefix ?? 'crazylab'
}

export function visitorAccessState(
  now: Date,
  expiresAt = VISITOR_PREVIEW_EXPIRES_AT,
): VisitorAccessState {
  return now.getTime() < new Date(expiresAt).getTime() ? 'active' : 'expired'
}

export async function loadVisitorAccessState(
  fetcher: typeof window.fetch = window.fetch.bind(window),
  pathname = window.location.pathname,
): Promise<VisitorAccessState> {
  const preview = visitorPreviewConfig(pathname)
  if (!preview) throw new Error('Für diese Adresse gibt es keinen Besuchspass.')
  const checkUrl = new URL(
    `${import.meta.env.BASE_URL}${preview.slug}/time.json?check=${Date.now()}`,
    window.location.origin,
  )
  const response = await fetcher(checkUrl, { cache: 'no-store' })
  if (!response.ok) throw new Error('Die Besuchszeit konnte nicht geprüft werden.')

  const serverDate = response.headers.get('date')
  if (!serverDate) throw new Error('Der Zeitstempel der Besuchsversion fehlt.')
  const now = new Date(serverDate)
  if (Number.isNaN(now.getTime()))
    throw new Error('Der Zeitstempel der Besuchsversion ist ungültig.')
  return visitorAccessState(now, preview.expiresAt)
}
