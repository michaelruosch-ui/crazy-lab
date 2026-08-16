/** Datenmodell ist von Anfang an mehrprofilfähig; Sprint 1 nutzt genau ein Profil. */
export interface Profile {
  id: string
  researcherName: string
  createdAt: string
}

export const DEFAULT_PROFILE: Profile = {
  id: 'elena',
  researcherName: 'Elena',
  createdAt: '2026-08-16T00:00:00.000Z',
}
