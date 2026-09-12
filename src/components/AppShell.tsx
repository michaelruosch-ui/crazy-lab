import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { canEditMissionCatalog, type AppLanguage } from '../domain'
import { LANGUAGE_OPTIONS, useLanguage, type TranslationKey } from '../i18n'
import { useActiveProfileId } from '../features/profile'
import './AppShell.css'

const NAVIGATION = [
  { to: '/', icon: '🏠', key: 'start' },
  { to: '/eigene-missionen', icon: '✨', key: 'customMissions' },
  { to: '/einkaufsliste', icon: '🛒', key: 'shoppingList' },
  { to: '/laborschrank', icon: '🧰', key: 'labCabinet' },
  { to: '/geheimfach', icon: '🗝️', key: 'saved' },
  { to: '/verlauf', icon: '📜', key: 'history' },
  { to: '/diary', icon: '📖', key: 'diary' },
  { to: '/profil', icon: '👤', key: 'profile' },
]

export function AppShell() {
  const { language, t, setLanguage } = useLanguage()
  const { activeProfileId } = useActiveProfileId()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="app-shell">
      <a className="app-shell__skip-link" href="#main-content">
        Direkt zum Inhalt
      </a>
      <aside className="app-shell__sidebar">
        <div className="app-shell__brand">🔮 Crazy Lab</div>
        <nav aria-label={t('navigation')}>
          {NAVIGATION.filter(
            (item) => item.to !== '/eigene-missionen' || canEditMissionCatalog(activeProfileId),
          ).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ? 'app-shell__link is-active' : 'app-shell__link'
              }
            >
              {item.icon} {t(item.key as TranslationKey)}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="app-shell__content" id="main-content" tabIndex={-1}>
        <div className="app-shell__language">
          <label>
            <span>🌐 {t('language')}</span>
            <select
              aria-label={t('language')}
              value={language}
              onChange={(event) => setLanguage(event.target.value as AppLanguage)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.short} · {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
