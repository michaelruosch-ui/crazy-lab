import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Mission } from '../domain'
import { Badge } from './Badge'
import { MissionImage } from './MissionImage'
import { useLanguage, type TranslationKey } from '../i18n'
import './MissionCard.css'

const DIFFICULTY_KEYS: Record<Mission['difficulty'], TranslationKey> = {
  leicht: 'difficultyEasy',
  mittel: 'difficultyMedium',
  schwer: 'difficultyHard',
}

interface MissionCardProps {
  mission: Mission
  actions?: ReactNode
}

export function MissionCard({ mission, actions }: MissionCardProps) {
  const { t } = useLanguage()
  return (
    <div className="mission-card">
      <Link to={`/mission/${mission.id}`} className="mission-card__link">
        <div className="mission-card__image">
          <MissionImage placeholder={mission.imagePlaceholder} title={mission.title} />
        </div>
        <div className="mission-card__body">
          <h3 className="mission-card__title">{mission.title}</h3>
          <div className="mission-card__badges">
            <Badge tone="teal">
              ⏱ {mission.durationMinutes} {t('minuteShort')}
            </Badge>
            <Badge tone="violet">{t(DIFFICULTY_KEYS[mission.difficulty])}</Badge>
            <Badge tone="pink">CHF {mission.estimatedCostChf.toFixed(2)}</Badge>
            <Badge tone="acid">
              {mission.materials.length}{' '}
              {mission.materials.length === 1 ? t('ingredient') : t('ingredients')}
            </Badge>
          </div>
        </div>
      </Link>
      {actions && <div className="mission-card__actions">{actions}</div>}
    </div>
  )
}
