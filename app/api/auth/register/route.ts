import { NextRequest, NextResponse } from 'next/server'

interface RegisterRequest {
  email: string
  password: string
  name: string
  interests?: string[]
  level?: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()

    const { email, password, name, interests = [], level = 'beginner' } = body

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Forward to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        name,
        interests,
        level 
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Registration failed' },
        { status: response.status }
      )
    }

    // Return success response
    return NextResponse.json(
      {
        message: data.message || 'User registered successfully',
        user: data.user,
        access_token: data.access_token,
        token_type: data.token_type,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
