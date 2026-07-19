import { useState, type ReactNode } from 'react'
import { loginRequest, registerRequest } from '../api/client'
import { AuthContext } from './authState'

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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'))
  const [role, setRole] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('authToken')
    return storedToken ? decodeRole(storedToken) : null
  })

  async function login(email: string, password: string) {
    const { access_token } = await loginRequest(email, password)
    localStorage.setItem('authToken', access_token)
    setToken(access_token)
    setRole(decodeRole(access_token))
  }

  async function register(email: string, password: string) {
    await registerRequest(email, password)
  }

  function logout() {
    localStorage.removeItem('authToken')
    setToken(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
