import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('startet nicht automatisch', () => {
    const { result } = renderHook(() => useTimer(60))
    expect(result.current.running).toBe(false)
    expect(result.current.remainingSeconds).toBe(60)

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.remainingSeconds).toBe(60)
  })

  it('zählt nach bewusstem Start herunter', () => {
    const { result } = renderHook(() => useTimer(10))

    act(() => {
      result.current.start()
    })
    expect(result.current.running).toBe(true)

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.remainingSeconds).toBe(7)
  })

  it('kann pausiert und zurückgesetzt werden', () => {
    const { result } = renderHook(() => useTimer(10))

    act(() => {
      result.current.start()
    })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.remainingSeconds).toBe(8)

    act(() => {
      result.current.pause()
    })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.remainingSeconds).toBe(8)
    expect(result.current.running).toBe(false)

    act(() => {
      result.current.reset()
    })
    expect(result.current.remainingSeconds).toBe(10)
  })
})
