import { beforeEach, describe, expect, it, vi } from 'vitest'
import { indexedDB, IDBKeyRange } from 'fake-indexeddb'
import type { LabCabinetItem } from '../domain'
import { resetDbConnection } from './db'
import { indexedDbLabCabinetRepository } from './labCabinetRepository'

describe('LabCabinetRepository', () => {
  beforeEach(() => {
    vi.stubGlobal('indexedDB', indexedDB)
    vi.stubGlobal('IDBKeyRange', IDBKeyRange)
    resetDbConnection()
  })

  it('speichert, aktualisiert und entfernt Materialien je Profil', async () => {
    const item: LabCabinetItem = {
      id: `cabinet-${crypto.randomUUID()}`,
      profileId: 'elena',
      materialName: 'Lebensmittelfarbe',
      exactName: 'Blau',
      area: 'bastelkiste',
      boxName: 'Grusel-Kiste',
      quantityStatus: 'wenig',
      updatedAt: '2026-08-30T00:00:00.000Z',
    }
    await indexedDbLabCabinetRepository.save(item)
    expect(await indexedDbLabCabinetRepository.getAll('elena')).toEqual([item])

    await indexedDbLabCabinetRepository.save({ ...item, quantityStatus: 'viel' })
    expect((await indexedDbLabCabinetRepository.getAll('elena'))[0]?.quantityStatus).toBe('viel')

    await indexedDbLabCabinetRepository.remove(item.id)
    expect(await indexedDbLabCabinetRepository.getAll('elena')).toEqual([])
  })
})
