const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function createApiError(status: number, message: string) {
  const error = new Error(message)
  error.name = 'ApiError'
  ;(error as any).status = status
  return error
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw createApiError(response.status, errorData.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  get: (endpoint: string) => apiRequest(endpoint),
  
  post: (endpoint: string, data?: any) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: (endpoint: string, data?: any) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: (endpoint: string) =>
    apiRequest(endpoint, {
      method: 'DELETE',
    }),
} 