// Safari 12 besitzt Array.prototype.flat noch nicht. React Router verwendet es intern.
// Moderne Browser behalten immer ihre native Implementierung; dieser kleine Ersatz wird nur
// auf dem alten Familien-iPad installiert.
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    writable: true,
    value<T>(this: T[], depth = 1): T[] {
      const normalizedDepth = Math.max(0, Math.floor(Number(depth) || 0))

      const flatten = (items: T[], remainingDepth: number): T[] =>
        items.reduce<T[]>((result, item) => {
          if (Array.isArray(item) && remainingDepth > 0) {
            return result.concat(flatten(item as T[], remainingDepth - 1))
          }
          result.push(item)
          return result
        }, [])

      return flatten(this, normalizedDepth)
    },
  })
}
