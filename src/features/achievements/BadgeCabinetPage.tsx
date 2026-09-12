import { BackLink, ResearchAchievements } from '../../components'
import { useDiaryEntries } from '../diary'
import { useActiveProfileId } from '../profile'
import './BadgeCabinetPage.css'

export function BadgeCabinetPage() {
  const { activeProfileId } = useActiveProfileId()
  const { entries } = useDiaryEntries(activeProfileId)

  return (
    <div className="badge-cabinet-page">
      <header>
        <p>Deine magische Sammlung</p>
        <h1>🏆 Abzeichen-Vitrine</h1>
        <span>
          Es gibt viele Wege zum Abzeichen: ausprobieren, beobachten, wiederholen, fotografieren,
          mutig sein oder eine ganz besondere Mission schaffen.
        </span>
      </header>
      <ResearchAchievements entries={entries} />
      <BackLink to="/">← Zurück ins Labor</BackLink>
    </div>
  )
}
