import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'WikiGen - Wikipedia for Gen Z',
  description: 'Your personalized AI-powered knowledge platform with summarization, Q&A, and community-driven content',
  generator: 'v0.app',
  keywords: 'knowledge, learning, AI, summarization, Q&A, education',
  authors: [{ name: 'WikiGen Team' }],
  openGraph: {
    title: 'WikiGen - Wikipedia for Gen Z',
    description: 'Your personalized AI-powered knowledge platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
