import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LabCabinetPage } from './LabCabinetPage'

describe('LabCabinetPage', () => {
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
})
