import { Link } from 'react-router-dom'
import { missions } from '../../data'
import { BackLink, MissionCard } from '../../components'
import { useSecretVault } from './useSecretVault'
import { useActiveProfileId } from '../profile'
import './SecretVaultPage.css'

export function SecretVaultPage() {
  const { activeProfileId } = useActiveProfileId()
  const { entries, loading } = useSecretVault(activeProfileId)

  const savedMissions = entries
    .map((entry) => missions.find((m) => m.id === entry.missionId))
    .filter((m) => m !== undefined)

  return (
    <div className="secret-vault-page">
      <h1>🗝️ Gemerkte Missionen</h1>
      <p>Hier liegen alle Missionen, die du dir aufgehoben hast – auch nach dem Abschluss.</p>

      {loading && <p>Lade...</p>}

      {!loading && savedMissions.length === 0 && (
        <p>Noch nichts gemerkt. Tippe bei einer Mission auf „Merken“, um sie hier abzulegen.</p>
      )}

      <div className="secret-vault-page__list">
        {savedMissions.map((mission) => (
          <div key={mission.id} className="secret-vault-page__mission">
            <MissionCard mission={mission} />
            <Link to={`/mission/${mission.id}`} className="secret-vault-page__repeat">
              🔁 Nochmals machen
            </Link>
          </div>
        ))}
      </div>

      <BackLink to="/">← Zurück zur Startseite</BackLink>
    </div>
  )
}
