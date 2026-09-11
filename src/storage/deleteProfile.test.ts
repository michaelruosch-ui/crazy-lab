import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { DEFAULT_PROFILE } from '../domain'
import { deleteProfileCompletely, resetDbConnection } from './db'
import { indexedDbProfileRepository } from './profileRepository'
import { getLocalSnapshots, saveLocalSnapshot } from './localBackupRepository'
import { indexedDbDiaryRepository } from './diaryRepository'

describe('vollständiges Profillöschen', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('entfernt Profil, Inhalte und Sicherungsstände, aber keine fremden Profile', async () => {
    const laura = { ...DEFAULT_PROFILE, id: 'laura', researcherName: 'Laura' }
    await indexedDbProfileRepository.save(DEFAULT_PROFILE)
    await indexedDbProfileRepository.save(laura)
    await indexedDbDiaryRepository.saveEntry({
      id: 'entry-elena',
      profileId: DEFAULT_PROFILE.id,
      missionSnapshot: {
        missionId: 'mission-test',
        contentVersion: 1,
        title: 'Test',
        primaryCategory: 'experiment',
        imagePlaceholder: 'test',
      },
      status: 'erfolgreich',
      rating: {
        result: 5,
        difficultyFeedback: 'genau_richtig',
        wouldRepeat: true,
        wouldRecommend: true,
        adjustments: [],
        freeText: '',
        stamp: 'genial',
      },
      completedAt: '2026-09-11T10:00:00.000Z',
    })
    await saveLocalSnapshot(DEFAULT_PROFILE.id)

    await deleteProfileCompletely(DEFAULT_PROFILE.id)

    expect(await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)).toBeUndefined()
    expect(await indexedDbProfileRepository.get('laura')).toEqual(laura)
    expect(await indexedDbDiaryRepository.getAllEntries(DEFAULT_PROFILE.id)).toEqual([])
    expect(await getLocalSnapshots(DEFAULT_PROFILE.id)).toEqual([])
  })
})
