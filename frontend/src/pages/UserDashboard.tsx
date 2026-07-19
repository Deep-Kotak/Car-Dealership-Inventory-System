import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  listVehicles,
  purchaseVehicle,
  searchVehicles,
  type Vehicle,
  type VehicleSearchParams,
} from '../api/client'
import { useAuth } from '../auth/authState'
import SearchBar from '../components/SearchBar'
import { VehicleCard } from '../components/VehicleCard'

function purchaseMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Your session has expired. Please log in again.'
    if (error.status === 409) return error.message
  }
  return 'Could not complete the purchase. Please try again.'
}

export default function UserDashboard() {
  const { token, logout } = useAuth()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const loadAllVehicles = useCallback(async (currentToken: string) => {
    setLoading(true)
    setError(null)
    setSearched(false)
    try {
      const data = await listVehicles(currentToken)
      setVehicles(data)
    } catch {
      setError('Could not load vehicles. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    const currentToken = token

    async function fetchInitialVehicles() {
      await loadAllVehicles(currentToken)
    }

    fetchInitialVehicles()
  }, [loadAllVehicles, token])

  async function handleSearch(filters: VehicleSearchParams) {
    if (!token) return
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const data = await searchVehicles(token, filters)
      setVehicles(data)
    } catch {
      setError('Could not search vehicles. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    if (!token) return
    loadAllVehicles(token)
  }

  async function handlePurchase(vehicleId: number) {
    if (!token) return
    setActionError(null)
    try {
      const updatedVehicle = await purchaseVehicle(token, vehicleId)
      setVehicles((current) =>
        current.map((vehicle) => (vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle)),
      )
    } catch (err) {
      setActionError(purchaseMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Vehicle Inventory</h1>
            <p className="text-sm text-gray-500">Browse available vehicles and purchase stock.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <SearchBar onSearch={handleSearch} onClear={handleClear} />

        {loading && <p className="text-sm text-gray-500">Loading vehicles...</p>}

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {actionError && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <p className="text-sm text-gray-500">
            {searched ? 'No vehicles matched your search.' : 'No vehicles are available yet.'}
          </p>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} onPurchase={handlePurchase} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
