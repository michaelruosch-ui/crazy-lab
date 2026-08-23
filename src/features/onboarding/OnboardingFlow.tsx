import { useState } from 'react'
import type { MascotId, Profile } from '../../domain'
import { DEFAULT_PROFILE } from '../../domain'
import { Button, Mascot, MascotPicker } from '../../components'
import './OnboardingFlow.css'

type Step = 'mascot' | 'name'

interface OnboardingFlowProps {
  onComplete: (profile: Profile) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('mascot')
  const [mascotVariant, setMascotVariant] = useState<MascotId>(DEFAULT_PROFILE.mascotVariant)
  const [researcherName, setResearcherName] = useState(DEFAULT_PROFILE.researcherName)

  function finish() {
    const now = new Date().toISOString()
    onComplete({
      id: DEFAULT_PROFILE.id,
      researcherName: researcherName.trim() || DEFAULT_PROFILE.researcherName,
      mascotVariant,
      birthdays: [],
      createdAt: now,
      onboardingCompletedAt: now,
    })
  }

  if (step === 'mascot') {
    return (
      <div className="onboarding">
        <h1>🔮 Willkommen im Crazy Lab!</h1>
        <p>Bevor es losgeht: Wähle dein Labor-Maskottchen aus. Du kannst es später jederzeit ändern.</p>
        <MascotPicker value={mascotVariant} onChange={setMascotVariant} />
        <Button variant="primary" onClick={() => setStep('name')}>
          Weiter
        </Button>
      </div>
    )
  }

  return (
    <div className="onboarding">
      <div className="onboarding__mascot-preview">
        <Mascot mascotId={mascotVariant} size="large" />
      </div>
      <h1>Wie sollen wir dich nennen?</h1>
      <p>Dein Forschername kann dein echter Name sein oder ein geheimer Codename - was du willst.</p>
      <input
        className="onboarding__input"
        value={researcherName}
        onChange={(e) => setResearcherName(e.target.value)}
        placeholder="Dein Forschername"
        maxLength={30}
      />
      <Button variant="primary" onClick={finish}>
        Los geht's ins Labor!
      </Button>
    </div>
  )
}
