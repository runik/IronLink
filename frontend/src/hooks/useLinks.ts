import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

// Types
export interface Link {
  id: string
  originalUrl: string
  shortCode: string
  title?: string
  description?: string
  createdAt: string
  updatedAt: string
  clicks: number
}

export interface CreateLinkData {
  originalUrl: string
  title?: string
  description?: string
}

export interface UpdateLinkData {
  originalUrl?: string
  title?: string
  description?: string
}

// Query keys
export const linkKeys = {
  all: ['links'] as const,
  lists: () => [...linkKeys.all, 'list'] as const,
  list: (filters: string) => [...linkKeys.lists(), { filters }] as const,
  details: () => [...linkKeys.all, 'detail'] as const,
  detail: (id: string) => [...linkKeys.details(), id] as const,
  stats: (id: string) => [...linkKeys.detail(id), 'stats'] as const,
}

// Hooks
export function useLinks() {
  return useQuery({
    queryKey: linkKeys.lists(),
    queryFn: () => api.get('/links'),
  })
}

export function useLink(id: string) {
  return useQuery({
    queryKey: linkKeys.detail(id),
    queryFn: () => api.get(`/links/${id}`),
    enabled: !!id,
  })
}

export function useLinkStats(id: string) {
  return useQuery({
    queryKey: linkKeys.stats(id),
    queryFn: () => api.get(`/links/${id}/stats`),
    enabled: !!id,
  })
}

export function useCreateLink() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateLinkData) => api.post('/links', data),
    onSuccess: () => {
      // Invalidate and refetch links list
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() })
    },
  })
}

export function useUpdateLink() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLinkData }) =>
      api.put(`/links/${id}`, data),
    onSuccess: (data, variables) => {
      // Update the specific link in cache
      queryClient.setQueryData(linkKeys.detail(variables.id), data)
      // Invalidate lists to refresh them
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() })
    },
  })
}

export function useDeleteLink() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/links/${id}`),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: linkKeys.detail(id) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() })
    },
  })
} 