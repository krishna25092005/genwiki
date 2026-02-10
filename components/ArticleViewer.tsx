/**
 * Enhanced Article Viewer Component
 * Provides rich article display with AI features
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Heart, 
  Bookmark, 
  Share2, 
  MessageCircle, 
  Sparkles,
  BookOpen,
  Clock,
  Eye,
  ThumbsUp
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface Article {
  id: string
  title: string
  content: string
  summary: string
  category: string
  tags: string[]
  difficulty: string
  readingTime: number
  views: number
  likes: number
  publishedAt: string
}

interface ArticleViewerProps {
  article: Article
}

export function ArticleViewer({ article }: ArticleViewerProps) {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [summaryStyle, setSummaryStyle] = useState<'concise' | 'eli5' | 'bullet_points' | 'emoji'>('concise')
  const [keyFacts, setKeyFacts] = useState<string[]>([])
  const [relatedArticles, setRelatedArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load initial AI summary
    generateSummary('concise')
    loadRelatedArticles()
    checkIfSaved()
  }, [article.id])

  const generateSummary = async (style: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: article.content,
          maxLength: 300,
          style
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiSummary(data.summary)
      }
    } catch (error) {
      console.error('Failed to generate summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const extractKeyFacts = async () => {
    if (keyFacts.length > 0) return // Already loaded

    try {
      const response = await fetch(`/api/ai/summarize/key-facts?content=${encodeURIComponent(article.content)}`)
      if (response.ok) {
        const data = await response.json()
        setKeyFacts(data.facts)
      }
    } catch (error) {
      console.error('Failed to extract key facts:', error)
    }
  }

  const loadRelatedArticles = async () => {
    try {
      const response = await fetch(`/api/articles/${article.id}/related?limit=3`)
      if (response.ok) {
        const data = await response.json()
        setRelatedArticles(data)
      }
    } catch (error) {
      console.error('Failed to load related articles:', error)
    }
  }

  const checkIfSaved = async () => {
    // Check if article is saved
    const saved = localStorage.getItem(`saved_${article.id}`)
    setIsSaved(saved === 'true')
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // API call to like article
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    localStorage.setItem(`saved_${article.id}`, (!isSaved).toString())
    // API call to save article
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href
        })
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleChat = () => {
    router.push(`/chat?articleId=${article.id}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-left duration-500">
          <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 text-primary font-medium px-3 py-1">
            {article.category}
          </Badge>
          <Badge className={`${getDifficultyColor(article.difficulty)} text-white border-0 px-3 py-1`}>
            {article.difficulty}
          </Badge>
        </div>

        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text animate-in fade-in slide-in-from-left duration-700">
          {article.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-6 text-sm mb-6 animate-in fade-in slide-in-from-left duration-700 delay-100">
          <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <Clock className="h-5 w-5" />
            <span className="font-medium">{article.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <Eye className="h-5 w-5" />
            <span className="font-medium">{article.views} views</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <ThumbsUp className="h-5 w-5" />
            <span className="font-medium">{article.likes} likes</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-left duration-700 delay-200">
          {article.tags.map((tag, idx) => (
            <Badge 
              key={tag} 
              variant="outline"
              className="hover:bg-primary/10 hover:border-primary transition-all cursor-pointer"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap animate-in fade-in slide-in-from-left duration-700 delay-300">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className={`${
              isLiked 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90' 
                : 'hover:border-red-500 hover:text-red-500'
            } transition-all hover:scale-105`}
          >
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            Like
          </Button>
          <Button
            variant={isSaved ? "default" : "outline"}
            size="sm"
            onClick={handleSave}
            className={`${
              isSaved 
                ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90' 
                : 'hover:border-primary hover:text-primary'
            } transition-all hover:scale-105`}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="hover:border-blue-500 hover:text-blue-500 transition-all hover:scale-105"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleChat}
            className="hover:border-secondary hover:text-secondary transition-all hover:scale-105"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="article" className="mb-8">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
          <TabsTrigger value="article" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            <BookOpen className="h-4 w-4 mr-2" />
            Article
          </TabsTrigger>
          <TabsTrigger value="summary" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Summary
          </TabsTrigger>
          <TabsTrigger value="facts" onClick={extractKeyFacts} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            Key Facts
          </TabsTrigger>
          <TabsTrigger value="related" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            Related
          </TabsTrigger>
        </TabsList>

        {/* Full Article */}
        <TabsContent value="article" className="animate-in fade-in duration-500">
          <Card className="p-8 border-2 shadow-xl bg-gradient-to-br from-card to-card/50">
            <ScrollArea className="h-[600px] pr-4">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* AI Summary */}
        <TabsContent value="summary" className="animate-in fade-in duration-500">
          <Card className="p-8 border-2 shadow-xl bg-gradient-to-br from-card to-card/50">
            {/* Summary Style Selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-3 block">
                Summary Style:
              </label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={summaryStyle === 'concise' ? 'default' : 'outline'}
                  onClick={() => {
                    setSummaryStyle('concise')
                    generateSummary('concise')
                  }}
                  className={summaryStyle === 'concise' ? 'bg-gradient-to-r from-primary to-secondary' : 'hover:border-primary'}
                >
                  Concise
                </Button>
                <Button
                  size="sm"
                  variant={summaryStyle === 'eli5' ? 'default' : 'outline'}
                  onClick={() => {
                    setSummaryStyle('eli5')
                    generateSummary('eli5')
                  }}
                  className={summaryStyle === 'eli5' ? 'bg-gradient-to-r from-primary to-secondary' : 'hover:border-primary'}
                >
                  ELI5
                </Button>
                <Button
                  size="sm"
                  variant={summaryStyle === 'bullet_points' ? 'default' : 'outline'}
                  onClick={() => {
                    setSummaryStyle('bullet_points')
                    generateSummary('bullet_points')
                  }}
                  className={summaryStyle === 'bullet_points' ? 'bg-gradient-to-r from-primary to-secondary' : 'hover:border-primary'}
                >
                  Bullet Points
                </Button>
                <Button
                  size="sm"
                  variant={summaryStyle === 'emoji' ? 'default' : 'outline'}
                  onClick={() => {
                    setSummaryStyle('emoji')
                    generateSummary('emoji')
                  }}
                  className={summaryStyle === 'emoji' ? 'bg-gradient-to-r from-primary to-secondary' : 'hover:border-primary'}
                >
                  🎉 Emoji
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground">Generating summary...</p>
              </div>
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="leading-relaxed text-base">{aiSummary || article.summary}</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Key Facts */}
        <TabsContent value="facts" className="animate-in fade-in duration-500">
          <Card className="p-8 border-2 shadow-xl bg-gradient-to-br from-card to-card/50">
            {keyFacts.length > 0 ? (
              <ul className="space-y-4">
                {keyFacts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-4 animate-in fade-in slide-in-from-left duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed text-base pt-1">{fact}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground">Extracting key facts...</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Related Articles */}
        <TabsContent value="related" className="animate-in fade-in duration-500">
          <div className="grid gap-4">
            {relatedArticles.length > 0 ? (
              relatedArticles.map((related, idx) => (
                <Card 
                  key={related.id} 
                  className="p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => router.push(`/article/${related.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg hover:text-primary transition-colors">{related.title}</h3>
                    <Badge className="bg-primary/10 text-primary border-0">{related.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {related.summary.substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{related.readingTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{related.views} views</span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Alert className="border-2">
                <AlertDescription>
                  No related articles found.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
