import { useEffect, useState } from 'react'
import {
  checkPublicationCode,
  EMPTY_PUBLICATION_CODE_STATE,
  normalizePublicationCodeState,
  type PublicationCodeState,
} from '../../domain'
import { Button } from '../../components'
import { useLanguage } from '../../i18n'
import './PublicationCodeGate.css'

const STORAGE_KEY = 'crazylab-publication-code-lock-v1'

function readState(now: number): PublicationCodeState {
  try {
    return normalizePublicationCodeState(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'), now)
  } catch {
    return EMPTY_PUBLICATION_CODE_STATE
  }
}

function saveState(state: PublicationCodeState) {
  try {
    if (state.failedAttempts === 0 && state.lockedUntil === 0) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Die Prüfung bleibt während der offenen App trotzdem aktiv.
  }
}

function remainingTime(lockedUntil: number, now: number): string {
  const seconds = Math.max(0, Math.ceil((lockedUntil - now) / 1000))
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

export function PublicationCodeGate({
  missionTitle,
  onAuthorized,
  onClose,
}: {
  missionTitle: string
  onAuthorized: () => void | Promise<void>
  onClose: () => void
}) {
  const { t } = useLanguage()
  const [answer, setAnswer] = useState('')
  const [state, setState] = useState(() => readState(Date.now()))
  const [now, setNow] = useState(Date.now)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const locked = state.lockedUntil > now

  useEffect(() => {
    if (!locked) return
    const timer = window.setInterval(() => {
      const currentNow = Date.now()
      setNow(currentNow)
      if (state.lockedUntil <= currentNow) {
        setState(EMPTY_PUBLICATION_CODE_STATE)
        saveState(EMPTY_PUBLICATION_CODE_STATE)
        setMessage(t('publicationCodeReady'))
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [locked, state.lockedUntil, t])

  async function verify() {
    const result = checkPublicationCode(answer, state, Date.now())
    setState(result.state)
    saveState(result.state)
    setAnswer('')
    if (result.status === 'retry') {
      setMessage(t('publicationCodeWrong').replace('{count}', String(result.remainingAttempts)))
      return
    }
    if (result.status === 'locked') {
      setNow(Date.now())
      setMessage(t('publicationCodeLockedMessage'))
      return
    }
    setBusy(true)
    try {
      await onAuthorized()
      setMessage('')
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="publication-code-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-title"
    >
      <div className="publication-code-gate__card">
        <span className="publication-code-gate__icon" aria-hidden="true">
          🧪🔐
        </span>
        <h2 id="code-title">{t('publicationCodeTitle')}</h2>
        <p>{t('publicationCodeReason').replace('{title}', missionTitle)}</p>
        {locked ? (
          <div className="publication-code-gate__locked" role="alert">
            <strong>{t('publicationCodeLocked')}</strong>
            <span>
              {t('publicationCodeRetryTime').replace(
                '{time}',
                remainingTime(state.lockedUntil, now),
              )}
            </span>
          </div>
        ) : (
          <label>
            {t('publicationCodeLabel')}
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              autoComplete="off"
              value={answer}
              onChange={(event) => setAnswer(event.target.value.replace(/\D/g, '').slice(0, 4))}
              autoFocus
            />
          </label>
        )}
        {message && <p className="publication-code-gate__message">{message}</p>}
        <div className="publication-code-gate__actions">
          {!locked && (
            <Button
              variant="primary"
              onClick={() => void verify()}
              disabled={busy || answer.length !== 4}
            >
              {t('publicationCodeUnlock')}
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {t('publicationCodeCancel')}
          </Button>
        </div>
      </div>
    </div>
  )
}
