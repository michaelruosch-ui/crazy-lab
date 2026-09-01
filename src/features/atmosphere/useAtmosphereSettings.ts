import { useEffect, useState } from 'react'

export interface AtmosphereSettings {
  soundEnabled: boolean
  animationsEnabled: boolean
}
const KEY = 'crazylab-atmosphere-settings'
const EVENT = 'crazylab-atmosphere-change'
const DEFAULTS: AtmosphereSettings = { soundEnabled: true, animationsEnabled: true }

function read(): AtmosphereSettings {
  try {
    return { ...DEFAULTS, ...JSON.parse(window.localStorage.getItem(KEY) ?? '{}') }
  } catch {
    return DEFAULTS
  }
}

export function useAtmosphereSettings() {
  const [settings, setSettings] = useState(read)
  useEffect(() => {
    const sync = () => setSettings(read())
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])
  const update = (next: Partial<AtmosphereSettings>) => {
    const value = { ...read(), ...next }
    window.localStorage.setItem(KEY, JSON.stringify(value))
    setSettings(value)
    window.dispatchEvent(new Event(EVENT))
  }
  return { settings, update }
}
