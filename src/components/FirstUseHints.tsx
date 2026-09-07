import { useState } from 'react'
import { translateGeneratedText, useLanguage } from '../i18n'
import { Button } from './Button'
import './FirstUseHints.css'

const HINTS = [
  'Mit der Weltkugel kannst du die Sprache jederzeit ändern.',
  'Im Laborschrank tippst du ein Material an, um alle Einstellungen zu öffnen.',
  'Vor einer Mission kannst du alle Schritte auf einmal anschauen.',
  'Der neue Zuhause-Knopf zeigt Missionen, für die alles bereitliegt.',
]

export function FirstUseHints({ profileId }: { profileId: string }) {
  const { language, t } = useLanguage()
  const storageKey = `crazy-lab:hints:${profileId}`
  const [index, setIndex] = useState(() => {
    try {
      return Number(window.localStorage?.getItem(storageKey) ?? 0)
    } catch {
      return 0
    }
  })
  if (index >= HINTS.length) return null

  function next() {
    const nextIndex = index + 1
    try {
      window.localStorage?.setItem(storageKey, String(nextIndex))
    } catch {
      // Der Hinweis funktioniert auch, wenn privates Browsen keinen Speicher zulässt.
    }
    setIndex(nextIndex)
  }

  return (
    <aside className="first-use-hint" aria-label={t('labTip')}>
      <span aria-hidden="true">💡</span>
      <p>
        <strong>{t('labTip')}</strong> {translateGeneratedText(HINTS[index]!, language)}
      </p>
      <Button variant="ghost" onClick={next}>
        {t('understood')}
      </Button>
    </aside>
  )
}
