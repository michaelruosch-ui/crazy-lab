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

describe('MissionDetailView für Sprints 12 bis 14', () => {
  it('erlaubt bei Bastelmissionen ausdrücklich unterschiedliche Figuren oder keine Figur', () => {
    const mission = missions.find((item) => item.id === 'mission-playmobil-geisterbett')!
    render(<MissionDetailView mission={mission} onStart={vi.fn()} />)
    expect(screen.getByText('🧸 Deine Figuren, deine Wahl')).toBeInTheDocument()
    expect(screen.getByText(/Tierfigur, Puppe, Bausteinfigur/)).toBeInTheDocument()
  })

  it('zeigt Forschungsfrage und mehrtägige Dauer', () => {
    const mission = missions.find((item) => item.id === 'mission-experiment-salzkristall-geist')!
    render(<MissionDetailView mission={mission} onStart={vi.fn()} />)
    expect(screen.getByText('🔬 Deine Forschungsfrage')).toBeInTheDocument()
    expect(screen.getByText('Läuft 3 Tage')).toBeInTheDocument()
  })

  it('zeigt Foto-Tipps sowie die getrennten Geheimaufträge', () => {
    const photo = missions.find((item) => item.id === 'mission-foto-riesen-schatten')!
    const sisters = missions.find((item) => item.id === 'mission-schwestern-monster-bau')!
    const { unmount } = render(<MissionDetailView mission={photo} onStart={vi.fn()} />)
    expect(screen.getByText('📷 Foto-Tipps')).toBeInTheDocument()
    unmount()
    render(<MissionDetailView mission={sisters} onStart={vi.fn()} />)
    expect(screen.getByText('Elenas Geheimauftrag')).toBeInTheDocument()
    expect(screen.getByText('Geheimauftrag der Schwester')).toBeInTheDocument()
  })
})
