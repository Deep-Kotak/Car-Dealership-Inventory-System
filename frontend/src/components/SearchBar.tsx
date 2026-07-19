import { useState, type FormEvent } from 'react'
import type { VehicleSearchParams } from '../api/client'

interface SearchBarProps {
  onSearch: (filters: VehicleSearchParams) => void
  onClear: () => void
}

const CATEGORY_OPTIONS = [
  'Sedan',
  'SUV',
  'Truck',
  'Coupe',
  'Hatchback',
  'Convertible',
  'Van',
  'Wagon',
]

export default function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [category, setCategory] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSearch({
      make: make.trim() || undefined,
      model: model.trim() || undefined,
      category: category || undefined,
      price_min: priceMin ? Number(priceMin) : undefined,
      price_max: priceMax ? Number(priceMax) : undefined,
    })
  }

  function handleClear() {
    setMake('')
    setModel('')
    setCategory('')
    setPriceMin('')
    setPriceMax('')
    onClear()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="search-make">
            Make
          </label>
          <input
            id="search-make"
            type="text"
            value={make}
            onChange={(event) => setMake(event.target.value)}
            placeholder="e.g. Toyota"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="search-model">
            Model
          </label>
          <input
            id="search-model"
            type="text"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="e.g. Corolla"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="search-category">
            Category
          </label>
          <select
            id="search-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="search-price-min">
            Min price
          </label>
          <input
            id="search-price-min"
            type="number"
            min="0"
            value={priceMin}
            onChange={(event) => setPriceMin(event.target.value)}
            placeholder="0"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm tabular-nums text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="search-price-max">
            Max price
          </label>
          <input
            id="search-price-max"
            type="number"
            min="0"
            value={priceMax}
            onChange={(event) => setPriceMax(event.target.value)}
            placeholder="Any"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm tabular-nums text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Clear
        </button>
      </div>
    </form>
  )
}
