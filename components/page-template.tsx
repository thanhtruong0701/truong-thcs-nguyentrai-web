'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface PageTemplateProps {
  title: string
  breadcrumb: string
  children: React.ReactNode
}

export function PageTemplate({ title, breadcrumb, children }: PageTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-red-700 font-bold text-xl">NT</span>
            </div>
            <div>
              <p className="text-xs opacity-80 tracking-wider uppercase">Cổng thông tin điện tử</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-wide">TRƯỜNG THCS NGUYỄN TRÃI</h1>
              <p className="text-xs opacity-80">Quận Gò Vấp, TP. Hồ Chí Minh</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{breadcrumb}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
          {children}
        </div>
      </div>

      <footer className="bg-gray-800 text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © 2024 Trường THCS Nguyễn Trãi. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
