import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import type { DiaryEntry } from '../../domain'
import { DiaryPage } from './DiaryPage'
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
    difficultyFeedback: 'genau_richtig',
    wouldRepeat: false,
    wouldRecommend: true,
    adjustments: [],
    stamp: 'geheimnisvoll',
  },
  completedAt: '2026-08-23T10:00:00.000Z',
}

describe('DiaryPage', () => {
  beforeEach(async () => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
    await indexedDbDiaryRepository.saveEntry(entry)
  })

  it('führt vom Tagebuch-Eintrag zur Detailansicht', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/diary']}>
        <Routes>
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/diary/:entryId" element={<DiaryEntryDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    const link = await screen.findByRole('link', { name: /Der blutrote Schatten-Trank/ })
    await user.click(link)

    expect(await screen.findByRole('button', { name: '🔁 Nochmal machen?' })).toBeInTheDocument()
  })

  it('filtert Einträge nach Suche, Kategorie und Status', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <DiaryPage />
      </MemoryRouter>,
    )
    await screen.findByText('Der blutrote Schatten-Trank')
    await user.type(screen.getByRole('searchbox', { name: 'Suchen' }), 'unbekannt')
    expect(screen.getByText('Keine Einträge passen zu diesen Filtern.')).toBeInTheDocument()
    await user.clear(screen.getByRole('searchbox', { name: 'Suchen' }))
    await user.selectOptions(screen.getByLabelText('Kategorie'), 'basteln')
    expect(screen.getByText('Keine Einträge passen zu diesen Filtern.')).toBeInTheDocument()
  })
})
