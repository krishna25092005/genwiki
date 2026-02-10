'use client'

import { useState, useCallback } from 'react'

export interface SummaryResult {
  summary: string
  originalLength: number
  summaryLength: number
}

export interface ChatResult {
  response: string
  timestamp: string
}

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const summarize = useCallback(
    async (content: string, maxLength: number = 300): Promise<SummaryResult | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/ai/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            maxLength,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to summarize')
        }

        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const chat = useCallback(
    async (
      prompt: string,
      conversationHistory?: Array<{ role: string; content: string }>
    ): Promise<ChatResult | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            conversationHistory,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get response')
        }

        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    summarize,
    chat,
    loading,
    error,
  }
}
