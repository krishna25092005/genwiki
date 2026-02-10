'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Send, Plus, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi! I\'m your AI learning assistant. Ask me anything about any topic and I\'ll help you understand it better. What would you like to learn about?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        console.error('Error:', data.error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/40 bg-card/50 backdrop-blur-sm p-4 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">WikiGen</span>
        </div>
        
        <Button className="w-full mb-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg" variant="default">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-semibold px-2 mb-3">
              Recent Conversations
            </p>
            {/* Chat history would go here */}
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-primary/10"
            onClick={() => router.push('/explore')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border/40 p-6 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Learning Assistant
              </h1>
              <p className="text-sm text-muted-foreground">Ask anything and get instant, intelligent answers</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom duration-500`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <Card
                className={`max-w-md md:max-w-2xl px-6 py-4 shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-3xl rounded-br-md'
                    : 'bg-muted/50 backdrop-blur-sm text-foreground rounded-3xl rounded-bl-md border-2'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <Card className="bg-muted/50 backdrop-blur-sm text-foreground rounded-3xl rounded-bl-md px-6 py-4 border-2">
                <div className="flex gap-2">
                  <div className="h-3 w-3 bg-primary rounded-full animate-bounce" />
                  <div className="h-3 w-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="h-3 w-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border/40 p-6 bg-card/50 backdrop-blur-sm">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={loading}
              className="flex-1 h-14 border-2 focus:border-primary rounded-2xl text-base"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              size="lg"
              className="h-14 w-14 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> to send
          </p>
        </div>
      </div>
    </div>
  )
}
