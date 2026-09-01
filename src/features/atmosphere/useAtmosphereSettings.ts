import { useEffect, useState } from 'react'

export interface AtmosphereSettings {
  soundEnabled: boolean
  animationsEnabled: boolean
}
const KEY = 'crazylab-atmosphere-settings'
const EVENT = 'crazylab-atmosphere-change'
const DEFAULTS: AtmosphereSettings = { soundEnabled: true, animationsEnabled: true }

function profileKey(profileId?: string): string {
  return profileId ? `${KEY}-${profileId}` : KEY
}

function read(profileId?: string): AtmosphereSettings {
  try {
    const stored = window.localStorage.getItem(profileKey(profileId))
    const legacy = profileId ? window.localStorage.getItem(KEY) : null
    return { ...DEFAULTS, ...JSON.parse(stored ?? legacy ?? '{}') }
  } catch {
    return DEFAULTS
  }
}

export function useAtmosphereSettings(profileId?: string) {
  const [settings, setSettings] = useState(() => read(profileId))
  useEffect(() => {
    const sync = () => setSettings(read(profileId))
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [profileId])
  const update = (next: Partial<AtmosphereSettings>) => {
    const value = { ...read(profileId), ...next }
    window.localStorage.setItem(profileKey(profileId), JSON.stringify(value))
    setSettings(value)
    window.dispatchEvent(new Event(EVENT))
  }
  return { settings, update }
}
