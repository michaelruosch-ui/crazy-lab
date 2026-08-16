import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { App } from './App'
import { resetDbConnection } from './storage/db'

describe('App', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('zeigt beim Start direkt die Beispielmission (Render-Smoke-Test)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Der blutrote Schatten-Trank' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Alles bereit für die Mission?' })).toBeInTheDocument()
  })
})
