/** ID eines Eintrags im Maskottchen-Katalog (`components/mascotArt.ts`). Bewusst ein offener
 * String-Typ statt einer Union in `domain`, damit der Katalog (33 Entwürfe, siehe Sprint-4-
 * Familienfeedback) frei erweiterbar bleibt, ohne die Domänenschicht anzufassen. */
export type MascotId = string

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
  mascotVariant: MascotId
  birthdays: Birthday[]
  createdAt: string
  /** Fehlt, solange das Onboarding (Maskottchen + Forschername) noch nicht abgeschlossen ist. */
  onboardingCompletedAt?: string
}

export const DEFAULT_PROFILE: Profile = {
  id: 'elena',
  researcherName: 'Elena',
  mascotVariant: 'blutiger-kuschelbaer',
  birthdays: [],
  createdAt: '2026-08-16T00:00:00.000Z',
}

export function isBirthdayToday(birthday: Birthday, today: Date): boolean {
  const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return birthday.monthDay === monthDay
}
