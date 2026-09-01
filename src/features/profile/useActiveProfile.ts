import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_PROFILE } from '../../domain'

const ACTIVE_PROFILE_KEY = 'crazylab-active-profile'
const ACTIVE_PROFILE_EVENT = 'crazylab-active-profile-change'
let memoryActiveProfileId = DEFAULT_PROFILE.id

function readActiveProfileId(): string {
  try {
    return window.localStorage.getItem(ACTIVE_PROFILE_KEY) || memoryActiveProfileId
  } catch {
    return memoryActiveProfileId
  }
}

export function useActiveProfileId() {
  const [activeProfileId, setState] = useState(readActiveProfileId)

  useEffect(() => {
    const sync = () => setState(readActiveProfileId())
    window.addEventListener(ACTIVE_PROFILE_EVENT, sync)
    return () => window.removeEventListener(ACTIVE_PROFILE_EVENT, sync)
  }, [])

  const setActiveProfileId = useCallback((profileId: string) => {
    memoryActiveProfileId = profileId
    try {
      window.localStorage.setItem(ACTIVE_PROFILE_KEY, profileId)
    } catch {
      // In privaten Browserkontexten kann localStorage gesperrt sein; der Wechsel funktioniert
      // dann zumindest bis zum nächsten vollständigen Neustart weiter.
    }
    setState(profileId)
    window.dispatchEvent(new Event(ACTIVE_PROFILE_EVENT))
  }, [])

  return { activeProfileId, setActiveProfileId }
}
