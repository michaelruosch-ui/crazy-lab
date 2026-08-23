import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StampAnimation } from './StampAnimation'

describe('StampAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('zeigt den gewählten Stempel auf dem Blatt', () => {
    render(<StampAnimation stamp="genial" mascotId="blutiger-kuschelbaer" onDone={vi.fn()} />)
    expect(screen.getAllByText('⭐').length).toBeGreaterThan(0)
  })

  it('zeigt Blut nur bei einem blutigen Maskottchen', () => {
    const { container, rerender } = render(
      <StampAnimation stamp="geheimnisvoll" mascotId="blutiger-kuschelbaer" onDone={vi.fn()} />,
    )
    expect(container.querySelectorAll('.stamp-animation__blood').length).toBe(2)

    rerender(<StampAnimation stamp="geheimnisvoll" mascotId="frostbaer" onDone={vi.fn()} />)
    expect(container.querySelectorAll('.stamp-animation__blood').length).toBe(0)
  })

  it('ruft onDone nach Ablauf der Animation auf', () => {
    const onDone = vi.fn()
    render(<StampAnimation stamp="geheimnisvoll" mascotId="blutiger-kuschelbaer" onDone={onDone} />)

    expect(onDone).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1900)
    expect(onDone).toHaveBeenCalledOnce()
  })

  it('ruft onDone beim Antippen des Hintergrunds vorzeitig auf', async () => {
    const onDone = vi.fn()
    render(<StampAnimation stamp="geheimnisvoll" mascotId="blutiger-kuschelbaer" onDone={onDone} />)

    screen.getByRole('presentation').click()
    expect(onDone).toHaveBeenCalledOnce()
  })
})
