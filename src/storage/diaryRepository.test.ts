import { beforeEach, describe, expect, it } from 'vitest'
import type { DiaryEntry } from '../domain'
import { indexedDbDiaryRepository } from './diaryRepository'
import { resetDbConnection } from './db'
import 'fake-indexeddb/auto'
import { IDBFactory } from 'fake-indexeddb'

function makeEntry(overrides: Partial<DiaryEntry> = {}): DiaryEntry {
  return {
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
      wouldRepeat: true,
      wouldRecommend: true,
      adjustments: ['farbiger'],
      stamp: 'geheimnisvoll',
    },
    completedAt: '2026-08-16T10:00:00.000Z',
    ...overrides,
  }
}

describe('indexedDbDiaryRepository', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('speichert und liest einen Tagebucheintrag', async () => {
    const entry = makeEntry()
    await indexedDbDiaryRepository.saveEntry(entry)

    const loaded = await indexedDbDiaryRepository.getEntry(entry.id)
    expect(loaded).toEqual(entry)
  })

  it('bleibt nach simuliertem Neuladen (neue DB-Verbindung) erhalten', async () => {
    const entry = makeEntry()
    await indexedDbDiaryRepository.saveEntry(entry)

    resetDbConnection()

    const entries = await indexedDbDiaryRepository.getAllEntries('elena')
    expect(entries).toHaveLength(1)
    expect(entries[0]).toEqual(entry)
  })

  it('filtert Einträge nach Profil', async () => {
    await indexedDbDiaryRepository.saveEntry(makeEntry({ id: 'e1', profileId: 'elena' }))
    await indexedDbDiaryRepository.saveEntry(makeEntry({ id: 'e2', profileId: 'laura' }))

    const elenaEntries = await indexedDbDiaryRepository.getAllEntries('elena')
    expect(elenaEntries.map((e) => e.id)).toEqual(['e1'])
  })
})
