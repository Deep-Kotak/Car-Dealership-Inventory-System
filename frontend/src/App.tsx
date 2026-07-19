import { useState } from 'react'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function AuthGate() {
  const { token } = useAuth()
  const [view, setView] = useState<'login' | 'register'>('login')

  if (!token) {
    return view === 'login' ? (
      <Login onSwitchToRegister={() => setView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setView('login')} />
    )
  }

  return <Dashboard />
}

function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  )
}

export default App
