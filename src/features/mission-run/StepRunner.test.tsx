import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StepRunner } from './StepRunner'
import { missions } from '../../data/missions'

const mission = missions.find((m) => m.id === 'mission-blutroter-schatten-trank')!

describe('StepRunner', () => {
  it('lässt Schritte abhaken', async () => {
    const user = userEvent.setup()
    render(<StepRunner mission={mission} onAllStepsDone={vi.fn()} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('zeigt bei Hilfe den zur Mission bzw. zum Schritt passenden Tipp', async () => {
    const user = userEvent.setup()
    render(<StepRunner mission={mission} onAllStepsDone={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Hilfe!' }))

    expect(screen.getByText(mission.generalHelpTip)).toBeInTheDocument()
  })

  it('erlaubt Mission-Abschluss erst, wenn alle Schritte abgehakt sind', async () => {
    const user = userEvent.setup()
    const onAllStepsDone = vi.fn()
    render(<StepRunner mission={mission} onAllStepsDone={onAllStepsDone} />)

    for (let i = 0; i < mission.steps.length; i++) {
      await user.click(screen.getByRole('checkbox'))
      if (i < mission.steps.length - 1) {
        await user.click(screen.getByRole('button', { name: 'Weiter' }))
      }
    }

    const finishButton = screen.getByRole('button', { name: 'Mission abschliessen' })
    expect(finishButton).toBeEnabled()

    await user.click(finishButton)
    expect(onAllStepsDone).toHaveBeenCalledOnce()
  })
})
