import { useState } from 'react'
import type { Mission } from '../../domain'
import { Button, MissionImage, ParentGate } from '../../components'
import { useEntitlement } from './EntitlementProvider'
import './MissionPaywall.css'
import { useLanguage } from '../../i18n'

export function MissionPaywall({ mission }: { mission: Mission }) {
  const { t } = useLanguage()
  const { status, loading, message, purchase, restore } = useEntitlement()
  const [gateAction, setGateAction] = useState<'purchase' | 'restore' | null>(null)

  return (
    <section className="mission-paywall" aria-labelledby="mission-paywall-title">
      <div className="mission-paywall__image">
        <MissionImage placeholder={mission.imagePlaceholder} title={mission.title} />
        <span aria-hidden="true">🔒</span>
      </div>
      <p className="mission-paywall__eyebrow">{t('fullVersionEyebrow')}</p>
      <h1 id="mission-paywall-title">{mission.title}</h1>
      <p>{t('fullVersionDescription')}</p>
      <div className="mission-paywall__price">
        <strong>Einmalig {status.price || 'CHF 1.00'}</strong>
        <span>{t('fullVersionPermanent')}</span>
      </div>
      <Button variant="primary" onClick={() => setGateAction('purchase')} disabled={loading}>
        {t('fullVersionUnlock')}
      </Button>
      <Button variant="ghost" onClick={() => setGateAction('restore')} disabled={loading}>
        {t('restorePurchase')}
      </Button>
      {message && (
        <p className="mission-paywall__message" role="status">
          {message}
        </p>
      )}
      <p className="mission-paywall__small">{t('freeMissionsHint')}</p>
      <ParentGate
        open={gateAction !== null}
        reason={t(gateAction === 'restore' ? 'restoreGateReason' : 'purchaseGateReason')}
        onAuthorized={gateAction === 'restore' ? restore : purchase}
        onClose={() => setGateAction(null)}
      />
    </section>
  )
}
