import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import type { CustomMission } from '../domain'
import { resetDbConnection } from './db'
import { indexedDbCustomMissionRepository as repository } from './customMissionRepository'

const mission: CustomMission = {
  id: 'mission-eigen-test',
  profileId: 'elena',
  contentVersion: 1,
  title: 'Sockenmonster',
  shortDescription: 'Ein eigenes Monster bauen.',
  primaryCategory: 'basteln',
  secondaryCategories: [],
  durationMinutes: 20,
  difficulty: 'leicht',
  estimatedCostChf: 0,
  materials: [{ id: 'm1', name: 'Socke', optional: false, consumable: true }],
  safetyLevel: 'gruen',
  safetyNotes: [],
  location: 'ueberall',
  traits: { gruselig: 2, farbig: 3, suess: 0, kreativ: 5, unordentlich: 1, aufwand: 2 },
  steps: [
    { id: 's1', order: 1, text: 'Socke wählen.' },
    { id: 's2', order: 2, text: 'Monster bauen.' },
  ],
  generalHelpTip: 'Bei Unsicherheit fragen.',
  completionQuestion: 'Wie gefällt es dir?',
  imagePlaceholder: 'eigen-basteln',
  createdAt: '2026-09-01T10:00:00Z',
  updatedAt: '2026-09-01T10:00:00Z',
}

describe('eigene Missionen', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('speichert und aktualisiert eine eigene Mission', async () => {
    await repository.save(mission)
    expect(await repository.get(mission.id)).toEqual(mission)
    await repository.save({ ...mission, title: 'Neues Sockenmonster', contentVersion: 2 })
    expect((await repository.getAll('elena'))[0]!.title).toBe('Neues Sockenmonster')
  })
})
