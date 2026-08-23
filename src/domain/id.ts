/**
 * `crypto.randomUUID()` erfordert einen sicheren Kontext (HTTPS oder localhost). Beim Testen
 * über eine lokale Netzwerk-IP per HTTP (z. B. auf einem iPhone im selben WLAN) ist die
 * Funktion in Safari schlicht nicht vorhanden. Diese Hilfsfunktion fällt in dem Fall auf
 * `crypto.getRandomValues()` zurück, das ohne sicheren Kontext funktioniert, und zuletzt auf
 * `Math.random()`. Für lokal generierte, nicht sicherheitskritische IDs (Tagebucheinträge) reicht
 * das aus.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40
    bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
