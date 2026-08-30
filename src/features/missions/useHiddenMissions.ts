import { useCallback, useEffect, useState } from 'react'
import type { HiddenMissionEntry } from '../../domain'
import { isCurrentlyHidden } from '../../domain'
import {
  indexedDbHiddenMissionsRepository,
  type HiddenMissionsRepository,
} from '../../storage/hiddenMissionsRepository'
import { scheduleLocalBackup } from '../../storage/localBackup'

export function useHiddenMissions(
  profileId: string,
  repository: HiddenMissionsRepository = indexedDbHiddenMissionsRepository,
) {
  const [history, setHistory] = useState<HiddenMissionEntry[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const loaded = await repository.getHistory(profileId)
    setHistory(loaded)
    setLoading(false)
  }, [profileId, repository])

  useEffect(() => {
    let cancelled = false
    repository.getHistory(profileId).then((loaded) => {
      if (!cancelled) {
        setHistory(loaded)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [profileId, repository])

  const now = new Date()
  const currentlyHiddenMissionIds = new Set(
    history.filter((entry) => isCurrentlyHidden(entry, now)).map((entry) => entry.missionId),
  )

  const hide = useCallback(
    async (missionId: string) => {
      await repository.hide(profileId, missionId)
      await reload()
      scheduleLocalBackup(profileId)
    },
    [profileId, repository, reload],
  )

  return { history, currentlyHiddenMissionIds, loading, hide, reload }
}
