import { Link } from 'react-router-dom'
import { DEFAULT_PROFILE } from '../../domain'
import { missions } from '../../data'
import { MissionCard } from '../../components'
import { useSecretVault } from './useSecretVault'
import './SecretVaultPage.css'

export function SecretVaultPage() {
  const { entries, loading } = useSecretVault(DEFAULT_PROFILE.id)

  const savedMissions = entries
    .map((entry) => missions.find((m) => m.id === entry.missionId))
    .filter((m) => m !== undefined)

  return (
    <div className="secret-vault-page">
      <h1>🗝️ Geheimfach</h1>
      <p>Hier liegen alle Missionen, die du dir aufgehoben hast.</p>

      {loading && <p>Lade...</p>}

      {!loading && savedMissions.length === 0 && (
        <p>Noch nichts im Geheimfach. Speichere Missionen, die du dir merken willst!</p>
      )}

      <div className="secret-vault-page__list">
        {savedMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>

      <Link to="/" className="secret-vault-page__back">
        Zurück zur Startseite
      </Link>
    </div>
  )
}
