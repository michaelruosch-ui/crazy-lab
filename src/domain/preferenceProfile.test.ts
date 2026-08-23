import { describe, expect, it } from 'vitest'
import type { DiaryEntry, Mission } from '.'
import { buildPreferenceProfile, scoreMissionForProfile } from './preferenceProfile'

function makeEntry(adjustments: DiaryEntry['rating']['adjustments']): DiaryEntry {
  return {
    id: `entry-${Math.random()}`,
    profileId: 'elena',
    missionSnapshot: {
      missionId: 'mission-x',
      contentVersion: 1,
      title: 'Testmission',
      primaryCategory: 'getraenk',
      imagePlaceholder: 'potion-red',
    },
    status: 'erfolgreich',
    rating: {
      result: 5,
      difficultyFeedback: 'genau_richtig',
      wouldRepeat: true,
      wouldRecommend: true,
      adjustments,
      stamp: 'geheimnisvoll',
    },
    completedAt: '2026-08-23T10:00:00.000Z',
  }
}

function makeMission(traits: Partial<Mission['traits']>): Mission {
  return {
    id: 'mission-test',
    contentVersion: 1,
    title: 'Testmission',
    shortDescription: '...',
    primaryCategory: 'getraenk',
    secondaryCategories: [],
    durationMinutes: 10,
    difficulty: 'leicht',
    estimatedCostChf: 1,
    materials: [],
    safetyLevel: 'gruen',
    safetyNotes: [],
    location: 'kueche',
    traits: { gruselig: 0, farbig: 0, suess: 0, kreativ: 0, unordentlich: 0, aufwand: 0, ...traits },
    steps: [{ id: 'step-1', order: 1, text: 'Tu etwas.' }],
    generalHelpTip: 'Hilfe',
    completionQuestion: 'Wie war es?',
    imagePlaceholder: 'potion-red',
  }
}

describe('buildPreferenceProfile', () => {
  it('hat keine Signale ohne Bewertungen', () => {
    const profile = buildPreferenceProfile('elena', [])
    expect(profile.ratedMissionCount).toBe(0)
    expect(profile.traitAffinity).toEqual({
      gruselig: 0,
      farbig: 0,
      suess: 0,
      kreativ: 0,
      unordentlich: 0,
      aufwand: 0,
    })
  })

  it('erhöht die gruselig-Affinität bei "gruseliger"-Wünschen', () => {
    const profile = buildPreferenceProfile('elena', [
      makeEntry(['gruseliger']),
      makeEntry(['gruseliger']),
    ])
    expect(profile.traitAffinity.gruselig).toBe(2)
    expect(profile.ratedMissionCount).toBe(2)
  })

  it('verrechnet gegensätzliche Wünsche', () => {
    const profile = buildPreferenceProfile('elena', [
      makeEntry(['gruseliger']),
      makeEntry(['weniger_gruselig']),
    ])
    expect(profile.traitAffinity.gruselig).toBe(0)
  })

  it('verarbeitet mehrere Anpassungswünsche in einer Bewertung', () => {
    const profile = buildPreferenceProfile('elena', [makeEntry(['farbiger', 'einfacher'])])
    expect(profile.traitAffinity.farbig).toBe(1)
    expect(profile.traitAffinity.aufwand).toBe(-1)
  })
})

describe('scoreMissionForProfile', () => {
  it('bewertet passende Missionen höher', () => {
    const profile = buildPreferenceProfile('elena', [
      makeEntry(['gruseliger']),
      makeEntry(['gruseliger']),
    ])
    const gruseligeMission = makeMission({ gruselig: 4 })
    const harmloseMission = makeMission({ gruselig: 0, farbig: 4 })

    expect(scoreMissionForProfile(gruseligeMission, profile)).toBeGreaterThan(
      scoreMissionForProfile(harmloseMission, profile),
    )
  })

  it('ist 0, solange kein Präferenzsignal vorliegt', () => {
    const profile = buildPreferenceProfile('elena', [])
    const mission = makeMission({ gruselig: 5, farbig: 5 })
    expect(scoreMissionForProfile(mission, profile)).toBe(0)
  })
})
