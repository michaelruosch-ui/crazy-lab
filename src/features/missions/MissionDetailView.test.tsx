import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { missions } from '../../data'
import { MissionDetailView } from './MissionDetailView'

describe('MissionDetailView für Getränke', () => {
  it('zeigt Geschmacks- und Optikmerkmale sowie zwei Varianten', () => {
    const mission = missions.find((item) => item.id === 'mission-tuerkiser-geisternebel')
    if (!mission) throw new Error('Testmission fehlt')

    render(<MissionDetailView mission={mission} onStart={vi.fn()} />)

    expect(screen.getByText('Süss')).toBeInTheDocument()
    expect(screen.getByText('Cremig')).toBeInTheDocument()
    expect(screen.getByText('türkis')).toBeInTheDocument()
    expect(screen.getByText(/Violetter Nebel/)).toBeInTheDocument()
    expect(screen.getByText(/Frostgeist/)).toBeInTheDocument()
  })
})
