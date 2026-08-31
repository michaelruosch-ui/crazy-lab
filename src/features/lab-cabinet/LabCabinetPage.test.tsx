import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetDbConnection } from '../../storage/db'
import { LabCabinetPage } from './LabCabinetPage'

describe('LabCabinetPage', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    resetDbConnection()
  })

  it('fügt ein vorbereitetes Missionsmaterial hinzu und zeigt die Mengenwahl', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LabCabinetPage />
      </MemoryRouter>,
    )

    const search = screen.getByRole('searchbox', { name: 'Material suchen' })
    await user.type(search, 'Vanillesirup')
    await user.click(await screen.findByRole('button', { name: '+ Vanillesirup' }))

    expect(await screen.findByRole('heading', { name: 'Vanillesirup' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Genug' })).toHaveClass('active')
    expect(screen.getByLabelText('Genaue Bezeichnung für Vanillesirup')).toBeInTheDocument()
  })

  it('nimmt ein eigenes Material auf und ordnet es verständlich ein', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LabCabinetPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Eigenes Material'), 'Wattestäbchen')
    await user.click(screen.getByRole('button', { name: 'Eigenes Material aufnehmen' }))

    expect(await screen.findByRole('heading', { name: 'Wattestäbchen' })).toBeInTheDocument()
    expect(screen.getByText('✨ Als Bastelmaterial eingeordnet')).toBeInTheDocument()
  })
})
