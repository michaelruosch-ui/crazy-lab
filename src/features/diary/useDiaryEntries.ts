import { useCallback, useEffect, useState } from 'react'
import type { DiaryEntry } from '../../domain'
import { indexedDbDiaryRepository, type DiaryRepository } from '../../storage/diaryRepository'

export function useDiaryEntries(profileId: string, repository: DiaryRepository = indexedDbDiaryRepository) {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    repository.getAllEntries(profileId).then((loaded) => {
      if (!cancelled) {
        setEntries(loaded)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [profileId, repository])

  const reload = useCallback(async () => {
    setLoading(true)
    const loaded = await repository.getAllEntries(profileId)
    setEntries(loaded)
    setLoading(false)
  }, [profileId, repository])

  return { entries, loading, reload }
}
