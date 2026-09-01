import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StepRunner } from './StepRunner'
import { missions } from '../../data/missions'

const mission = missions.find((m) => m.id === 'mission-blutroter-schatten-trank')!

describe('StepRunner', () => {
  it('zeigt vor der Mission einen überspringbaren Countdown', async () => {
    const user = userEvent.setup()
    render(<StepRunner mission={mission} onAllStepsDone={vi.fn()} onExit={vi.fn()} showCountdown />)
    expect(screen.getByText('Mission startet in')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Countdown überspringen' }))
    expect(screen.getByText('Schritt 1 von 6')).toBeInTheDocument()
  })
  it('lässt Schritte abhaken', async () => {
    const user = userEvent.setup()
    render(<StepRunner mission={mission} onAllStepsDone={vi.fn()} onExit={vi.fn()} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('zeigt bei Hilfe den zur Mission bzw. zum Schritt passenden Tipp', async () => {
    const user = userEvent.setup()
    render(<StepRunner mission={mission} onAllStepsDone={vi.fn()} onExit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Hilfe!' }))

    expect(screen.getByText(mission.generalHelpTip)).toBeInTheDocument()
  })

  it('erlaubt Mission-Abschluss erst, wenn alle Schritte abgehakt sind', async () => {
    const user = userEvent.setup()
    const onAllStepsDone = vi.fn()
    render(<StepRunner mission={mission} onAllStepsDone={onAllStepsDone} onExit={vi.fn()} />)

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

  it('ruft onExit auf, wenn bei Schritt 1 "Zurück" gedrückt wird', async () => {
    const user = userEvent.setup()
    const onExit = vi.fn()
    render(<StepRunner mission={mission} onAllStepsDone={vi.fn()} onExit={onExit} />)

    await user.click(screen.getByRole('button', { name: 'Zurück' }))

    expect(onExit).toHaveBeenCalledOnce()
  })

  it('geht bei "Zurück" ab Schritt 2 zum vorherigen Schritt statt onExit aufzurufen', async () => {
    const user = userEvent.setup()
    const onExit = vi.fn()
    render(<StepRunner mission={mission} onAllStepsDone={vi.fn()} onExit={onExit} />)

    await user.click(screen.getByRole('button', { name: 'Weiter' }))
    expect(screen.getByText('Schritt 2 von 6')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Zurück' }))

    expect(onExit).not.toHaveBeenCalled()
    expect(screen.getByText('Schritt 1 von 6')).toBeInTheDocument()
  })

  it('setzt ein laufendes Experiment an der ersten offenen Stelle fort', () => {
    const experiment = missions.find((item) => item.id === 'mission-experiment-salzkristall-geist')!
    render(
      <StepRunner
        mission={experiment}
        onAllStepsDone={vi.fn()}
        onExit={vi.fn()}
        initialCheckedStepIds={['step-1', 'step-2']}
        onPause={vi.fn()}
      />,
    )
    expect(screen.getByText('Schritt 3 von 4')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '⏸ Versuch pausieren' })).toBeInTheDocument()
  })
})
