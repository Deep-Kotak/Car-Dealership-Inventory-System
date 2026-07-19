import { useState, type FormEvent } from 'react'
import type { Vehicle } from '../api/client'

export interface VehicleFormValues {
  make: string
  model: string
  category: string
  price: number
  quantity: number
}

interface VehicleFormProps {
  vehicle: Vehicle | null
  onSubmit: (values: VehicleFormValues) => void
  onClose: () => void
  submitting?: boolean
  error?: string | null
}

export function VehicleForm({ vehicle, onSubmit, onClose, submitting, error }: VehicleFormProps) {
  const isEditing = vehicle !== null
  const [make, setMake] = useState(vehicle?.make ?? '')
  const [model, setModel] = useState(vehicle?.model ?? '')
  const [category, setCategory] = useState(vehicle?.category ?? '')
  const [price, setPrice] = useState(vehicle ? String(vehicle.price) : '')
  const [quantity, setQuantity] = useState(vehicle ? String(vehicle.quantity) : '')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit({
      make,
      model,
      category,
      price: Number(price),
      quantity: Number(quantity),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditing ? 'Edit vehicle' : 'Add vehicle'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="vehicle-make">
            Make
          </label>
          <input
            id="vehicle-make"
            type="text"
            required
            value={make}
            onChange={(event) => setMake(event.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="vehicle-model">
            Model
          </label>
          <input
            id="vehicle-model"
            type="text"
            required
            value={model}
            onChange={(event) => setModel(event.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="vehicle-category">
            Category
          </label>
          <input
            id="vehicle-category"
            type="text"
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="vehicle-price">
            Price
          </label>
          <input
            id="vehicle-price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm tabular-nums text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="vehicle-quantity">
            Quantity
          </label>
          <div className="mb-4">
            <input
              id="vehicle-quantity"
              type="number"
              min="0"
              required
              disabled={isEditing}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm tabular-nums text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
            {isEditing && (
              <p className="mt-1 text-xs text-gray-500">Use Restock on the card to change stock quantity.</p>
            )}
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add vehicle'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
