import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { DEFAULT_PROFILE } from '../domain'
import { resetDbConnection } from './db'
import { indexedDbProfileRepository } from './profileRepository'
import { getLocalSnapshots, restoreLocalSnapshot, saveLocalSnapshot } from './localBackupRepository'

describe('lokale Sicherungsstände', () => {
  beforeEach(async () => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
    await indexedDbProfileRepository.save({
      ...DEFAULT_PROFILE,
      onboardingCompletedAt: '2026-08-23T00:00:00.000Z',
    })
  })

  it('speichert unveränderte Daten nicht doppelt', async () => {
    await saveLocalSnapshot(DEFAULT_PROFILE.id)
    await saveLocalSnapshot(DEFAULT_PROFILE.id)
    expect(await getLocalSnapshots(DEFAULT_PROFILE.id)).toHaveLength(1)
  })

  it('zeigt neue Stände zuerst und kann einen Stand wiederherstellen', async () => {
    const first = await saveLocalSnapshot(DEFAULT_PROFILE.id)
    await indexedDbProfileRepository.save({ ...DEFAULT_PROFILE, researcherName: 'Neue Elena' })
    await saveLocalSnapshot(DEFAULT_PROFILE.id)
    expect(await getLocalSnapshots(DEFAULT_PROFILE.id)).toHaveLength(2)

    await restoreLocalSnapshot(first)
    expect((await indexedDbProfileRepository.get(DEFAULT_PROFILE.id))?.researcherName).toBe('Elena')
  })
})
