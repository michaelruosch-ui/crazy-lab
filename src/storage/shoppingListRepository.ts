import type { ShoppingListItem } from '../domain'
import { getDb, SHOPPING_LIST_STORE } from './db'

export interface ShoppingListRepository {
  getAll(profileId: string): Promise<ShoppingListItem[]>
  save(item: ShoppingListItem): Promise<void>
  remove(id: string): Promise<void>
}

export const indexedDbShoppingListRepository: ShoppingListRepository = {
  async getAll(profileId) {
    const db = await getDb()
    const items = await db.getAllFromIndex(SHOPPING_LIST_STORE, 'by-profile', profileId)
    return items.sort(
      (a, b) => Number(a.checked) - Number(b.checked) || a.addedAt.localeCompare(b.addedAt),
    )
  },

  async save(item) {
    const db = await getDb()
    await db.put(SHOPPING_LIST_STORE, item)
  },

  async remove(id) {
    const db = await getDb()
    await db.delete(SHOPPING_LIST_STORE, id)
  },
}
