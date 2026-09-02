import { describe, expect, it } from 'vitest'
import type { CustomMission } from './customMission'
import { decodeSharedMission, encodeSharedMission } from './missionSharing'

const mission: CustomMission = {
  id: 'mission-eigen-alt',
  profileId: 'elena',
  contentVersion: 3,
  title: 'Das Sockenmonster 👻',
  shortDescription: 'Wir bauen ein lustiges Monster.',
  primaryCategory: 'basteln',
  secondaryCategories: [],
  durationMinutes: 20,
  difficulty: 'leicht',
  estimatedCostChf: 0,
  materials: [{ id: 'm1', name: 'Socke', optional: false, consumable: true }],
  safetyLevel: 'gruen',
  safetyNotes: [],
  location: 'ueberall',
  traits: { gruselig: 2, farbig: 3, suess: 0, kreativ: 5, unordentlich: 2, aufwand: 2 },
  steps: [
    { id: 's1', order: 1, text: 'Socke wählen.' },
    { id: 's2', order: 2, text: 'Gesicht malen.' },
  ],
  generalHelpTip: 'Hole Hilfe, wenn du unsicher bist.',
  completionQuestion: 'Was hat gut funktioniert?',
  imagePlaceholder: 'eigen-basteln',
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-01T11:00:00.000Z',
}

describe('teilbare Missionen', () => {
  it('transportiert Missionsinhalte mit Umlauten, aber keine Profil- oder Verlaufsdaten', () => {
    const encoded = encodeSharedMission(mission)
    const decoded = decodeSharedMission(encoded)

    expect(decoded?.title).toBe('Das Sockenmonster 👻')
    expect(decoded?.steps).toHaveLength(2)
    expect(encoded).not.toContain('elena')
    expect(decoded).not.toHaveProperty('profileId')
    expect(decoded).not.toHaveProperty('id')
    expect(decoded).not.toHaveProperty('createdAt')
  })

  it('weist beschädigte und unvollständige Links ab', () => {
    expect(decodeSharedMission('kaputt')).toBeUndefined()
    expect(
      decodeSharedMission(btoa(JSON.stringify({ version: 1, title: 'Zu wenig' }))),
    ).toBeUndefined()
  })
})
