import { NextRequest, NextResponse } from 'next/server'

interface SummarizeRequest {
  content: string
  maxLength?: number
  style?: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function POST(request: NextRequest) {
  try {
    const body: SummarizeRequest = await request.json()

    const { content, maxLength = 300, style = 'concise' } = body

    // Validation
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (content.length < 50) {
      return NextResponse.json(
        { error: 'Content must be at least 50 characters long' },
        { status: 400 }
      )
    }

    // Forward to FastAPI backend
    const token = request.headers.get('authorization')
    
    const response = await fetch(`${BACKEND_URL}/ai/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {}),
      },
      body: JSON.stringify({ content, maxLength, style }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to generate summary' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
