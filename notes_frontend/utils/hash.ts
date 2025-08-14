async function sha256(message: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(message)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
  }
  // Fallback (NOT cryptographically secure, only for dev environments without SubtleCrypto)
  let hash = 0
  for (let i = 0; i < message.length; i++) {
    hash = ((hash << 5) - hash) + message.charCodeAt(i)
    hash |= 0
  }
  return 'fallback-' + (hash >>> 0).toString(16)
}

// PUBLIC_INTERFACE
export async function hashPassword(email: string, password: string): Promise<string> {
  /** Hashes password with email as salt (client-side only for demo purposes). */
  return sha256(`${email}::${password}`)
}
