import { beforeEach, describe, expect, it } from 'vitest'
import type { ShoppingListItem } from '../domain'
import { resetDbConnection } from './db'
import { indexedDbShoppingListRepository } from './shoppingListRepository'

describe('ShoppingListRepository', () => {
  beforeEach(() => resetDbConnection())

  it('speichert, aktualisiert und entfernt Einkaufspositionen', async () => {
    const item: ShoppingListItem = {
      id: `shopping-test-${crypto.randomUUID()}`,
      profileId: 'elena',
      materialName: 'Apfelsaft',
      store: 'coop',
      estimatedPriceChf: 3,
      checked: false,
      assignedTo: 'michael',
      addedAt: '2026-08-30T12:00:00Z',
    }
    await indexedDbShoppingListRepository.save(item)
    expect(
      (await indexedDbShoppingListRepository.getAll('elena')).some((entry) => entry.id === item.id),
    ).toBe(true)

    await indexedDbShoppingListRepository.save({ ...item, checked: true })
    expect(
      (await indexedDbShoppingListRepository.getAll('elena')).find((entry) => entry.id === item.id)
        ?.checked,
    ).toBe(true)

    await indexedDbShoppingListRepository.remove(item.id)
    expect(
      (await indexedDbShoppingListRepository.getAll('elena')).some((entry) => entry.id === item.id),
    ).toBe(false)
  })
})
