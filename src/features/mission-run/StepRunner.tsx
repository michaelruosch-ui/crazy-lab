import { useState } from 'react'
import type { MascotVariant, Mission } from '../../domain'
import { findStepHelpTip } from '../../domain'
import { Button, SpeechBubble } from '../../components'
import { Timer } from './Timer'
import './StepRunner.css'

interface StepRunnerProps {
  mission: Mission
  onAllStepsDone: () => void
  onExit: () => void
  mascotVariant?: MascotVariant
}

export function StepRunner({ mission, onAllStepsDone, onExit, mascotVariant }: StepRunnerProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [helpVisible, setHelpVisible] = useState(false)

  const steps = mission.steps
  const currentStep = steps[currentIndex]
  const allDone = checkedSteps.size === steps.length

  if (!currentStep) return null

  function toggleStepChecked(stepId: string) {
    setCheckedSteps((current) => {
      const next = new Set(current)
      if (next.has(stepId)) next.delete(stepId)
      else next.add(stepId)
      return next
    })
  }

  function goToStep(index: number) {
    setHelpVisible(false)
    setCurrentIndex(Math.min(Math.max(index, 0), steps.length - 1))
  }

  return (
    <div className="step-runner">
      <ol className="step-runner__progress" aria-label="Fortschritt">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`step-runner__dot ${checkedSteps.has(step.id) ? 'step-runner__dot--done' : ''} ${
              index === currentIndex ? 'step-runner__dot--active' : ''
            }`}
            aria-current={index === currentIndex}
          />
        ))}
      </ol>

      <div className="step-runner__card">
        <p className="step-runner__step-number">
          Schritt {currentIndex + 1} von {steps.length}
        </p>
        <label className="step-runner__step-text">
          <input
            type="checkbox"
            checked={checkedSteps.has(currentStep.id)}
            onChange={() => toggleStepChecked(currentStep.id)}
          />
          <span>{currentStep.text}</span>
        </label>

        {currentStep.timerSeconds !== undefined && (
          <Timer key={currentStep.id} totalSeconds={currentStep.timerSeconds} />
        )}

        {helpVisible && (
          <SpeechBubble text={findStepHelpTip(mission, currentStep.id)} mascotVariant={mascotVariant} />
        )}
      </div>

      <div className="step-runner__actions">
        <Button variant="ghost" onClick={() => setHelpVisible((v) => !v)}>
          {helpVisible ? 'Hilfe schliessen' : 'Hilfe!'}
        </Button>
        <div className="step-runner__nav">
          <Button
            variant="secondary"
            onClick={() => (currentIndex === 0 ? onExit() : goToStep(currentIndex - 1))}
          >
            Zurück
          </Button>
          {currentIndex < steps.length - 1 ? (
            <Button variant="primary" onClick={() => goToStep(currentIndex + 1)}>
              Weiter
            </Button>
          ) : (
            <Button variant="primary" onClick={onAllStepsDone} disabled={!allDone}>
              Mission abschliessen
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
