import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { resetDbConnection } from './db'
import { indexedDbExperimentProgressRepository as repository } from './experimentProgressRepository'

describe('laufende Experimente', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('speichert, lädt und entfernt einen Zwischenstand', async () => {
    const progress = {
      id: 'elena:exp',
      profileId: 'elena',
      missionId: 'exp',
      checkedStepIds: ['s1'],
      startedAt: '2026-08-31T10:00:00Z',
      updatedAt: '2026-08-31T10:01:00Z',
    }
    await repository.save(progress)
    expect(await repository.get('elena', 'exp')).toEqual(progress)
    await repository.remove(progress.id)
    expect(await repository.get('elena', 'exp')).toBeUndefined()
  })
})
