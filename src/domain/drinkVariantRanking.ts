import type { DiaryEntry } from './diary'
import type { DrinkVariant, Mission } from './mission'

export interface RankedDrinkVariant extends DrinkVariant {
  ratingCount: number
  averageScore?: number
}

/**
 * Sortiert Varianten anhand von Elenas eigenen Bewertungen. Ohne Bewertung bleibt die
 * Katalogreihenfolge stabil; das Verfahren ist dadurch sichtbar und nachvollziehbar.
 */
export function rankDrinkVariants(mission: Mission, entries: DiaryEntry[]): RankedDrinkVariant[] {
  if (!mission.drinkProfile) return []

  return mission.drinkProfile.variants
    .map((variant, originalIndex) => {
      const ratings = entries.filter(
        (entry) =>
          entry.missionSnapshot.missionId === mission.id &&
          entry.rating.drinkVariant === variant.name,
      )
      const scores = ratings.map((entry) => {
        const values = [
          entry.rating.taste,
          entry.rating.appearance,
          entry.rating.scariness,
          entry.rating.decoration,
        ].filter((value): value is 1 | 2 | 3 | 4 | 5 => value !== undefined)
        return values.length === 0
          ? entry.rating.result
          : values.reduce((sum, value) => sum + value, 0) / values.length
      })
      return {
        ...variant,
        originalIndex,
        ratingCount: scores.length,
        averageScore:
          scores.length > 0
            ? scores.reduce((sum, score) => sum + score, 0) / scores.length
            : undefined,
      }
    })
    .sort((a, b) => {
      if (a.averageScore === undefined && b.averageScore === undefined)
        return a.originalIndex - b.originalIndex
      if (a.averageScore === undefined) return 1
      if (b.averageScore === undefined) return -1
      return b.averageScore - a.averageScore || a.originalIndex - b.originalIndex
    })
    .map(({ name, description, ratingCount, averageScore }) => ({
      name,
      description,
      ratingCount,
      averageScore,
    }))
}
