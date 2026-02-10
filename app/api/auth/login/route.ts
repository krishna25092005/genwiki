import { NextRequest, NextResponse } from 'next/server'

interface LoginRequest {
  email: string
  password: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function POST(request: NextRequest) {
  try {
    console.log('Backend URL:', BACKEND_URL)
    const body: LoginRequest = await request.json()

    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Attempting to connect to backend:', `${BACKEND_URL}/auth/login`)

    // Forward to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    console.log('Backend response status:', response.status)

    const data = await response.json()

    if (!response.ok) {
      console.error('Backend error:', data)
      return NextResponse.json(
        { error: data.detail || 'Login failed' },
        { status: response.status }
      )
    }

    // Return success response
    return NextResponse.json(
      {
        message: data.message || 'Login successful',
        user: data.user,
        access_token: data.access_token,
        token_type: data.token_type,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error details:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        backendUrl: BACKEND_URL 
      },
      { status: 500 }
    )
  }
}
