/* Removed external uuid dependency; use crypto/Math-based generator */

// PUBLIC_INTERFACE
export function useStorage() {
  /** Simple wrapper around localStorage with SSR safety and prefixed keys. */
  const config = useRuntimeConfig()
  const prefix = config.public.storagePrefix || 'notesapp'
  const hasStorage = process.client && typeof window !== 'undefined' && !!window.localStorage

  function key(k: string) {
    return `${prefix}:${k}`
  }

  function getItem<T>(k: string, fallback: T): T {
    if (!hasStorage) return fallback
    try {
      const raw = window.localStorage.getItem(key(k))
      return raw ? JSON.parse(raw) as T : fallback
    } catch {
      return fallback
    }
  }

  function setItem<T>(k: string, val: T) {
    if (!hasStorage) return
    try {
      window.localStorage.setItem(key(k), JSON.stringify(val))
    } catch {
      // ignore quota errors
    }
  }

  function removeItem(k: string) {
    if (!hasStorage) return
    try {
      window.localStorage.removeItem(key(k))
    } catch {}
  }

  function ensureId(val?: string) {
    return val || cryptoRandom()
  }

  function cryptoRandom(): string {
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
      const arr = new Uint32Array(4)
      ;(crypto as Crypto).getRandomValues(arr)
      return Array.from(arr).map(n => n.toString(16)).join('')
    }
    // Fallback: concatenate random and timestamp to reduce collisions
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }

  return { getItem, setItem, removeItem, ensureId }
}

export type { }
