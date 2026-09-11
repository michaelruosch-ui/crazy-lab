import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '../../i18n'
import { PrivacyPage } from './PrivacyPage'

describe('Kinder-Datenschutz', () => {
  it('erklärt lokal gespeicherte und ausdrücklich nicht verarbeitete Daten', () => {
    render(
      <MemoryRouter>
        <LanguageProvider language="de" onLanguageChange={() => undefined}>
          <PrivacyPage />
        </LanguageProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Für Kinder kurz erklärt' })).toBeVisible()
    expect(screen.getByText(/Fotos und kurze Videos/)).toBeVisible()
    expect(screen.getByText(/keine automatische Cloud/)).toBeVisible()
    expect(screen.getByText(/keine Gesichtsbilder oder Fingerabdrücke/)).toBeVisible()
  })

  it('enthält die Kindererklärung auch auf Englisch', () => {
    render(
      <MemoryRouter>
        <LanguageProvider language="en" onLanguageChange={() => undefined}>
          <PrivacyPage />
        </LanguageProvider>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'A short explanation for children' })).toBeVisible()
    expect(screen.getByText(/no automatic cloud/)).toBeVisible()
  })
})
