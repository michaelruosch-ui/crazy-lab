import { describe, expect, it } from 'vitest'
import type { DiaryEntry } from './diary'
import { researchAchievements } from './achievements'

function entry(
  missionId: string,
  options: Partial<DiaryEntry['missionSnapshot']> = {},
): DiaryEntry {
  return {
    id: `entry-${missionId}`,
    profileId: 'elena',
    completedAt: '2026-09-04T00:00:00.000Z',
    status: 'erfolgreich',
    missionSnapshot: {
      missionId,
      contentVersion: 1,
      title: missionId,
      primaryCategory: 'getraenk',
      imagePlaceholder: 'x',
      ...options,
    },
    rating: {
      result: 5,
      difficultyFeedback: 'genau_richtig',
      wouldRepeat: true,
      wouldRecommend: true,
      adjustments: [],
      stamp: 'genial',
    },
  }
}

describe('Forscher-Abzeichen', () => {
  it('schaltet das erste Kategorie-Abzeichen nach fünf verschiedenen Missionen frei', () => {
    const badges = researchAchievements([1, 2, 3, 4, 5].map((id) => entry(`drink-${id}`)))
    expect(badges.find((badge) => badge.id === 'getraenk-5')?.unlocked).toBe(true)
    expect(badges.find((badge) => badge.id === 'getraenk-10')?.progress).toBe(5)
    expect(badges).toHaveLength(40)
  })

  it('zählt wiederholte Missionen nur einmal', () => {
    const badges = researchAchievements([entry('drink-1'), entry('drink-1')])
    expect(badges.find((badge) => badge.id === 'getraenk-5')?.progress).toBe(1)
    expect(badges.find((badge) => badge.id === 'repeat-mission')?.unlocked).toBe(true)
  })

  it('belohnt lange und schwere Missionen sowie vollständige Forschungsnotizen', () => {
    const longResearch = entry('hard-research', {
      durationMinutes: 60,
      difficulty: 'schwer',
    })
    longResearch.rating.hypothesis = 'Es sprudelt.'
    longResearch.rating.observation = 'Viele Blasen.'
    longResearch.rating.learnedExplanation = 'Gas ist entstanden.'

    const badges = researchAchievements([longResearch])
    expect(badges.find((badge) => badge.id === 'long-mission')?.unlocked).toBe(true)
    expect(badges.find((badge) => badge.id === 'hard-mission')?.unlocked).toBe(true)
    expect(badges.find((badge) => badge.id === 'research-notes')?.unlocked).toBe(true)
  })

  it('erkennt ein besonderes Abzeichen anhand einer kuratierten Mission', () => {
    const badges = researchAchievements([
      entry('mission-blutroter-schatten-trank', { title: 'Der blutrote Schatten-Trank' }),
    ])
    expect(badges.find((badge) => badge.id === 'special-shadow-drink')?.unlocked).toBe(true)
  })
})
