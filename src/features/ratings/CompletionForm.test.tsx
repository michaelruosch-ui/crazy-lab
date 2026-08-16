import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CompletionForm } from './CompletionForm'
import { missions } from '../../data/missions'

const drinkMission = missions.find((m) => m.id === 'mission-blutroter-schatten-trank')!

describe('CompletionForm', () => {
  it('speichert strukturierte Anpassungswünsche korrekt', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CompletionForm mission={drinkMission} onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Gruseliger' }))
    await user.click(screen.getByRole('button', { name: 'Weniger süss' }))
    await user.type(screen.getByLabelText('Name deiner Erfindung'), 'Elenas Trank')
    await user.click(screen.getByRole('button', { name: 'Im Labortagebuch speichern' }))

    expect(onSubmit).toHaveBeenCalledOnce()
    const rating = onSubmit.mock.calls[0]![0]
    expect(rating.adjustments.sort()).toEqual(['gruseliger', 'weniger_suess'])
    expect(rating.inventionName).toBe('Elenas Trank')
    expect(rating.result).toBe(5)
    expect(rating.taste).toBe(5)
    expect(rating.difficultyFeedback).toBe('genau_richtig')
    expect(rating.wouldRepeat).toBe(true)
    expect(rating.wouldRecommend).toBe(true)
    expect(rating.stamp).toBe('geheimnisvoll')
  })

  it('erfasst Geschmack nur bei Getränke-Missionen', () => {
    render(<CompletionForm mission={drinkMission} onSubmit={vi.fn()} />)
    expect(screen.getByText('Geschmack')).toBeInTheDocument()
  })
})
