import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import type { DiaryEntry } from '../../domain'
import { DiaryEntryDetailPage } from './DiaryEntryDetailPage'
import { indexedDbDiaryRepository } from '../../storage/diaryRepository'
import { resetDbConnection } from '../../storage/db'

const entry: DiaryEntry = {
  id: 'entry-1',
  profileId: 'elena',
  missionSnapshot: {
    missionId: 'mission-blutroter-schatten-trank',
    contentVersion: 1,
    title: 'Der blutrote Schatten-Trank',
    primaryCategory: 'getraenk',
    imagePlaceholder: 'potion-red',
  },
  status: 'erfolgreich',
  rating: {
    result: 5,
    taste: 4,
    difficultyFeedback: 'genau_richtig',
    wouldRepeat: false,
    wouldRecommend: true,
    adjustments: ['gruseliger'],
    inventionName: 'Elenas Trank',
    stamp: 'geheimnisvoll',
  },
  completedAt: '2026-08-23T10:00:00.000Z',
}

function renderDetail(entryId: string) {
  return render(
    <MemoryRouter initialEntries={[`/diary/${entryId}`]}>
      <Routes>
        <Route path="/diary/:entryId" element={<DiaryEntryDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('DiaryEntryDetailPage', () => {
  beforeEach(async () => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
    await indexedDbDiaryRepository.saveEntry(entry)
  })

  it('zeigt die Details eines Tagebucheintrags', async () => {
    renderDetail('entry-1')

    expect(
      await screen.findByRole('heading', { name: /Der blutrote Schatten-Trank/ }),
    ).toBeInTheDocument()
    expect(screen.getByText('"Elenas Trank"')).toBeInTheDocument()
    expect(screen.getByText('Gruseliger')).toBeInTheDocument()
  })

  it('zeigt eine Meldung, wenn der Eintrag nicht existiert', async () => {
    renderDetail('unbekannt')

    expect(
      await screen.findByText('Dieser Tagebucheintrag wurde nicht gefunden.'),
    ).toBeInTheDocument()
  })

  it('schaltet "nochmal machen" um und speichert es dauerhaft', async () => {
    const user = userEvent.setup()
    renderDetail('entry-1')

    const toggle = await screen.findByRole('button', { name: '🔁 Nochmal machen?' })
    await user.click(toggle)

    expect(
      await screen.findByRole('button', { name: '✅ Will ich nochmal machen' }),
    ).toBeInTheDocument()

    const persisted = await indexedDbDiaryRepository.getEntry('entry-1')
    expect(persisted?.rating.wouldRepeat).toBe(true)
  })

  it('bearbeitet Name, Status und Stempel dauerhaft', async () => {
    const user = userEvent.setup()
    renderDetail('entry-1')
    await user.click(await screen.findByRole('button', { name: '✏️ Eintrag bearbeiten' }))
    await user.clear(screen.getByLabelText('Eigener Name'))
    await user.type(screen.getByLabelText('Eigener Name'), 'Vampirtrank')
    await user.selectOptions(screen.getByLabelText('Status'), 'favorisiert')
    await user.selectOptions(screen.getByLabelText('Stempel'), 'genial')
    await user.click(screen.getByRole('button', { name: 'Änderungen speichern' }))
    const persisted = await indexedDbDiaryRepository.getEntry('entry-1')
    expect(persisted?.rating.inventionName).toBe('Vampirtrank')
    expect(persisted?.status).toBe('favorisiert')
    expect(persisted?.rating.stamp).toBe('genial')
  })

  it('löscht erst nach einer klaren Rückfrage', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()
    renderDetail('entry-1')
    await user.click(await screen.findByRole('button', { name: '🗑️ Eintrag löschen' }))
    expect(window.confirm).toHaveBeenCalled()
    expect(await indexedDbDiaryRepository.getEntry('entry-1')).toBeUndefined()
  })
})
