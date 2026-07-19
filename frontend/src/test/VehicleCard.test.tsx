import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { VehicleCard } from '../components/VehicleCard'

const vehicle = {
  id: 1,
  make: 'Toyota',
  model: 'Corolla',
  category: 'sedan',
  price: 20000,
  quantity: 3,
}

describe('VehicleCard', () => {
  it('lets you buy when there is stock', () => {
    render(<VehicleCard vehicle={vehicle} onPurchase={() => {}} />)
    expect(screen.getByRole('button', { name: /purchase/i })).toBeEnabled()
  })

  it('disables the button when stock is zero', () => {
    render(
      <VehicleCard vehicle={{ ...vehicle, quantity: 0 }} onPurchase={() => {}} />
    )
    expect(screen.getByRole('button', { name: /purchase/i })).toBeDisabled()
  })
})