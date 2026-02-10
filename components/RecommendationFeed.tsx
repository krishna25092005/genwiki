/**
 * Recommendation Feed Component
 * Displays personalized content recommendations
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sparkles, TrendingUp, Clock, Eye, RefreshCw } from 'lucide-react'

interface Article {
  id: string
  title: string
  summary: string
  category: string
  difficulty: string
  readingTime: number
  views: number
  likes: number
  tags: string[]
}

export function RecommendationFeed() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Article[]>([])
  const [trending, setTrending] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'personalized' | 'trending'>('personalized')

  useEffect(() => {
    loadRecommendations()
    loadTrending()
  }, [])

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token')
      
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/ai/recommendations?limit=6', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data)
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTrending = async () => {
    try {
      const response = await fetch('/api/articles/trending?limit=6')
      
      if (response.ok) {
        const data = await response.json()
        setTrending(data)
      }
    } catch (error) {
      console.error('Failed to load trending:', error)
    }
  }

  const handleRefresh = () => {
    if (activeTab === 'personalized') {
      loadRecommendations()
    } else {
      loadTrending()
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const ArticleCard = ({ article }: { article: Article }) => (
    <Card 
      className="p-4 hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => router.push(`/article/${article.id}`)}
    >
      <div className="flex justify-between items-start mb-3">
        <Badge variant="secondary">{article.category}</Badge>
        <Badge className={getDifficultyColor(article.difficulty)}>
          {article.difficulty}
        </Badge>
      </div>

      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
        {article.title}
      </h3>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {article.summary}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {article.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            #{tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readingTime} min
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {article.views}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 px-2">
          Read →
        </Button>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={activeTab === 'personalized' ? 'default' : 'outline'}
            onClick={() => setActiveTab('personalized')}
            size="sm"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            For You
          </Button>
          <Button
            variant={activeTab === 'trending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('trending')}
            size="sm"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-20 mb-3" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="flex gap-2 mb-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-32" />
            </Card>
          ))}
        </div>
      ) : activeTab === 'personalized' ? (
        recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Sign in to get personalized recommendations based on your interests!
            </AlertDescription>
          </Alert>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trending.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
