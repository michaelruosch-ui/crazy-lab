import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import type { CustomMission } from '../../domain'
import { encodeSharedMission } from '../../domain'
import { indexedDbCustomMissionRepository } from '../../storage/customMissionRepository'
import { resetDbConnection } from '../../storage/db'
import { SharedMissionImportPage } from './SharedMissionImportPage'

const sharedMission: CustomMission = {
  id: 'mission-eigen-sender',
  profileId: 'anderes-profil',
  contentVersion: 4,
  title: 'Die geheime Kartonhöhle',
  shortDescription: 'Baue eine kleine Höhle mit einem Geheimfach.',
  primaryCategory: 'basteln',
  secondaryCategories: [],
  durationMinutes: 30,
  difficulty: 'leicht',
  estimatedCostChf: 2,
  materials: [{ id: 'm1', name: 'Karton', optional: false, consumable: true }],
  safetyLevel: 'gelb',
  safetyNotes: ['Eine erwachsene Person hilft beim Schneiden.'],
  location: 'zimmer',
  traits: { gruselig: 2, farbig: 2, suess: 0, kreativ: 5, unordentlich: 2, aufwand: 3 },
  steps: [
    { id: 's1', order: 1, text: 'Plane die Höhle.' },
    { id: 's2', order: 2, text: 'Schneide den Karton mit Hilfe.' },
  ],
  generalHelpTip: 'Frage nach Hilfe.',
  completionQuestion: 'Wo ist das Geheimfach?',
  imagePlaceholder: 'eigen-basteln',
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-01T11:00:00.000Z',
}

describe('Import einer geteilten Mission', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('zeigt den Inhalt zuerst und speichert erst nach bewusster Bestätigung eine eigene Kopie', async () => {
    const user = userEvent.setup()
    const encoded = encodeSharedMission(sharedMission)
    render(
      <MemoryRouter initialEntries={[`/mission-import?mission=${encoded}`]}>
        <SharedMissionImportPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Die geheime Kartonhöhle' })).toBeInTheDocument()
    expect(screen.getByText('Eine erwachsene Person hilft beim Schneiden.')).toBeInTheDocument()
    expect(await indexedDbCustomMissionRepository.getAll('elena')).toHaveLength(0)

    await user.click(screen.getByRole('button', { name: 'Mission in mein Profil importieren' }))

    expect(
      await screen.findByRole('heading', { name: '🎉 Mission importiert!' }),
    ).toBeInTheDocument()
    const imported = await indexedDbCustomMissionRepository.getAll('elena')
    expect(imported).toHaveLength(1)
    expect(imported[0]?.title).toBe(sharedMission.title)
    expect(imported[0]?.id).not.toBe(sharedMission.id)
    expect(imported[0]?.profileId).toBe('elena')
  })

  it('speichert bei einem beschädigten Link nichts', async () => {
    render(
      <MemoryRouter initialEntries={['/mission-import?mission=kaputt']}>
        <SharedMissionImportPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '🧪 Missionslink ungültig' })).toBeInTheDocument()
    expect(await indexedDbCustomMissionRepository.getAll('elena')).toHaveLength(0)
  })
})
