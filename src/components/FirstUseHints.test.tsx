import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { LanguageProvider } from '../i18n'
import { FirstUseHints } from './FirstUseHints'

describe('übersetzter Labortipp', () => {
  beforeEach(() => {
    const data = new Map<string, string>()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => data.set(key, value),
        clear: () => data.clear(),
      },
    })
  })

  it('übersetzt Überschrift, Inhalt und Verstanden-Knopf', () => {
    render(
      <LanguageProvider language="en" onLanguageChange={() => undefined}>
        <FirstUseHints profileId="elena" />
      </LanguageProvider>,
    )
    expect(screen.getByText('Lab tip:')).toBeInTheDocument()
    expect(screen.getByText(/Use the globe/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument()
  })
})
