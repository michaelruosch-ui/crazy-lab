import { describe, expect, it } from 'vitest'
import { missions } from '../data'
import type { DiaryEntry } from './diary'
import { rankDrinkVariants } from './drinkVariantRanking'

const mission = missions.find((item) => item.id === 'mission-tuerkiser-geisternebel')!

function entry(variant: string, score: 1 | 2 | 3 | 4 | 5): DiaryEntry {
  return {
    id: `${variant}-${score}`,
    profileId: 'elena',
    missionSnapshot: {
      missionId: mission.id,
      contentVersion: mission.contentVersion,
      title: mission.title,
      primaryCategory: mission.primaryCategory,
      imagePlaceholder: mission.imagePlaceholder,
    },
    status: 'erfolgreich',
    completedAt: '2026-08-30T00:00:00.000Z',
    rating: {
      result: score,
      taste: score,
      appearance: score,
      scariness: score,
      decoration: score,
      drinkVariant: variant,
      difficultyFeedback: 'genau_richtig',
      wouldRepeat: true,
      wouldRecommend: true,
      adjustments: [],
      stamp: 'lecker',
    },
  }
}

describe('rankDrinkVariants', () => {
  it('behält ohne Bewertungen die Katalogreihenfolge', () => {
    expect(rankDrinkVariants(mission, []).map((variant) => variant.name)).toEqual(
      mission.drinkProfile?.variants.map((variant) => variant.name),
    )
  })

  it('empfiehlt die von Elena besser bewertete Variante zuerst', () => {
    const first = mission.drinkProfile!.variants[0]!
    const second = mission.drinkProfile!.variants[1]!
    const ranked = rankDrinkVariants(mission, [entry(first.name, 2), entry(second.name, 5)])

    expect(ranked[0]!.name).toBe(second.name)
    expect(ranked[0]!.averageScore).toBe(5)
    expect(ranked[0]!.ratingCount).toBe(1)
  })
})
