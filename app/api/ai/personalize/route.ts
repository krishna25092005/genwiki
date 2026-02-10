import { NextRequest, NextResponse } from 'next/server'

interface PersonalizeRequest {
  content: string
  userInterests: string[]
  userLevel: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function POST(request: NextRequest) {
  try {
    const body: PersonalizeRequest = await request.json()

    const { content, userInterests, userLevel } = body

    // Validation
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!userInterests || userInterests.length === 0) {
      return NextResponse.json(
        { error: 'User interests are required' },
        { status: 400 }
      )
    }

    if (!userLevel) {
      return NextResponse.json(
        { error: 'User level is required' },
        { status: 400 }
      )
    }

    // For now, return the original content
    // TODO: Implement personalization endpoint in backend
    return NextResponse.json(
      {
        personalizedContent: content,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Personalization error:', error)
    return NextResponse.json(
      { error: 'Failed to personalize content' },
      { status: 500 }
    )
  }
}
