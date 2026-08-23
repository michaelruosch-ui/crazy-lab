import { useCallback, useEffect, useState } from 'react'
import type { Profile } from '../../domain'
import { indexedDbProfileRepository, type ProfileRepository } from '../../storage/profileRepository'
import { scheduleCloudBackup } from '../../storage/cloudSync'

export function useProfile(
  profileId: string,
  repository: ProfileRepository = indexedDbProfileRepository,
) {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined)

  const reload = useCallback(async () => {
    const loaded = await repository.get(profileId)
    setProfile(loaded ?? null)
  }, [profileId, repository])

  useEffect(() => {
    let cancelled = false
    repository
      .get(profileId)
      .then((loaded) => {
        if (!cancelled) setProfile(loaded ?? null)
      })
      .catch(() => {
        // Endgültig gescheitertes Öffnen der lokalen Datenbank (siehe DECISIONS.md ADR-005/006)
        // darf die App nicht für immer bei "Lade..." hängen lassen - wir behandeln das wie ein
        // fehlendes Profil, damit zumindest das Onboarding erreichbar bleibt.
        if (!cancelled) setProfile(null)
      })
    return () => {
      cancelled = true
    }
  }, [profileId, repository])

  const save = useCallback(
    async (updated: Profile) => {
      await repository.save(updated)
      setProfile(updated)
      scheduleCloudBackup(updated.id)
    },
    [repository],
  )

  return { profile, loading: profile === undefined, save, reload }
}
