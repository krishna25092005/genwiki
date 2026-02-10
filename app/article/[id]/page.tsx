'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Heart, Share2, Bookmark, ArrowLeft, Sparkles } from 'lucide-react'

interface ArticlePageProps {
  params: {
    id: string
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSummarize, setShowSummarize] = useState(false)
  const [summary, setSummary] = useState<string>('')
  const [question, setQuestion] = useState('')
  const [qnaResult, setQnaResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const articleContent = `Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. At its core, machine learning is about creating algorithms that can process data, identify patterns, and make decisions with minimal human intervention.

The concept of machine learning has been around for decades, but its practical applications have exploded in recent years due to increased computational power and the availability of large datasets. Today, machine learning powers everything from recommendation systems on Netflix to medical diagnosis tools that can detect cancer early.

There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning. Supervised learning involves training models on labeled data, where the correct answers are already known. This is how most practical applications work today, from email spam filters to image recognition systems.

Unsupervised learning, on the other hand, works with unlabeled data and tries to find hidden patterns or structures. This is useful for customer segmentation, anomaly detection, and exploratory data analysis.

Reinforcement learning is inspired by behavioral psychology and involves an agent learning to make decisions by receiving rewards or punishments for its actions. This is the technology behind game-playing AIs and robotics.

The future of machine learning is incredibly exciting. We're seeing breakthroughs in natural language processing, computer vision, and autonomous systems. However, there are also important considerations around bias, privacy, and the ethical implications of AI systems.`

  const handleSummarize = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: articleContent,
          maxLength: 300,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!question.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Based on this article about machine learning: "${articleContent}", please answer this question: ${question}`,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setQnaResult(data.response)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Understanding Machine Learning</h1>
          <div className="flex gap-4 flex-wrap mb-6">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Technology
            </span>
            <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm capitalize">
              Intermediate
            </span>
            <span className="text-sm text-muted-foreground">8 min read</span>
          </div>

          <div className="flex gap-4">
            <Button
              variant={liked ? 'default' : 'outline'}
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Liked' : 'Like'}
            </Button>
            <Button
              variant={saved ? 'default' : 'outline'}
              onClick={() => setSaved(!saved)}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${saved ? 'fill-current' : ''}`} />
              {saved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* AI Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-8 prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {articleContent}
              </div>
            </Card>
          </div>

          {/* Sidebar with AI Features */}
          <div className="space-y-6">
            {/* Quick Summary */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">AI Summary</h3>
              </div>
              {summary ? (
                <p className="text-sm text-foreground mb-4 leading-relaxed">{summary}</p>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  Get an instant AI-powered summary of this article.
                </p>
              )}
              <Button
                className="w-full"
                onClick={handleSummarize}
                disabled={loading && !summary}
                size="sm"
              >
                {loading && !summary ? 'Generating...' : 'Summarize'}
              </Button>
            </Card>

            {/* Q&A Section */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Ask a Question</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Ask about this topic..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={loading}
                />
                <Button
                  className="w-full"
                  onClick={handleAskQuestion}
                  disabled={loading || !question.trim()}
                  size="sm"
                >
                  {loading ? 'Answering...' : 'Get Answer'}
                </Button>
                {qnaResult && (
                  <div className="bg-muted p-3 rounded text-sm text-foreground">
                    {qnaResult}
                  </div>
                )}
              </div>
            </Card>

            {/* Related Topics */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Related Topics</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-primary hover:underline"
                  >
                    Deep Learning Basics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-primary hover:underline"
                  >
                    Neural Networks Explained
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-primary hover:underline"
                  >
                    AI Ethics and Bias
                  </a>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
