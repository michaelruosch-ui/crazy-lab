import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PublicationCodeGate } from './PublicationCodeGate'

describe('Code-Sperre für Missionsfreigaben', () => {
  beforeEach(() => {
    const data = new Map<string, string>()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => data.set(key, value),
        removeItem: (key: string) => data.delete(key),
        clear: () => data.clear(),
      },
    })
  })

  it('sperrt die Eingabe nach drei falschen Codes auch über ein erneutes Öffnen hinaus', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { unmount } = render(
      <PublicationCodeGate missionTitle="Testmission" onAuthorized={vi.fn()} onClose={onClose} />,
    )

    for (const wrongCode of ['1111', '2222', '3333']) {
      await user.type(screen.getByLabelText('Vierstelliger Code'), wrongCode)
      await user.click(screen.getByRole('button', { name: 'Code prüfen und freigeben' }))
    }

    expect(screen.getByText('⏳ Code-Eingabe gesperrt')).toBeInTheDocument()
    expect(screen.getByText(/Versuche es in 10:00 wieder/)).toBeInTheDocument()
    unmount()

    render(
      <PublicationCodeGate missionTitle="Testmission" onAuthorized={vi.fn()} onClose={onClose} />,
    )
    expect(screen.getByText('⏳ Code-Eingabe gesperrt')).toBeInTheDocument()
    expect(screen.queryByLabelText('Vierstelliger Code')).not.toBeInTheDocument()
  })
})
