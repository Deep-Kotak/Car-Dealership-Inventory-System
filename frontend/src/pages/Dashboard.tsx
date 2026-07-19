import { useAuth } from '../auth/authState'
import AdminDashboard from './AdminDashboard'
import UserDashboard from './UserDashboard'

export default function Dashboard() {
  const { role } = useAuth()

  if (role === 'admin') {
    return <AdminDashboard />
  }

  return <UserDashboard />
}
