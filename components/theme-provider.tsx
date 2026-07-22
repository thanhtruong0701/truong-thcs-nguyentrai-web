'use client'

import { useEffect, useState } from 'react'
import { getSettings } from '@/app/actions/settings'

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    getSettings().then(s => {
      setSettings(s)
      const primary = s.primaryColor || '#1e3a5f'
      const darker = adjustColor(primary, -30)
      const lighter = adjustColor(primary, 20)

      const root = document.documentElement
      root.style.setProperty('--primary', primary)
      root.style.setProperty('--header-color', primary)
      root.style.setProperty('--header-dark', darker)
      root.style.setProperty('--header-light', lighter)
    })
  }, [])

  return <>{children}</>
}

export function useThemeColor() {
  const [color, setColor] = useState('#1e3a5f')

  useEffect(() => {
    getSettings().then(s => {
      if (s.primaryColor) setColor(s.primaryColor)
    })
  }, [])

  return color
}

export function getGradientStyle(primaryColor?: string) {
  const primary = primaryColor || '#1e3a5f'
  const darker = adjustColor(primary, -30)
  return `linear-gradient(to right, ${darker}, ${primary}, ${darker})`
}

export function getHeaderBg(primaryColor?: string) {
  return primaryColor || '#1e3a5f'
}
