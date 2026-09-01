import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { DEFAULT_PROFILE } from '../domain'
import { indexedDbProfileRepository } from './profileRepository'
import { resetDbConnection } from './db'

describe('indexedDbProfileRepository', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('liefert undefined, solange kein Profil existiert', async () => {
    expect(await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)).toBeUndefined()
  })

  it('speichert und liest ein Profil', async () => {
    const profile = { ...DEFAULT_PROFILE, researcherName: 'Dr. Elena', mascotVariant: 'der-heuler' }
    await indexedDbProfileRepository.save(profile)

    expect(await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)).toEqual(profile)
  })

  it('bleibt nach simuliertem Neuladen erhalten', async () => {
    await indexedDbProfileRepository.save(DEFAULT_PROFILE)
    resetDbConnection()

    expect(await indexedDbProfileRepository.get(DEFAULT_PROFILE.id)).toEqual(DEFAULT_PROFILE)
  })

  it('liest mehrere getrennte Profile', async () => {
    const laura = { ...DEFAULT_PROFILE, id: 'laura', researcherName: 'Laura' }
    await indexedDbProfileRepository.save(DEFAULT_PROFILE)
    await indexedDbProfileRepository.save(laura)

    expect((await indexedDbProfileRepository.getAll()).map((profile) => profile.id).sort()).toEqual(
      ['elena', 'laura'],
    )
  })
})
