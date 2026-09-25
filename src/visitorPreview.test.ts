import { describe, expect, it, vi } from 'vitest'
import {
  isVisitorPreview,
  loadVisitorAccessState,
  scopedStorageKey,
  visitorAccessState,
  visitorDatabaseName,
} from './visitorPreview'

describe('visitor preview', () => {
  it('recognizes only the separate visitor path', () => {
    expect(isVisitorPreview('/crazy-lab/freunde-20260925-oct31-k9p7/')).toBe(true)
    expect(isVisitorPreview('/crazy-lab/besuch-20260913-v7m4/')).toBe(true)
    expect(isVisitorPreview('/crazy-lab/')).toBe(false)
  })

  it('expires the new friends version exactly at the end of October in Zurich', () => {
    expect(visitorAccessState(new Date('2026-10-31T22:59:59Z'))).toBe('active')
    expect(visitorAccessState(new Date('2026-10-31T23:00:00Z'))).toBe('expired')
  })

  it('keeps the old visitor deadline unchanged', () => {
    const oldExpiry = '2026-09-20T14:02:07+02:00'
    expect(visitorAccessState(new Date('2026-09-20T12:02:06Z'), oldExpiry)).toBe('active')
    expect(visitorAccessState(new Date('2026-09-20T12:02:07Z'), oldExpiry)).toBe('expired')
  })

  it('keeps normal storage names and isolates visitor storage', () => {
    const key = 'crazylab-active-profile'
    const visitorPath = '/crazy-lab/freunde-20260925-oct31-k9p7/'
    expect(scopedStorageKey(key, '/crazy-lab/')).toBe(key)
    expect(scopedStorageKey(key, visitorPath)).toBe(
      'crazylab-friends-20260925-oct31-k9p7:crazylab-active-profile',
    )
    expect(visitorDatabaseName('/crazy-lab/')).toBe('crazylab')
    expect(visitorDatabaseName(visitorPath)).toBe('crazylab-friends-20260925-oct31-k9p7')
    expect(visitorDatabaseName('/crazy-lab/besuch-20260913-v7m4/')).toBe(
      'crazylab-visitor-20260913-v7m4',
    )
  })

  it('checks the new pass with an online server timestamp instead of the device clock', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('{}', {
        status: 200,
        headers: { date: 'Sat, 31 Oct 2026 22:59:59 GMT' },
      }),
    )

    await expect(
      loadVisitorAccessState(fetcher, '/crazy-lab/freunde-20260925-oct31-k9p7/'),
    ).resolves.toBe('active')
    expect(fetcher).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/freunde-20260925-oct31-k9p7/time.json',
      }),
      { cache: 'no-store' },
    )
  })
})
