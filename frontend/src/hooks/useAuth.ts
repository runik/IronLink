import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

// Types
export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name?: string
}

export interface AuthResponse {
  user: User
  access_token: string
}

// Query keys
export const authKeys = {
  user: ['auth', 'user'] as const,
}

// Hooks
export function useUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: () => api.get('/auth/profile'),
    enabled: !!localStorage.getItem('token'),
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: LoginData) => api.post('/auth/login', data),
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('token', data.access_token)
      // Set user data in cache
      queryClient.setQueryData(authKeys.user, data.user)
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: RegisterData) => api.post('/auth/register', data),
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('token', data.access_token)
      // Set user data in cache
      queryClient.setQueryData(authKeys.user, data.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => {
      localStorage.removeItem('token')
      return Promise.resolve()
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear()
    },
  })
} 