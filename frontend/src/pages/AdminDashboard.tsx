import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  createVehicle,
  deleteVehicle,
  listVehicles,
  restockVehicle,
  searchVehicles,
  updateVehicle,
  type Vehicle,
  type VehicleSearchParams,
} from '../api/client'
import { useAuth } from '../auth/authState'
import SearchBar from '../components/SearchBar'
import { VehicleCard } from '../components/VehicleCard'
import { VehicleForm, type VehicleFormValues } from '../components/VehicleForm'

function actionMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Your session has expired. Please log in again.'
    if (error.status === 403) return 'You do not have permission to do that.'
    if (error.status === 409) return error.message
    if (error.status === 400) return error.message
  }
  return fallback
}

export default function AdminDashboard() {
  const { token, logout } = useAuth()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null)
  const [restockingVehicle, setRestockingVehicle] = useState<Vehicle | null>(null)
  const [restockAmount, setRestockAmount] = useState('')
  const [restockError, setRestockError] = useState<string | null>(null)

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

  function openAddForm() {
    setEditingVehicle(null)
    setFormError(null)
    setFormOpen(true)
  }

  function openEditForm(vehicle: Vehicle) {
    setEditingVehicle(vehicle)
    setFormError(null)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingVehicle(null)
    setFormError(null)
  }

  async function handleFormSubmit(values: VehicleFormValues) {
    if (!token) return
    setFormSubmitting(true)
    setFormError(null)
    try {
      if (editingVehicle) {
        await updateVehicle(token, editingVehicle.id, {
          make: values.make,
          model: values.model,
          category: values.category,
          price: values.price,
        })
      } else {
        await createVehicle(token, values)
      }
      closeForm()
      await loadAllVehicles(token)
    } catch (err) {
      setFormError(
        actionMessage(
          err,
          editingVehicle
            ? 'Could not save changes. Please try again.'
            : 'Could not add vehicle. Please try again.',
        ),
      )
    } finally {
      setFormSubmitting(false)
    }
  }

  function openDeleteDialog(vehicleId: number) {
    const vehicle = vehicles.find((current) => current.id === vehicleId)
    if (vehicle) setDeletingVehicle(vehicle)
  }

  async function confirmDelete() {
    if (!token) return
    if (!deletingVehicle) return

    setActionError(null)
    try {
      await deleteVehicle(token, deletingVehicle.id)
      setDeletingVehicle(null)
      await loadAllVehicles(token)
    } catch (err) {
      setActionError(actionMessage(err, 'Could not delete the vehicle. Please try again.'))
    }
  }

  function openRestockDialog(vehicleId: number) {
    const vehicle = vehicles.find((current) => current.id === vehicleId)
    if (!vehicle) return
    setRestockingVehicle(vehicle)
    setRestockAmount('')
    setRestockError(null)
  }

  async function confirmRestock() {
    if (!token) return
    if (!restockingVehicle) return

    const amount = Number(restockAmount)
    if (!Number.isInteger(amount) || amount <= 0) {
      setRestockError('Enter a whole number greater than zero.')
      return
    }

    setActionError(null)
    setRestockError(null)
    try {
      await restockVehicle(token, restockingVehicle.id, amount)
      setRestockingVehicle(null)
      setRestockAmount('')
      await loadAllVehicles(token)
    } catch (err) {
      setRestockError(actionMessage(err, 'Could not restock the vehicle. Please try again.'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Admin Inventory</h1>
            <p className="text-sm text-gray-500">Manage vehicles, pricing, and stock.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={openAddForm}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add vehicle
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Log out
            </button>
          </div>
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
            {searched ? 'No vehicles matched your search.' : 'No vehicles have been added yet.'}
          </p>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPurchase={() => {}}
                isAdmin
                onEdit={openEditForm}
                onDelete={openDeleteDialog}
                onRestock={openRestockDialog}
              />
            ))}
          </div>
        )}
      </main>

      {formOpen && (
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
          submitting={formSubmitting}
          error={formError}
        />
      )}

      {deletingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Delete vehicle</h2>
            <p className="mt-2 text-sm text-gray-600">
              Delete {deletingVehicle.make} {deletingVehicle.model}? This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setDeletingVehicle(null)}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {restockingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Restock vehicle</h2>
            <p className="mt-2 text-sm text-gray-600">
              Add stock for {restockingVehicle.make} {restockingVehicle.model}.
            </p>

            {restockError && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {restockError}
              </div>
            )}

            <label className="mt-4 mb-1 block text-sm font-medium text-gray-700" htmlFor="restock-amount">
              Quantity to add
            </label>
            <input
              id="restock-amount"
              type="number"
              min="1"
              step="1"
              required
              value={restockAmount}
              onChange={(event) => setRestockAmount(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm tabular-nums text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={confirmRestock}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Restock
              </button>
              <button
                type="button"
                onClick={() => setRestockingVehicle(null)}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
