export type MascotVariant = 'geist' | 'vampir' | 'kobold'

export const MASCOT_VARIANTS: readonly { id: MascotVariant; label: string; description: string }[] = [
  { id: 'geist', label: 'Geist', description: 'Ruhig und geheimnisvoll türkis leuchtend.' },
  { id: 'vampir', label: 'Vampir', description: 'Frech und pink-rot mit spitzen Zähnen.' },
  { id: 'kobold', label: 'Kobold', description: 'Wild und giftgrün-chaotisch.' },
]

export interface Birthday {
  id: string
  personName: string
  /** Monat und Tag als "MM-DD" - bewusst ohne Jahr, da Geburtstage jährlich wiederkehren. */
  monthDay: string
}

/** Datenmodell ist von Anfang an mehrprofilfähig; bis Sprint 20 existiert genau ein Profil. */
export interface Profile {
  id: string
  researcherName: string
  mascotVariant: MascotVariant
  birthdays: Birthday[]
  createdAt: string
  /** Fehlt, solange das Onboarding (Maskottchen + Forschername) noch nicht abgeschlossen ist. */
  onboardingCompletedAt?: string
}

export const DEFAULT_PROFILE: Profile = {
  id: 'elena',
  researcherName: 'Elena',
  mascotVariant: 'geist',
  birthdays: [],
  createdAt: '2026-08-16T00:00:00.000Z',
}

export function isBirthdayToday(birthday: Birthday, today: Date): boolean {
  const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return birthday.monthDay === monthDay
}
