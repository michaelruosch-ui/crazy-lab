import { useEffect } from 'react'
import { saveLocalSnapshot } from './localBackupRepository'

const FIVE_MINUTES = 5 * 60 * 1000

export function useAutomaticSnapshots(profileId?: string) {
  useEffect(() => {
    if (!profileId) return

    const save = () => void saveLocalSnapshot(profileId).catch(() => undefined)
    const saveWhenHidden = () => {
      if (document.visibilityState === 'hidden') save()
    }

    save()
    const interval = window.setInterval(save, FIVE_MINUTES)
    document.addEventListener('visibilitychange', saveWhenHidden)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', saveWhenHidden)
    }
  }, [profileId])
}
