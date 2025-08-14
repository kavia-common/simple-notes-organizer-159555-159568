import { hashPassword } from '@/utils/hash'

type User = {
  id: string
  email: string
  passwordHash: string
  createdAt: string
}

type Session = {
  token: string
  userId: string
  createdAt: string
}

// PUBLIC_INTERFACE
export function useAuth() {
  /**
   * Client-side demo authentication.
   * WARNING: This is for demonstration purposes only and stores credentials in localStorage.
   */
  const { getItem, setItem, removeItem, ensureId } = useStorage()

  const user = useState<User | null>('auth_user', () => null)
  const session = useState<Session | null>('auth_session', () => null)
  const isAuthenticated = computed(() => !!session.value?.token && !!user.value)

  function loadFromStorage() {
    const u = getItem<User | null>('user', null)
    const s = getItem<Session | null>('session', null)
    user.value = u
    session.value = s
  }

  if (process.client) {
    // Initial load
    loadFromStorage()
  }

  // PUBLIC_INTERFACE
  async function register(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    /** Registers a new user or returns error if user exists. */
    const existing = getItem<User | null>('user', null)
    if (existing) return { ok: false, error: 'User already exists. Please sign in.' }
    const id = ensureId()
    const passwordHash = await hashPassword(email, password)
    const u: User = { id, email, passwordHash, createdAt: new Date().toISOString() }
    setItem('user', u)
    user.value = u
    // auto-login
    const s: Session = { token: ensureId(), userId: u.id, createdAt: new Date().toISOString() }
    setItem('session', s)
    session.value = s
    return { ok: true }
  }

  // PUBLIC_INTERFACE
  async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    /** Logs in if email/password match stored user. */
    const u = getItem<User | null>('user', null)
    if (!u) return { ok: false, error: 'No account found. Please register.' }
    const pass = await hashPassword(email, password)
    if (u.email !== email || u.passwordHash !== pass) {
      return { ok: false, error: 'Invalid credentials' }
    }
    user.value = u
    const s: Session = { token: ensureId(), userId: u.id, createdAt: new Date().toISOString() }
    setItem('session', s)
    session.value = s
    return { ok: true }
  }

  // PUBLIC_INTERFACE
  function logout() {
    /** Clears session but keeps user record for later login. */
    removeItem('session')
    session.value = null
  }

  // PUBLIC_INTERFACE
  function currentUser() {
    /** Returns current user or null. */
    return user
  }

  return {
    isAuthenticated,
    user,
    session,
    register,
    login,
    logout,
    currentUser
  }
}
