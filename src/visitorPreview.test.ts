import { describe, expect, it } from 'vitest'
import {
  isVisitorPreview,
  scopedStorageKey,
  visitorAccessState,
  visitorDatabaseName,
} from './visitorPreview'

describe('visitor preview', () => {
  it('recognizes only the separate visitor path', () => {
    expect(isVisitorPreview('/crazy-lab/besuch-20260913-v7m4/')).toBe(true)
    expect(isVisitorPreview('/crazy-lab/')).toBe(false)
  })

  it('expires at the fixed seven-day deadline', () => {
    expect(visitorAccessState(new Date('2026-09-20T12:02:06Z'))).toBe('active')
    expect(visitorAccessState(new Date('2026-09-20T12:02:07Z'))).toBe('expired')
  })

  it('keeps normal storage names and isolates visitor storage', () => {
    const key = 'crazylab-active-profile'
    const visitorPath = '/crazy-lab/besuch-20260913-v7m4/'
    expect(scopedStorageKey(key, '/crazy-lab/')).toBe(key)
    expect(scopedStorageKey(key, visitorPath)).toBe(
      'crazylab-visitor-20260913-v7m4:crazylab-active-profile',
    )
    expect(visitorDatabaseName('/crazy-lab/')).toBe('crazylab')
    expect(visitorDatabaseName(visitorPath)).toBe('crazylab-visitor-20260913-v7m4')
  })
})
