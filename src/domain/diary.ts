import type { Difficulty, MissionCategory } from './mission'
import type { CompletionRating } from './rating'

export type DiaryStatus = 'erfolgreich' | 'fehlgeschlagen' | 'pausiert' | 'favorisiert'

/** Schnappschuss der Mission zum Zeitpunkt des Abschlusses, damit spätere Inhalts-Updates
 * bestehende Tagebucheinträge nicht verändern. */
export interface MissionSnapshot {
  missionId: string
  contentVersion: number
  title: string
  primaryCategory: MissionCategory
  imagePlaceholder: string
  /** Seit Sprint 33 für Ausdauer- und Schwierigkeitsabzeichen; ältere Einträge bleiben gültig. */
  durationMinutes?: number
  difficulty?: Difficulty
}

export interface DiaryEntry {
  id: string
  profileId: string
  missionSnapshot: MissionSnapshot
  status: DiaryStatus
  rating: CompletionRating
  completedAt: string
}
