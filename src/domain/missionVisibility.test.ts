import { describe, expect, it } from 'vitest'
import { createHiddenMissionEntry, isCurrentlyHidden, isInHistory } from './missionVisibility'

describe('missionVisibility', () => {
  const hiddenAt = new Date('2026-08-23T12:00:00.000Z')
  const entry = createHiddenMissionEntry('id-1', 'elena', 'mission-1', hiddenAt)

  it('ist direkt nach dem Verstecken aktuell versteckt und im Verlauf', () => {
    const now = new Date('2026-08-23T12:00:01.000Z')
    expect(isCurrentlyHidden(entry, now)).toBe(true)
    expect(isInHistory(entry, now)).toBe(true)
  })

  it('ist nach 3 Tagen nicht mehr versteckt, aber noch im Verlauf', () => {
    const now = new Date('2026-08-27T00:00:00.000Z')
    expect(isCurrentlyHidden(entry, now)).toBe(false)
    expect(isInHistory(entry, now)).toBe(true)
  })

  it('ist nach 14 Tagen weder versteckt noch im Verlauf', () => {
    const now = new Date('2026-09-08T00:00:00.000Z')
    expect(isCurrentlyHidden(entry, now)).toBe(false)
    expect(isInHistory(entry, now)).toBe(false)
  })
})
