import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { listVehicles, searchVehicles, type Vehicle, type VehicleSearchParams } from '../api/client'
import SearchBar from '../components/SearchBar'

export default function Dashboard() {
  const { token, logout } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

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
      setLoading(true)
      setError(null)
      try {
        const data = await listVehicles(currentToken)
        setVehicles(data)
      } catch {
        setError('Could not load vehicles. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchInitialVehicles()
  }, [token])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Dealership Inventory System</h1>
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
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Vehicle Inventory</h2>

        <SearchBar onSearch={handleSearch} onClear={handleClear} />

        {loading && <p className="text-sm text-gray-500">Loading vehicles...</p>}

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <p className="text-sm text-gray-500">
            {searched ? 'No vehicles matched your search.' : 'No vehicles have been added yet.'}
          </p>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{vehicle.category}</p>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span className="font-mono text-sm font-medium tabular-nums text-gray-900">
                    ${vehicle.price.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-gray-500">In stock</span>
                  <span className="font-mono text-sm font-medium tabular-nums text-gray-900">
                    {vehicle.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
