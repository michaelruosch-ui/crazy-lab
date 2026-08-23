import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { indexedDbSecretVaultRepository } from './secretVaultRepository'
import { resetDbConnection } from './db'

describe('indexedDbSecretVaultRepository', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('speichert und erkennt eine gemerkte Mission', async () => {
    expect(await indexedDbSecretVaultRepository.isSaved('elena', 'mission-1')).toBe(false)

    await indexedDbSecretVaultRepository.save('elena', 'mission-1')

    expect(await indexedDbSecretVaultRepository.isSaved('elena', 'mission-1')).toBe(true)
    const all = await indexedDbSecretVaultRepository.getAll('elena')
    expect(all.map((e) => e.missionId)).toEqual(['mission-1'])
  })

  it('ist idempotent beim erneuten Speichern derselben Mission', async () => {
    await indexedDbSecretVaultRepository.save('elena', 'mission-1')
    await indexedDbSecretVaultRepository.save('elena', 'mission-1')

    const all = await indexedDbSecretVaultRepository.getAll('elena')
    expect(all).toHaveLength(1)
  })

  it('entfernt eine gemerkte Mission wieder', async () => {
    await indexedDbSecretVaultRepository.save('elena', 'mission-1')
    await indexedDbSecretVaultRepository.remove('elena', 'mission-1')

    expect(await indexedDbSecretVaultRepository.isSaved('elena', 'mission-1')).toBe(false)
  })

  it('bleibt nach simuliertem Neuladen erhalten', async () => {
    await indexedDbSecretVaultRepository.save('elena', 'mission-1')
    resetDbConnection()

    expect(await indexedDbSecretVaultRepository.isSaved('elena', 'mission-1')).toBe(true)
  })
})
