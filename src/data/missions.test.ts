import { describe, expect, it } from 'vitest'
import { missions } from './missions'
import { FORBIDDEN_DRINK_TERMS, validateMissions } from '../domain'

describe('Missionsdaten', () => {
  it('enthält genau 15 Missionen in jeder der fünf Kategorien', () => {
    expect(missions).toHaveLength(75)
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

  it('enthält genau 15 primäre Getränke-Missionen mit Merkmalen und Varianten', () => {
    const drinkMissions = missions.filter((m) => m.primaryCategory === 'getraenk')
    expect(drinkMissions).toHaveLength(15)

    for (const mission of drinkMissions) {
      expect(mission.drinkProfile).toBeDefined()
      expect(mission.drinkProfile?.tastes.length).toBeGreaterThan(0)
      expect(mission.drinkProfile?.appearance.length).toBeGreaterThan(0)
      expect(mission.drinkProfile?.variants).toHaveLength(2)
    }
  })

  it('deckt verschiedene Getränke-Arten und Sicherheitsstufen ab', () => {
    const drinkMissions = missions.filter((m) => m.primaryCategory === 'getraenk')
    const tastes = new Set(drinkMissions.flatMap((m) => m.drinkProfile?.tastes ?? []))
    const safetyLevels = new Set(drinkMissions.map((m) => m.safetyLevel))

    expect(tastes).toEqual(new Set(['suess', 'sauer', 'fruchtig', 'cremig', 'prickelnd']))
    expect(safetyLevels).toEqual(new Set(['gruen', 'gelb', 'rot']))
  })

  it('enthält genau 15 sichere und vollständige Bastelmissionen', () => {
    const craftMissions = missions.filter((mission) => mission.primaryCategory === 'basteln')
    expect(craftMissions).toHaveLength(15)
    expect(craftMissions.some((mission) => mission.title.includes('Playmobil'))).toBe(true)
    expect(craftMissions.some((mission) => mission.safetyLevel === 'gelb')).toBe(true)
    expect(craftMissions.every((mission) => mission.steps.length >= 4)).toBe(true)
  })

  it('enthält je 15 strukturierte Experimente, Foto-Challenges und Schwestern-Missionen', () => {
    const experiments = missions.filter((mission) => mission.primaryCategory === 'experiment')
    const photos = missions.filter((mission) => mission.primaryCategory === 'foto')
    const sisters = missions.filter((mission) => mission.primaryCategory === 'schwestern')
    expect(experiments).toHaveLength(15)
    expect(photos).toHaveLength(15)
    expect(sisters).toHaveLength(15)
    expect(experiments.every((mission) => mission.experimentProfile)).toBe(true)
    expect(photos.every((mission) => mission.photoProfile?.frames.length)).toBe(true)
    expect(sisters.every((mission) => mission.sisterProfile?.jointFinish)).toBe(true)
  })
})
