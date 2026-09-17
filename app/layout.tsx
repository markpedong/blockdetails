import type { Metadata } from 'next'
import './globals.css'
import SiteHeader from '@/components/header'
import Footer from '@/components/footer'
import { ThemeProvider } from '@/components/theme'
import { Toaster } from 'sonner'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'BlockDetails — Real-time Crypto Market Data',
  description:
    'Track cryptocurrency prices, market cap, volume, and trends across thousands of digital assets.',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
