import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { getSettings } from '@/app/actions/settings'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trường THCS Nguyễn Trãi',
  description: 'Cổng thông tin điện tử Trường THCS Nguyễn Trãi - Tây Ninh',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let primaryColor = '#1e3a5f'
  try {
    const settings = await getSettings()
    if (settings.primaryColor) {
      primaryColor = settings.primaryColor
    }
  } catch (err) {
    console.error('Error loading initial layout settings:', err)
  }

  return (
    <html lang="vi" className="bg-background">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --primary: ${primaryColor} !important;
                --header-color: ${primaryColor} !important;
              }
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans text-foreground">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
