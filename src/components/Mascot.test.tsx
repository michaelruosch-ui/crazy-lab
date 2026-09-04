import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Mascot } from './Mascot'
import { MASCOT_CATALOG } from './mascotArt'

describe('hochwertige Maskottchen', () => {
  it('zeigt alle 33 vorhandenen Maskottchen als neue Bildfiguren', () => {
    const { container } = render(
      <>
        {MASCOT_CATALOG.map((entry) => (
          <Mascot key={entry.id} mascotId={entry.id} />
        ))}
      </>,
    )
    expect(screen.getAllByRole('img')).toHaveLength(33)
    expect(container.querySelectorAll('.mascot__image')).toHaveLength(33)
    expect(new Set([...container.querySelectorAll('img')].map((image) => image.src)).size).toBe(8)
  })

  it('markiert die Auswahl für die einmalige Bewegung', () => {
    render(<Mascot mascotId="nachtbaer" selected />)
    expect(screen.getByRole('img', { name: 'Nachtbär' })).toHaveClass('mascot--selected')
  })
})
