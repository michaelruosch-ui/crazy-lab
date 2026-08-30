/** Fragt WebKit nach dauerhaftem Website-Speicher. Die Entscheidung trifft iOS selbst. */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persisted || !navigator.storage.persist) return false
  if (await navigator.storage.persisted()) return true
  return navigator.storage.persist()
}
