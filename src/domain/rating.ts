export type DifficultyFeedback = 'zu_einfach' | 'genau_richtig' | 'zu_schwierig'

/** Strukturierte Anpassungswünsche aus der Abschlussbewertung. */
export type AdjustmentTag =
  'gruseliger' | 'weniger_gruselig' | 'farbiger' | 'weniger_suess' | 'einfacher' | 'schwieriger'

export const ADJUSTMENT_TAGS: readonly AdjustmentTag[] = [
  'gruseliger',
  'weniger_gruselig',
  'farbiger',
  'weniger_suess',
  'einfacher',
  'schwieriger',
]

export const ADJUSTMENT_LABELS: Record<AdjustmentTag, string> = {
  gruseliger: 'Gruseliger',
  weniger_gruselig: 'Weniger gruselig',
  farbiger: 'Farbiger',
  weniger_suess: 'Weniger süss',
  einfacher: 'Einfacher',
  schwieriger: 'Schwieriger',
}

export type StampId = 'geheimnisvoll' | 'gruselig' | 'genial' | 'lecker' | 'chaotisch'

export const STAMPS: readonly { id: StampId; emoji: string; label: string }[] = [
  { id: 'geheimnisvoll', emoji: '🔮', label: 'Geheimnisvoll' },
  { id: 'gruselig', emoji: '👻', label: 'Gruselig' },
  { id: 'genial', emoji: '⭐', label: 'Genial' },
  { id: 'lecker', emoji: '🧪', label: 'Lecker' },
  { id: 'chaotisch', emoji: '🌀', label: 'Chaotisch' },
]

export interface CompletionRating {
  result: 1 | 2 | 3 | 4 | 5
  taste?: 1 | 2 | 3 | 4 | 5
  appearance?: 1 | 2 | 3 | 4 | 5
  scariness?: 1 | 2 | 3 | 4 | 5
  decoration?: 1 | 2 | 3 | 4 | 5
  drinkVariant?: string
  difficultyFeedback: DifficultyFeedback
  wouldRepeat: boolean
  wouldRecommend: boolean
  adjustments: AdjustmentTag[]
  freeText?: string
  inventionName?: string
  stamp: StampId
}
