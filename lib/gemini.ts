import { GoogleGenerativeAI } from '@google/generative-ai'

let client: GoogleGenerativeAI | null = null

export function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set')
  }

  if (!client) {
    client = new GoogleGenerativeAI(apiKey)
  }

  return client
}

export const geminiClient = null

export async function generateSummary(
  content: string,
  maxLength: number = 300
): Promise<string> {
  try {
    const clientInstance = getGeminiClient()
    const model = clientInstance.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Please summarize the following content in ${maxLength} characters or less. Make it concise and informative:\n\n${content}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return text
  } catch (error) {
    console.error('Error generating summary:', error)
    throw new Error('Failed to generate summary')
  }
}

export async function generateResponse(
  prompt: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const clientInstance = getGeminiClient()
    const model = clientInstance.getGenerativeModel({ model: 'gemini-pro' })

    let fullPrompt = prompt

    if (conversationHistory && conversationHistory.length > 0) {
      const historyText = conversationHistory
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n')
      fullPrompt = `${historyText}\nUser: ${prompt}`
    }

    const result = await model.generateContent(fullPrompt)
    const text = result.response.text()

    return text
  } catch (error) {
    console.error('Error generating response:', error)
    throw new Error('Failed to generate response')
  }
}

export async function personalizeContent(
  content: string,
  userInterests: string[],
  userLevel: string
): Promise<string> {
  try {
    const clientInstance = getGeminiClient()
    const model = clientInstance.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Personalize the following content for a ${userLevel} user interested in: ${userInterests.join(', ')}. Keep the core information but adjust the language, examples, and depth to match their interests and level:\n\n${content}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return text
  } catch (error) {
    console.error('Error personalizing content:', error)
    throw new Error('Failed to personalize content')
  }
}
