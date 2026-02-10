'use client';

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string
  name: string
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // In a real app, verify the token with the backend
      try {
        // Decode the token to get user info (in production, verify with backend)
        const user = localStorage.getItem('user')
        if (user) {
          setUser(JSON.parse(user))
        }
      } catch (err) {
        console.error('Error restoring session:', err)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Login failed')
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)

        router.push('/explore')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)

        router.push('/explore')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }, [router])

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
