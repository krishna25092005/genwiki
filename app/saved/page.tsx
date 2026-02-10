'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bookmark, Heart, Trash2, Sparkles, BookOpen, Calendar } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

interface SavedArticle {
  id: string
  title: string
  category: string
  savedAt: string
  notes: string
}

const SAMPLE_SAVED: SavedArticle[] = [
  {
    id: '1',
    title: 'Understanding Machine Learning',
    category: 'Technology',
    savedAt: '2024-01-15',
    notes: 'Great introduction to ML concepts',
  },
  {
    id: '2',
    title: 'Climate Change: The Science Behind It',
    category: 'Science',
    savedAt: '2024-01-14',
    notes: 'Useful for school project',
  },
]

export default function SavedPage() {
  const router = useRouter()
  const [saved, setSaved] = useState(SAMPLE_SAVED)

  const handleRemove = (id: string) => {
    setSaved((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 bg-card/80 backdrop-blur-lg z-50">
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
              onClick={() => router.push('/explore')}
              className="hover:bg-primary/10"
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Explore
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/chat')}
              className="hover:bg-primary/10"
              size="sm"
            >
              Chat
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/')
              }}
              className="hover:bg-destructive/10 hover:text-destructive"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4">
            <Bookmark className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Saved Articles
          </h1>
          <p className="text-xl text-muted-foreground">
            Your personal knowledge library
          </p>
        </div>

        {/* Saved Articles Grid */}
        {saved.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No saved articles yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring and save articles you want to read later
            </p>
            <Button onClick={() => router.push('/explore')} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <BookOpen className="h-4 w-4 mr-2" />
              Explore Articles
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">{saved.map((item, idx) => (
              <Card
                key={item.id}
                className="p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => router.push(`/article/${item.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mb-4 italic px-2 py-1 bg-muted/50 rounded-lg inline-block">
                        📝 {item.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 px-3 py-1">
                        {item.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Saved on {new Date(item.savedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="hover:bg-red-500/10 hover:text-red-500 transition-colors h-10 w-10"
                    >
                      <Heart className="h-5 w-5 fill-current text-red-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(item.id)
                      }}
                      className="hover:bg-destructive/10 hover:text-destructive transition-colors h-10 w-10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
