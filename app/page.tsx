'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, Brain, Users, Zap, ArrowRight, BookOpen, TrendingUp } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-lg bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              WikiGen
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => router.push('/login')}
              className="hover:bg-primary/10"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => router.push('/register')}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by AI</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-foreground mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Wikipedia for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient">
              Gen Z
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 leading-relaxed">
            Discover knowledge with AI-powered summaries, real-time Q&A, and content
            personalized just for you. Learning has never been this engaging.
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Button
              size="lg"
              onClick={() => router.push('/explore')}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Exploring
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="border-2 hover:bg-accent/10"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card className="p-6 hover:shadow-2xl transition-all hover:scale-105 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Summaries</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get instant summaries of complex topics in seconds with cutting-edge AI
            </p>
          </Card>

          <Card className="p-6 hover:shadow-2xl transition-all hover:scale-105 hover:border-secondary/50 bg-gradient-to-br from-card to-card/50 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Q&A</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ask questions and get intelligent, context-aware answers instantly
            </p>
          </Card>

          <Card className="p-6 hover:shadow-2xl transition-all hover:scale-105 hover:border-purple-500/50 bg-gradient-to-br from-card to-card/50 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Community</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect with peers and share your knowledge and insights
            </p>
          </Card>

          <Card className="p-6 hover:shadow-2xl transition-all hover:scale-105 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 animate-in fade-in slide-in-from-bottom duration-700 delay-400">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Personalized</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Content tailored to your interests and learning level
            </p>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-8 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-purple-500/5 border border-border/50">
          <div className="text-center group cursor-pointer">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              10K+
            </div>
            <p className="text-muted-foreground font-medium">Topics Covered</p>
            <TrendingUp className="h-5 w-5 text-primary mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-5xl font-bold bg-gradient-to-r from-secondary to-purple-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              50K+
            </div>
            <p className="text-muted-foreground font-medium">Active Users</p>
            <Users className="h-5 w-5 text-secondary mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              100K+
            </div>
            <p className="text-muted-foreground font-medium">Questions Answered</p>
            <Brain className="h-5 w-5 text-purple-500 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-auto bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="/explore" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="/chat" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">
                    <span>Chat</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="/saved" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">
                    <span>Saved Topics</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Follow</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">&copy; 2024 WikiGen. All rights reserved.</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Made with ❤️ for learners everywhere
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
