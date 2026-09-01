import { useEffect, useState } from 'react'
import type { MascotId, Mission } from '../../domain'
import { findStepHelpTip } from '../../domain'
import { Button, SpeechBubble } from '../../components'
import { Timer } from './Timer'
import './StepRunner.css'
import { useAtmosphereSettings, useMissionAtmosphere } from '../atmosphere'

interface StepRunnerProps {
  mission: Mission
  onAllStepsDone: () => void
  onExit: () => void
  mascotId?: MascotId
  initialCheckedStepIds?: string[]
  onProgress?: (checkedStepIds: string[]) => void
  onPause?: () => void
  showCountdown?: boolean
  profileId?: string
}

export function StepRunner({
  mission,
  onAllStepsDone,
  onExit,
  mascotId,
  initialCheckedStepIds = [],
  onProgress,
  onPause,
  showCountdown = false,
  profileId,
}: StepRunnerProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set(initialCheckedStepIds))
  const [currentIndex, setCurrentIndex] = useState(() => {
    const firstOpen = mission.steps.findIndex((step) => !initialCheckedStepIds.includes(step.id))
    return firstOpen < 0 ? mission.steps.length - 1 : firstOpen
  })
  const [helpVisible, setHelpVisible] = useState(false)
  const [countdown, setCountdown] = useState(showCountdown ? 3 : 0)
  const { settings } = useAtmosphereSettings(profileId)
  const atmosphere = useMissionAtmosphere(mission.primaryCategory, settings.soundEnabled)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((value) => value - 1), 850)
    return () => clearTimeout(timer)
  }, [countdown])

  const steps = mission.steps
  const currentStep = steps[currentIndex]
  const allDone = checkedSteps.size === steps.length
  const specialTimerSeconds =
    currentIndex === 2 ? mission.sisterProfile?.timeChallengeSeconds : undefined

  if (!currentStep) return null

  if (countdown > 0)
    return (
      <div className="mission-countdown" role="status" aria-live="assertive">
        <p>Mission startet in</p>
        <strong>{countdown}</strong>
        <Button variant="ghost" onClick={() => setCountdown(0)}>
          Countdown überspringen
        </Button>
      </div>
    )

  function toggleStepChecked(stepId: string) {
    setCheckedSteps((current) => {
      const next = new Set(current)
      if (next.has(stepId)) next.delete(stepId)
      else next.add(stepId)
      onProgress?.([...next])
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

        {(currentStep.timerSeconds !== undefined || specialTimerSeconds !== undefined) && (
          <Timer
            key={currentStep.id}
            totalSeconds={currentStep.timerSeconds ?? specialTimerSeconds ?? 0}
          />
        )}

        {helpVisible && (
          <SpeechBubble text={findStepHelpTip(mission, currentStep.id)} mascotId={mascotId} />
        )}
      </div>

      <div className="step-runner__actions">
        <Button variant="ghost" onClick={atmosphere.toggle} disabled={!settings.soundEnabled}>
          {atmosphere.playing
            ? '🔇 Labormusik aus'
            : settings.soundEnabled
              ? '🎵 Labormusik an'
              : '🔇 Musik im Profil ausgeschaltet'}
        </Button>
        {onPause && (
          <Button variant="ghost" onClick={onPause}>
            ⏸ Versuch pausieren
          </Button>
        )}
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
