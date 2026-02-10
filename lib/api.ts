import type { NextRequest } from 'next/server'

export interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API request failed')
  }

  return response.json() as Promise<T>
}

/**
 * Get request helper
 */
export function apiGet<T>(url: string, options?: ApiRequestOptions) {
  return apiRequest<T>(url, {
    ...options,
    method: 'GET',
  })
}

/**
 * Post request helper
 */
export function apiPost<T>(url: string, data?: unknown, options?: ApiRequestOptions) {
  return apiRequest<T>(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * Put request helper
 */
export function apiPut<T>(url: string, data?: unknown, options?: ApiRequestOptions) {
  return apiRequest<T>(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * Delete request helper
 */
export function apiDelete<T>(url: string, options?: ApiRequestOptions) {
  return apiRequest<T>(url, {
    ...options,
    method: 'DELETE',
  })
}
