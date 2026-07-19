import type { Vehicle } from '../api/client'

interface VehicleCardProps {
  vehicle: Vehicle
  onPurchase?: (vehicleId: number) => void
  isAdmin?: boolean
  onEdit?: (vehicle: Vehicle) => void
  onDelete?: (vehicleId: number) => void
  onRestock?: (vehicleId: number) => void
}

export function VehicleCard({
  vehicle,
  onPurchase,
  isAdmin,
  onEdit,
  onDelete,
  onRestock,
}: VehicleCardProps) {
  const outOfStock = vehicle.quantity <= 0

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">
        {vehicle.make} {vehicle.model}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{vehicle.category}</p>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-500">Price</span>
        {outOfStock ? (
          <span className="text-sm font-medium text-gray-500">Out of stock</span>
        ) : (
          <span className="font-mono text-sm font-medium tabular-nums text-gray-900">
            ${vehicle.price.toLocaleString()}
          </span>
        )}
      </div>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-gray-500">In stock</span>
        <span className="font-mono text-sm font-medium tabular-nums text-gray-900">
          {vehicle.quantity}
        </span>
      </div>

      {onPurchase && (
        <button
          type="button"
          disabled={outOfStock}
          onClick={() => onPurchase(vehicle.id)}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Purchase
        </button>
      )}

      {isAdmin && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(vehicle)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onRestock?.(vehicle.id)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            Restock
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(vehicle.id)}
            className="flex-1 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
