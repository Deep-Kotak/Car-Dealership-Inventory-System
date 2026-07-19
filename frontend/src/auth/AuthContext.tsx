import { createContext, useContext, useState, type ReactNode } from 'react'
import { loginRequest, registerRequest } from '../api/client'

interface AuthContextValue {
  token: string | null
  role: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function decodeRole(token: string): string | null {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded.role ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  async function login(email: string, password: string) {
    const { access_token } = await loginRequest(email, password)
    setToken(access_token)
    setRole(decodeRole(access_token))
  }

  async function register(email: string, password: string) {
    await registerRequest(email, password)
  }

  function logout() {
    setToken(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
