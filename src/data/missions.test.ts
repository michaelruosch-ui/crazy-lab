import { describe, expect, it } from 'vitest'
import { missions } from './missions'
import { FORBIDDEN_DRINK_TERMS, validateMissions } from '../domain'

describe('Missionsdaten', () => {
  it('enthält genau fünf Missionen', () => {
    expect(missions).toHaveLength(5)
  })

  it('alle Missionen sind valide', () => {
    const errors = validateMissions(missions)
    expect(errors).toEqual([])
  })

  it('deckt alle fünf Kategorien ab', () => {
    const categories = new Set(missions.map((m) => m.primaryCategory))
    expect(categories).toEqual(new Set(['getraenk', 'basteln', 'experiment', 'foto', 'schwestern']))
  })

  it('enthält keine verbotenen Begriffe in Getränke-Missionen', () => {
    const drinkMissions = missions.filter(
      (m) => m.primaryCategory === 'getraenk' || m.secondaryCategories.includes('getraenk'),
    )
    expect(drinkMissions.length).toBeGreaterThan(0)

    for (const mission of drinkMissions) {
      const haystack = JSON.stringify(mission).toLowerCase()
      for (const term of FORBIDDEN_DRINK_TERMS) {
        expect(haystack).not.toContain(term)
      }
    }
  })
})
