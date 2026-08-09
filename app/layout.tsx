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
  let bgImage = ''
  let bgMode = 'cover'
  let bgOverlay = 'light'
  let bgFixed = 'true'

  try {
    const settings = await getSettings()
    if (settings.primaryColor) primaryColor = settings.primaryColor
    if (settings.bgImage) bgImage = settings.bgImage
    if (settings.bgMode) bgMode = settings.bgMode
    if (settings.bgOverlay) bgOverlay = settings.bgOverlay
    if (settings.bgFixed) bgFixed = settings.bgFixed
  } catch (err) {
    console.error('Error loading initial layout settings:', err)
  }

  let bodyBgStyle = ''
  if (bgImage) {
    const bgSize = bgMode === 'repeat' ? 'auto' : (bgMode === 'contain' ? 'contain' : 'cover')
    const bgRepeat = bgMode === 'repeat' ? 'repeat' : 'no-repeat'
    const bgAttachment = bgFixed === 'false' ? 'scroll' : 'fixed'

    bodyBgStyle = `
      body {
        background-image: url('${bgImage}') !important;
        background-size: ${bgSize} !important;
        background-repeat: ${bgRepeat} !important;
        background-attachment: ${bgAttachment} !important;
        background-position: center top !important;
      }
    `
  }

  let overlayClass = ''
  if (bgImage) {
    if (bgOverlay === 'light') overlayClass = 'bg-white/80 backdrop-blur-[2px]'
    else if (bgOverlay === 'medium') overlayClass = 'bg-white/60'
    else if (bgOverlay === 'none') overlayClass = 'bg-transparent'
    else if (bgOverlay === 'dark') overlayClass = 'bg-black/40 text-white'
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
              ${bodyBgStyle}
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans text-foreground min-h-screen">
        <ThemeProvider>
          <div className={`min-h-screen ${overlayClass}`}>
            {children}
          </div>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
