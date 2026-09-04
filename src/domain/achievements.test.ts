import { describe, expect, it } from 'vitest'
import type { DiaryEntry } from './diary'
import { researchAchievements } from './achievements'

function entry(missionId: string): DiaryEntry {
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
  })

  it('zählt wiederholte Missionen nur einmal', () => {
    const badges = researchAchievements([entry('drink-1'), entry('drink-1')])
    expect(badges.find((badge) => badge.id === 'getraenk-5')?.progress).toBe(1)
  })
})
