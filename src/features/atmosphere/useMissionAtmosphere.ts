import { useEffect, useRef, useState } from 'react'
import type { MissionCategory } from '../../domain'

const NOTES: Record<MissionCategory, number[]> = {
  getraenk: [261.6, 329.6, 392],
  basteln: [220, 293.7, 349.2],
  experiment: [196, 246.9, 370],
  foto: [293.7, 440, 523.3],
  schwestern: [261.6, 392, 493.9],
}

export function useMissionAtmosphere(category: MissionCategory, allowed: boolean) {
  const [playing, setPlaying] = useState(false)
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
  const playNote = (context: AudioContext) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = NOTES[category][noteRef.current++ % NOTES[category].length]!
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.7)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.75)
  }

  const toggle = () => {
    if (playing) {
      stop()
      return
    }
    const AudioContextClass = window.AudioContext
    if (!AudioContextClass || !allowed) return
    const context = new AudioContextClass()
    contextRef.current = context
    playNote(context)
    intervalRef.current = setInterval(() => playNote(context), 1150)
    setPlaying(true)
  }
  return { playing, toggle, stop }
}
