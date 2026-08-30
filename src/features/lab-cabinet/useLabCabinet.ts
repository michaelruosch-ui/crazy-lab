import { useCallback, useEffect, useState } from 'react'
import type { LabCabinetItem } from '../../domain'
import {
  indexedDbLabCabinetRepository,
  type LabCabinetRepository,
} from '../../storage/labCabinetRepository'

export function useLabCabinet(
  profileId: string,
  repository: LabCabinetRepository = indexedDbLabCabinetRepository,
) {
  const [items, setItems] = useState<LabCabinetItem[]>([])
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
    async (item: LabCabinetItem) => {
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

  return { items, loading, save, remove }
}
