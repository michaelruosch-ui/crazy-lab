import { describe, expect, it } from 'vitest'
import { missions } from '../data/missions'
import { pickDailyMission, suggestionsForCategory } from './suggestions'

describe('suggestionsForCategory', () => {
  it('liefert Missionen der primären Kategorie', () => {
    const result = suggestionsForCategory(missions, 'basteln', new Set())
    expect(result.map((m) => m.id)).toEqual(['mission-playmobil-geisterbett'])
  })

  it('berücksichtigt Missionen mit passender sekundärer Kategorie zusätzlich', () => {
    const result = suggestionsForCategory(missions, 'getraenk', new Set())
    const ids = result.map((m) => m.id)
    expect(ids).toContain('mission-blutroter-schatten-trank')
    expect(ids).toContain('mission-zwei-zaubertraenke')
  })

  it('blendet versteckte Missionen aus', () => {
    const result = suggestionsForCategory(
      missions,
      'basteln',
      new Set(['mission-playmobil-geisterbett']),
    )
    expect(result).toEqual([])
  })

  it('zeigt maximal fünf Vorschläge', () => {
    const result = suggestionsForCategory(missions, 'getraenk', new Set())
    expect(result.length).toBeLessThanOrEqual(5)
  })
})

describe('pickDailyMission', () => {
  it('wählt dieselbe Mission für denselben Tag und dasselbe Profil', () => {
    const today = new Date('2026-08-23T10:00:00.000Z')
    const a = pickDailyMission(missions, new Set(), 'elena', today)
    const b = pickDailyMission(missions, new Set(), 'elena', new Date('2026-08-23T22:00:00.000Z'))
    expect(a?.id).toBe(b?.id)
  })

  it('ignoriert aktuell versteckte Missionen', () => {
    const today = new Date('2026-08-23T10:00:00.000Z')
    const allIds = new Set(missions.map((m) => m.id))
    const chosen = pickDailyMission(missions, new Set([...allIds].slice(0, -1)), 'elena', today)
    expect(chosen?.id).toBe([...allIds].at(-1))
  })

  it('gibt undefined zurück, wenn alle Missionen versteckt sind', () => {
    const today = new Date('2026-08-23T10:00:00.000Z')
    const allIds = new Set(missions.map((m) => m.id))
    expect(pickDailyMission(missions, allIds, 'elena', today)).toBeUndefined()
  })
})
