import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ParentGate } from './ParentGate'

describe('Elternschranke', () => {
  beforeEach(() => vi.spyOn(Math, 'random').mockReturnValue(0))

  it('führt eine geschützte Aktion erst nach der richtigen Erwachsenenfrage aus', async () => {
    const authorized = vi.fn()
    const user = userEvent.setup()
    render(
      <ParentGate
        open
        reason="Diese Aktion ist geschützt."
        onAuthorized={authorized}
        onClose={() => undefined}
      />,
    )

    await user.type(screen.getByLabelText('Antwort der Erwachsenen'), '41')
    await user.click(screen.getByRole('button', { name: 'Antwort prüfen' }))
    expect(authorized).not.toHaveBeenCalled()
    expect(screen.getByText(/erwachsene Person holen/)).toBeVisible()

    await user.type(screen.getByLabelText('Antwort der Erwachsenen'), '42')
    await user.click(screen.getByRole('button', { name: 'Antwort prüfen' }))
    expect(authorized).toHaveBeenCalledOnce()
  })
})
