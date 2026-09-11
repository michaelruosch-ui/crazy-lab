import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { EntitlementProvider, useEntitlement } from './EntitlementProvider'

function StatusProbe() {
  const { native, status } = useEntitlement()
  return <p>{native ? `${status.unlocked}:${status.price}` : 'web'}</p>
}

describe('native Freischaltung', () => {
  afterEach(() => {
    delete window.webkit
    delete window.crazyLabNativeResponse
  })

  it('liest den von StoreKit bestätigten Zustand genau über die native Brücke', async () => {
    window.webkit = {
      messageHandlers: {
        crazyLab: {
          postMessage(request) {
            window.setTimeout(() => {
              window.crazyLabNativeResponse?.({
                id: request.id,
                ok: true,
                value: { unlocked: false, productAvailable: true, price: 'CHF 1.00' },
              })
            }, 0)
          },
        },
      },
    }

    render(
      <EntitlementProvider>
        <StatusProbe />
      </EntitlementProvider>,
    )

    await waitFor(() => expect(screen.getByText('false:CHF 1.00')).toBeInTheDocument())
  })

  it('lässt die bestehende Familien-Webversion vollständig offen', () => {
    render(
      <EntitlementProvider>
        <StatusProbe />
      </EntitlementProvider>,
    )
    expect(screen.getByText('web')).toBeInTheDocument()
  })
})
