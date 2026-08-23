import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SecretVaultEntry } from '../../domain'
import {
  indexedDbSecretVaultRepository,
  type SecretVaultRepository,
} from '../../storage/secretVaultRepository'
import { scheduleCloudBackup } from '../../storage/cloudSync'

export function useSecretVault(
  profileId: string,
  repository: SecretVaultRepository = indexedDbSecretVaultRepository,
) {
  const [entries, setEntries] = useState<SecretVaultEntry[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const loaded = await repository.getAll(profileId)
    setEntries(loaded)
    setLoading(false)
  }, [profileId, repository])

  useEffect(() => {
    let cancelled = false
    repository.getAll(profileId).then((loaded) => {
      if (!cancelled) {
        setEntries(loaded)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [profileId, repository])

  const savedMissionIds = useMemo(() => new Set(entries.map((e) => e.missionId)), [entries])

  const toggle = useCallback(
    async (missionId: string) => {
      if (savedMissionIds.has(missionId)) {
        await repository.remove(profileId, missionId)
      } else {
        await repository.save(profileId, missionId)
      }
      await reload()
      scheduleCloudBackup(profileId)
    },
    [profileId, repository, reload, savedMissionIds],
  )

  return { entries, savedMissionIds, loading, toggle, reload }
}
