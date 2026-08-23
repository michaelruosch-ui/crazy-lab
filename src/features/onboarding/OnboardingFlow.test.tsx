import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OnboardingFlow } from './OnboardingFlow'

describe('OnboardingFlow', () => {
  it('lässt ein Maskottchen wählen und einen Forschernamen eingeben', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OnboardingFlow onComplete={onComplete} />)

    await user.click(screen.getByRole('radio', { name: /Vampir/ }))
    await user.click(screen.getByRole('button', { name: 'Weiter' }))

    const nameInput = screen.getByPlaceholderText('Dein Forschername')
    await user.clear(nameInput)
    await user.type(nameInput, 'Dr. Schrecklich')
    await user.click(screen.getByRole('button', { name: "Los geht's ins Labor!" }))

    expect(onComplete).toHaveBeenCalledOnce()
    const profile = onComplete.mock.calls[0]![0]
    expect(profile.mascotVariant).toBe('vampir')
    expect(profile.researcherName).toBe('Dr. Schrecklich')
    expect(profile.birthdays).toEqual([])
    expect(profile.onboardingCompletedAt).toBeTruthy()
  })

  it('fällt auf den Standardnamen zurück, wenn das Feld leer gelassen wird', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OnboardingFlow onComplete={onComplete} />)

    await user.click(screen.getByRole('button', { name: 'Weiter' }))
    const nameInput = screen.getByPlaceholderText('Dein Forschername')
    await user.clear(nameInput)
    await user.click(screen.getByRole('button', { name: "Los geht's ins Labor!" }))

    const profile = onComplete.mock.calls[0]![0]
    expect(profile.researcherName).toBe('Elena')
  })
})
