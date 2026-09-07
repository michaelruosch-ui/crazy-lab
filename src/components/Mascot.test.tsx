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
    expect(container.querySelectorAll('.mascot__background')).toHaveLength(33)
    expect(container.querySelectorAll('.mascot__sprite')).toHaveLength(33)
    expect(
      new Set(
        [...container.querySelectorAll<HTMLImageElement>('.mascot__sprite')].map(
          (image) => image.src,
        ),
      ).size,
    ).toBe(8)
    expect(container.querySelector('.mascot--spooky')).not.toBeInTheDocument()
  })

  it('markiert die Auswahl für die einmalige Bewegung', () => {
    render(<Mascot mascotId="nachtbaer" selected />)
    expect(screen.getByRole('img', { name: 'Nachtbär' })).toHaveClass('mascot--selected')
  })

  it('hält den Laborhintergrund ausserhalb der animierten Figurenebene', () => {
    const { container } = render(<Mascot mascotId="nachtbaer" selected />)
    const mascot = container.querySelector('.mascot')!
    const background = mascot.querySelector('.mascot__background')!
    const sprite = mascot.querySelector('.mascot__sprite')!
    expect(background.parentElement).toBe(mascot)
    expect(sprite.closest('.mascot__sprite-window')).toBeInTheDocument()
  })
})
