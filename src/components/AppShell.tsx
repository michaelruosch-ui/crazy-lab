import { NavLink, Outlet } from 'react-router-dom'
import './AppShell.css'

const NAVIGATION = [
  { to: '/', label: '🏠 Start' },
  { to: '/eigene-missionen', label: '✨ Eigene Missionen' },
  { to: '/einkaufsliste', label: '🛒 Einkaufsliste' },
  { to: '/laborschrank', label: '🧰 Laborschrank' },
  { to: '/geheimfach', label: '🗝️ Gemerkt' },
  { to: '/verlauf', label: '📜 Verlauf' },
  { to: '/diary', label: '📖 Tagebuch' },
  { to: '/profil', label: '👤 Profil' },
]

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="app-shell__brand">🔮 Crazy Lab</div>
        <nav aria-label="Labornavigation">
          {NAVIGATION.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ? 'app-shell__link is-active' : 'app-shell__link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  )
}
