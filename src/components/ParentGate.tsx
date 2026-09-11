import { useState } from 'react'
import { hasNativeBridge, requestNativeParentAuthorization } from '../native/bridge'
import { Button } from './Button'
import './ParentGate.css'

interface ParentGateProps {
  open: boolean
  reason: string
  onAuthorized: () => void | Promise<void>
  onClose: () => void
}

interface Challenge {
  left: number
  right: number
  result: number
}

function createChallenge(): Challenge {
  const left = 6 + Math.floor(Math.random() * 4)
  const right = 7 + Math.floor(Math.random() * 3)
  return { left, right, result: left * right }
}

export function ParentGate({ open, reason, onAuthorized, onClose }: ParentGateProps) {
  const [challenge, setChallenge] = useState(createChallenge)
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const native = typeof window !== 'undefined' && hasNativeBridge()

  function resetAndClose() {
    setChallenge(createChallenge())
    setAnswer('')
    setMessage('')
    setBusy(false)
    onClose()
  }

  if (!open) return null

  async function authorize() {
    setBusy(true)
    try {
      const authorized = native
        ? await requestNativeParentAuthorization(reason)
        : Number(answer) === challenge.result
      if (!authorized) {
        setMessage('Das hat noch nicht geklappt. Bitte eine erwachsene Person holen.')
        if (!native) setChallenge(createChallenge())
        setAnswer('')
        return
      }
      await onAuthorized()
      resetAndClose()
    } catch {
      setMessage('Die Erwachsenenprüfung wurde abgebrochen. Es wurde nichts verändert.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="parent-gate" role="dialog" aria-modal="true" aria-labelledby="parent-title">
      <div className="parent-gate__card">
        <span className="parent-gate__icon" aria-hidden="true">
          🧑‍🔬🔐
        </span>
        <h2 id="parent-title">Eine erwachsene Person ist gefragt</h2>
        <p>{reason}</p>
        {native ? (
          <p className="parent-gate__hint">
            Crazy Lab verwendet Face ID, Touch ID oder den Gerätecode. Es sieht und speichert kein
            Gesicht und keinen Fingerabdruck.
          </p>
        ) : (
          <label className="parent-gate__challenge">
            Erwachsene: Wie viel ist {challenge.left} × {challenge.right}?
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              aria-label="Antwort der Erwachsenen"
              autoFocus
            />
          </label>
        )}
        {message && <p className="parent-gate__message">{message}</p>}
        <div className="parent-gate__actions">
          <Button
            variant="primary"
            onClick={() => void authorize()}
            disabled={busy || (!native && !answer)}
          >
            {native ? 'Mit dem Gerät bestätigen' : 'Antwort prüfen'}
          </Button>
          <Button variant="ghost" onClick={resetAndClose} disabled={busy}>
            Abbrechen
          </Button>
        </div>
      </div>
    </div>
  )
}
