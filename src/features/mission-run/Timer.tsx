import { useTimer } from './useTimer'
import { Button } from '../../components'
import './Timer.css'

interface TimerProps {
  totalSeconds: number
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function Timer({ totalSeconds }: TimerProps) {
  const timer = useTimer(totalSeconds)

  return (
    <div className="timer">
      <div className="timer__display" aria-live="polite">
        {formatTime(timer.remainingSeconds)}
      </div>
      <div className="timer__controls">
        {!timer.running && (
          <Button variant="primary" onClick={timer.start} disabled={timer.finished}>
            {timer.remainingSeconds === totalSeconds ? 'Timer starten' : 'Weiter'}
          </Button>
        )}
        {timer.running && (
          <Button variant="secondary" onClick={timer.pause}>
            Pause
          </Button>
        )}
        <Button variant="ghost" onClick={timer.reset}>
          Zurücksetzen
        </Button>
      </div>
      {timer.finished && <p className="timer__done">Zeit abgelaufen! ⏰</p>}
    </div>
  )
}
