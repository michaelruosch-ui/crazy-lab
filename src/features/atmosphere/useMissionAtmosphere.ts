import { useEffect, useRef, useState } from 'react'
import type { MissionCategory } from '../../domain'
import { audioContextClass, playAtmosphereBeat } from './magicSounds'

export function useMissionAtmosphere(category: MissionCategory, allowed: boolean) {
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState('')
  const contextRef = useRef<AudioContext | undefined>(undefined)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const noteRef = useRef(0)

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = undefined
    void contextRef.current?.close()
    contextRef.current = undefined
    setPlaying(false)
  }

  useEffect(() => stop, [])
  const toggle = async () => {
    if (playing) {
      stop()
      return
    }
    if (!allowed) return

    const AudioContextClass = audioContextClass()
    if (!AudioContextClass) {
      setError('Dieses Gerät kann die Labormusik leider nicht abspielen.')
      return
    }

    try {
      const context = new AudioContextClass()
      contextRef.current = context
      if (context.state === 'suspended') await context.resume()
      if (context.state !== 'running') throw new Error('AudioContext konnte nicht starten')
      setError('')
      playAtmosphereBeat(context, category, noteRef.current++)
      intervalRef.current = setInterval(() => {
        if (context.state === 'running') playAtmosphereBeat(context, category, noteRef.current++)
      }, 1220)
      setPlaying(true)
    } catch {
      void contextRef.current?.close()
      contextRef.current = undefined
      setPlaying(false)
      setError('Die Musik konnte nicht starten. Prüfe die Lautstärke und versuche es noch einmal.')
    }
  }
  return { playing, toggle, stop, error }
}
