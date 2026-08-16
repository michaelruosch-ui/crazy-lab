import { useCallback, useEffect, useRef, useState } from 'react'

export interface TimerState {
  remainingSeconds: number
  running: boolean
  finished: boolean
  start: () => void
  pause: () => void
  reset: () => void
}

/** Manueller Timer: startet ausschliesslich nach bewusstem Klick auf `start`. */
export function useTimer(totalSeconds: number): TimerState {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    if (!running) return

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          setRunning(false)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [running])

  const start = useCallback(() => {
    setRunning((current) => (remainingSeconds > 0 ? true : current))
  }, [remainingSeconds])

  const pause = useCallback(() => setRunning(false), [])

  const reset = useCallback(() => {
    setRunning(false)
    setRemainingSeconds(totalSeconds)
  }, [totalSeconds])

  return { remainingSeconds, running, finished: remainingSeconds === 0, start, pause, reset }
}
