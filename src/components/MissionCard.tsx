import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Mission } from '../domain'
import { Badge } from './Badge'
import { MissionImage } from './MissionImage'
import { useLanguage, type TranslationKey } from '../i18n'
import './MissionCard.css'
import { isMissionFree } from '../domain'
import { useEntitlement } from '../features/entitlements'

const DIFFICULTY_KEYS: Record<Mission['difficulty'], TranslationKey> = {
  leicht: 'difficultyEasy',
  mittel: 'difficultyMedium',
  schwer: 'difficultyHard',
}

interface MissionCardProps {
  mission: Mission
  actions?: ReactNode
  featured?: boolean
}

export function MissionCard({ mission, actions, featured = false }: MissionCardProps) {
  const { t } = useLanguage()
  const entitlement = useEntitlement()
  const locked = entitlement.native && !entitlement.status.unlocked && !isMissionFree(mission)
  return (
    <div className={`mission-card ${featured ? 'mission-card--featured' : ''}`}>
      <Link to={`/mission/${mission.id}`} className="mission-card__link">
        <div className="mission-card__image">
          <MissionImage placeholder={mission.imagePlaceholder} title={mission.title} />
          {locked && (
            <span className="mission-card__lock" aria-label="In der Vollversion">
              🔒
            </span>
          )}
        </div>
        <div className="mission-card__body">
          <h3 className="mission-card__title">{mission.title}</h3>
          {entitlement.native && isMissionFree(mission) && (
            <span className="mission-card__free">{t('freeLabel')}</span>
          )}
          <div className="mission-card__badges">
            <Badge tone="teal">
              ⏱ {mission.durationMinutes} {t('minuteShort')}
            </Badge>
            <Badge tone="violet">{t(DIFFICULTY_KEYS[mission.difficulty])}</Badge>
            <Badge tone="pink">
              {t('approximateMaterialCost')} CHF {mission.estimatedCostChf.toFixed(2)}
            </Badge>
            <Badge tone="acid">
              {mission.materials.length}{' '}
              {mission.materials.length === 1
                ? t(mission.primaryCategory === 'getraenk' ? 'ingredient' : 'material')
                : t(mission.primaryCategory === 'getraenk' ? 'ingredients' : 'materials')}
            </Badge>
          </div>
        </div>
      </Link>
      {actions && <div className="mission-card__actions">{actions}</div>}
    </div>
  )
}
