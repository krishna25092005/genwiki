/**
 * Enhanced Chat Interface Component
 * AI-powered conversational interface with context awareness
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Send, Bot, User, Sparkles, Lightbulb } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ChatInterface() {
  const searchParams = useSearchParams()
  const articleId = searchParams?.get('articleId')
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const [articleContext, setArticleContext] = useState<any>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load article context if articleId is provided
    if (articleId) {
      loadArticleContext(articleId)
      loadSuggestedQuestions(articleId)
    } else {
      // Welcome message for general chat
      setMessages([{
        role: 'assistant',
        content: "Hey there! 👋 I'm your AI learning buddy. Ask me anything, or pick an article to discuss specific topics!",
        timestamp: new Date()
      }])
    }
  }, [articleId])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollToBottom()
  }, [messages])

  const loadArticleContext = async (id: string) => {
    try {
      const response = await fetch(`/api/articles/${id}`)
      if (response.ok) {
        const article = await response.json()
        setArticleContext(article)
        
        // Add context message
        setMessages([{
          role: 'assistant',
          content: `I'm here to help you understand "${article.title}"! Feel free to ask me anything about this topic. 📚`,
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('Failed to load article:', error)
    }
  }

  const loadSuggestedQuestions = async (id: string) => {
    try {
      const response = await fetch(`/api/ai/chat/follow-up-questions?article_id=${id}&count=3`)
      if (response.ok) {
        const data = await response.json()
        setSuggestedQuestions(data.questions)
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          articleId: articleId || undefined,
          conversationId: conversationId || undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        const aiMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(data.timestamp)
        }

        setMessages(prev => [...prev, aiMessage])
        setConversationId(data.conversationId)
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "Sorry, I'm having trouble responding right now. Please try again!",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 animate-in fade-in slide-in-from-top duration-500">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Chat Assistant
          </h2>
        </div>
        
        {articleContext && (
          <Alert className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 animate-in fade-in slide-in-from-top duration-700">
            <Sparkles className="h-5 w-5 text-primary" />
            <AlertDescription className="font-medium">
              Currently discussing: <strong className="text-primary">{articleContext.title}</strong>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Messages Area */}
      <Card className="flex-1 mb-6 overflow-hidden border-2 shadow-xl bg-gradient-to-b from-card to-card/50 animate-in fade-in duration-500">
        <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 animate-in fade-in slide-in-from-bottom duration-300 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Avatar */}
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-primary to-secondary' 
                    : 'bg-gradient-to-br from-secondary to-purple-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`flex-1 max-w-[75%] rounded-2xl p-5 shadow-md transition-all hover:shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white ml-auto'
                      : 'bg-muted/50 backdrop-blur-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-3 block">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-4 animate-in fade-in duration-300">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-muted/50 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && messages.length <= 1 && (
        <div className="mb-4 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Try asking:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:border-transparent transition-all hover:scale-105 px-4 py-2 text-sm"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3 animate-in fade-in slide-in-from-bottom duration-500">
        <Input
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="flex-1 h-14 border-2 focus:border-primary rounded-xl text-base"
        />
        <Button 
          onClick={handleSend} 
          disabled={loading || !input.trim()}
          size="icon"
          className="h-14 w-14 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* Tips */}
      <p className="text-xs text-muted-foreground text-center mt-3">
        Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> to send • <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift + Enter</kbd> for new line
      </p>
    </div>
  )
}
