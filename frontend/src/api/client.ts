const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body?.detail ?? 'Request failed')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export interface AuthUser {
  id: number
  email: string
  role: string
}

export interface TokenResponse {
  access_token: string
}

export function registerRequest(email: string, password: string) {
  return request<AuthUser>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function loginRequest(email: string, password: string) {
  return request<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export interface Vehicle {
  id: number
  make: string
  model: string
  category: string
  price: number
  quantity: number
}

export function listVehicles(token: string) {
  return request<Vehicle[]>('/api/vehicles', {}, token)
}

export interface VehicleSearchParams {
  make?: string
  model?: string
  category?: string
  price_min?: number
  price_max?: number
}

export function searchVehicles(token: string, params: VehicleSearchParams) {
  const query = new URLSearchParams()
  if (params.make) query.set('make', params.make)
  if (params.model) query.set('model', params.model)
  if (params.category) query.set('category', params.category)
  if (params.price_min !== undefined) query.set('price_min', String(params.price_min))
  if (params.price_max !== undefined) query.set('price_max', String(params.price_max))

  const queryString = query.toString()
  return request<Vehicle[]>(
    `/api/vehicles/search${queryString ? `?${queryString}` : ''}`,
    {},
    token,
  )
}

export function purchaseVehicle(token: string, vehicleId: number) {
  return request<Vehicle>(`/api/vehicles/${vehicleId}/purchase`, { method: 'POST' }, token)
}

export interface VehicleCreateInput {
  make: string
  model: string
  category: string
  price: number
  quantity: number
}

export function createVehicle(token: string, input: VehicleCreateInput) {
  return request<Vehicle>(
    '/api/vehicles',
    { method: 'POST', body: JSON.stringify(input) },
    token,
  )
}

export interface VehicleUpdateInput {
  make?: string
  model?: string
  category?: string
  price?: number
}

export function updateVehicle(token: string, vehicleId: number, input: VehicleUpdateInput) {
  return request<Vehicle>(
    `/api/vehicles/${vehicleId}`,
    { method: 'PUT', body: JSON.stringify(input) },
    token,
  )
}

export function deleteVehicle(token: string, vehicleId: number) {
  return request<void>(`/api/vehicles/${vehicleId}`, { method: 'DELETE' }, token)
}

export function restockVehicle(token: string, vehicleId: number, amount: number) {
  return request<Vehicle>(
    `/api/vehicles/${vehicleId}/restock`,
    { method: 'POST', body: JSON.stringify({ amount }) },
    token,
  )
}
