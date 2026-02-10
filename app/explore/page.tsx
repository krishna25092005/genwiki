'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Search, Heart, MessageCircle, Sparkles, TrendingUp, Clock, LogOut, Plus, Loader2 } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

interface Article {
  id: string
  title: string
  summary: string
  category: string
  difficulty: string
  readingTime: number
  likes: number
}

const SAMPLE_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding Machine Learning',
    summary: 'A comprehensive guide to machine learning fundamentals and applications.',
    category: 'Technology',
    difficulty: 'intermediate',
    readingTime: 8,
    likes: 234,
  },
  {
    id: '2',
    title: 'Climate Change: The Science Behind It',
    summary: 'Explore the scientific evidence and mechanisms of global climate change.',
    category: 'Science',
    difficulty: 'medium',
    readingTime: 10,
    likes: 412,
  },
  {
    id: '3',
    title: 'Digital Privacy in 2024',
    summary: 'Your guide to protecting your digital footprint and online privacy.',
    category: 'Security',
    difficulty: 'easy',
    readingTime: 6,
    likes: 189,
  },
  {
    id: '4',
    title: 'The Future of Renewable Energy',
    summary: 'Discover the latest innovations in solar, wind, and clean energy.',
    category: 'Environment',
    difficulty: 'medium',
    readingTime: 9,
    likes: 567,
  },
]

export default function ExplorePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [wikiResults, setWikiResults] = useState<any[]>([])
  const [showWikiSearch, setShowWikiSearch] = useState(false)
  const [importing, setImporting] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    fetchArticles()
  }, [router])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('http://localhost:8000/api/v1/articles/search?limit=20', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setArticles(data.results || [])
      } else {
        // Fallback to sample articles if API fails
        setArticles(SAMPLE_ARTICLES)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      // Fallback to sample articles if API fails
      setArticles(SAMPLE_ARTICLES)
    } finally {
      setLoading(false)
    }
  }

  const searchWikipedia = async () => {
    if (!searchQuery.trim()) return
    
    try {
      console.log('Searching Wikipedia for:', searchQuery)
      setShowWikiSearch(true)
      setWikiResults([]) // Clear previous results
      const token = localStorage.getItem('token')
      
      const response = await fetch(
        `http://localhost:8000/api/v1/articles/wikipedia/search?query=${encodeURIComponent(searchQuery)}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      console.log('Wikipedia search response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Wikipedia search results:', data)
        setWikiResults(data.results || [])
        
        if (!data.results || data.results.length === 0) {
          alert('No results found on Wikipedia. Try a different search term.')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Wikipedia search failed:', errorData)
        alert(`Failed to search Wikipedia: ${errorData.detail || 'Server error'}. Make sure the backend is running.`)
      }
    } catch (error) {
      console.error('Error searching Wikipedia:', error)
      alert('Cannot connect to backend server. Please make sure it is running on http://localhost:8000')
    }
  }

  const importFromWikipedia = async (title: string) => {
    try {
      console.log('Importing article:', title)
      setImporting(title)
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please login to import articles')
        router.push('/login')
        return
      }
      
      const response = await fetch(
        `http://localhost:8000/api/v1/articles/wikipedia/import?title=${encodeURIComponent(title)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      console.log('Import response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Import success:', data)
        alert(data.message || 'Article imported successfully!')
        
        // Refresh articles list
        await fetchArticles()
        setShowWikiSearch(false)
        setSearchQuery('')
        
        // Navigate to the new article
        if (data.article) {
          router.push(`/article/${data.article.id}`)
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to import article:', errorData)
        alert(`Failed to import article: ${errorData.detail || 'Server error'}`)
      }
    } catch (error) {
      console.error('Error importing article:', error)
      alert('Cannot connect to backend server. Please make sure it is running on http://localhost:8000')
    } finally {
      setImporting(null)
    }
  }

  const categories = ['all', 'Technology', 'Science', 'Security', 'Environment']

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              WikiGen
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/chat')}
              className="hover:bg-primary/10"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/saved')}
              className="hover:bg-primary/10"
            >
              <Heart className="h-4 w-4 mr-2" />
              Saved
            </Button>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/')
              }}
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explore Topics
            </h1>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground mb-6">Discover knowledge across thousands of topics</p>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search topics, articles, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    searchWikipedia()
                  }
                }}
                className="pl-10 h-12 border-2 focus:border-primary"
              />
            </div>
            <Button
              onClick={searchWikipedia}
              disabled={!searchQuery.trim()}
              className="h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg px-6"
            >
              <Plus className="h-5 w-5 mr-2" />
              Find on Wikipedia
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">{categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className={`capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90'
                    : 'hover:border-primary hover:text-primary'
                }`}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Wikipedia Search Results */}
        {showWikiSearch && wikiResults.length > 0 && (
          <Card className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 animate-in fade-in slide-in-from-top">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Wikipedia Results for "{searchQuery}"</h3>
                  <p className="text-sm text-muted-foreground">
                    Click "Import" to add any article to your library
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowWikiSearch(false)
                  setWikiResults([])
                }}
              >
                Close
              </Button>
            </div>
            <div className="grid gap-3">
              {wikiResults.map((result, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-card border-2 border-border/50 rounded-xl hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-foreground mb-2">{result.title}</h4>
                      <p 
                        className="text-sm text-muted-foreground line-clamp-2" 
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                      />
                    </div>
                    <Button
                      onClick={() => importFromWikipedia(result.title)}
                      disabled={importing === result.title}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg whitespace-nowrap"
                    >
                      {importing === result.title ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Import
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground text-lg">Loading amazing content...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, idx) => (
                <Card
                  key={article.id}
                  className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => router.push(`/article/${article.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center ml-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      {article.category}
                    </Badge>
                    <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-0 capitalize">
                      {article.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Heart className="h-4 w-4" />
                        {article.likes}
                      </div>
                      <MessageCircle className="h-4 w-4 hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {!loading && filteredArticles.length === 0 && !showWikiSearch && (
              <div className="text-center py-20">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <p className="text-xl font-semibold text-foreground mb-2">
                  No articles found matching your criteria
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchQuery ? `Can't find "${searchQuery}"? Try searching Wikipedia!` : 'Try adjusting your search or filters'}
                </p>
                
                {searchQuery && (
                  <Button 
                    onClick={searchWikipedia}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
                    size="lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Search Wikipedia for "{searchQuery}"
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
