import { describe, expect, it } from 'vitest'
import type { Mission } from './mission'
import { validateMission } from './missionValidation'

function baseMission(overrides: Partial<Mission> = {}): Mission {
  return {
    id: 'test-mission',
    contentVersion: 1,
    title: 'Testmission',
    shortDescription: 'Kurzbeschreibung',
    primaryCategory: 'getraenk',
    secondaryCategories: [],
    durationMinutes: 10,
    difficulty: 'leicht',
    estimatedCostChf: 1,
    materials: [],
    safetyLevel: 'gruen',
    safetyNotes: [],
    location: 'kueche',
    traits: { gruselig: 1, farbig: 1, suess: 1, kreativ: 1, unordentlich: 1, aufwand: 1 },
    steps: [{ id: 'step-1', order: 1, text: 'Tu etwas.' }],
    generalHelpTip: 'Hilfe-Tipp',
    completionQuestion: 'Wie war es?',
    imagePlaceholder: 'potion-red',
    ...overrides,
  }
}

describe('validateMission', () => {
  it('akzeptiert eine korrekte Mission', () => {
    expect(validateMission(baseMission())).toEqual([])
  })

  it('lehnt verbotene Begriffe bei Getränke-Missionen ab', () => {
    const errors = validateMission(
      baseMission({ shortDescription: 'Dieser Trank schmeckt bitter und scharf.' }),
    )
    expect(errors.length).toBeGreaterThan(0)
  })

  it('verlangt mindestens einen Schritt', () => {
    const errors = validateMission(baseMission({ steps: [] }))
    expect(errors.some((e) => e.message.includes('Schritt'))).toBe(true)
  })

  it('verlangt Sicherheitshinweise bei gelber/roter Stufe', () => {
    const errors = validateMission(baseMission({ safetyLevel: 'rot', safetyNotes: [] }))
    expect(errors.some((e) => e.message.includes('safetyNotes'))).toBe(true)
  })
})
