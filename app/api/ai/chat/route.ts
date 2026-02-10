import { NextRequest, NextResponse } from 'next/server'

interface ChatRequest {
  message: string
  articleId?: string
  conversationId?: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()

    const { message, articleId, conversationId } = body

    // Validation
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Forward to FastAPI backend
    const token = request.headers.get('authorization')
    
    const response = await fetch(`${BACKEND_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {}),
      },
      body: JSON.stringify({ 
        message, 
        articleId,
        conversationId
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to generate response' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
