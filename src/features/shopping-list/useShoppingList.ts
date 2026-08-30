import { useCallback, useEffect, useState } from 'react'
import type { ShoppingListItem } from '../../domain'
import {
  indexedDbShoppingListRepository,
  type ShoppingListRepository,
} from '../../storage/shoppingListRepository'

export function useShoppingList(
  profileId: string,
  repository: ShoppingListRepository = indexedDbShoppingListRepository,
) {
  const [items, setItems] = useState<ShoppingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const reload = useCallback(async () => {
    setItems(await repository.getAll(profileId))
    setLoading(false)
  }, [profileId, repository])

  useEffect(() => {
    let cancelled = false
    repository.getAll(profileId).then((loaded) => {
      if (!cancelled) {
        setItems(loaded)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [profileId, repository])

  const save = useCallback(
    async (item: ShoppingListItem) => {
      await repository.save(item)
      await reload()
    },
    [reload, repository],
  )
  const remove = useCallback(
    async (id: string) => {
      await repository.remove(id)
      await reload()
    },
    [reload, repository],
  )
  return { items, loading, save, remove, reload }
}
