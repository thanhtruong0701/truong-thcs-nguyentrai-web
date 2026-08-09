'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search as SearchIcon, FileText, BookOpen, ChevronRight } from 'lucide-react'
import { searchContent } from '@/app/actions/search'
import { SiteHeader } from '@/components/site-header'

interface Announcement {
  id: string
  title: string
  content: string
  imageUrl?: string | null
  createdAt: Date
}

interface Course {
  id: string
  title: string
  description?: string | null
  gradeLevel?: number | null
  createdAt: Date
}

interface Page {
  id: string
  title: string
  content: string
  imageUrl?: string | null
  createdAt: Date
  menuLabel?: string | null
}

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<{
    announcements: Announcement[]
    courses: Course[]
    pages: Page[]
  }>({ announcements: [], courses: [], pages: [] })
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery])

  async function handleSearch(q?: string) {
    const searchTerm = q || query
    if (!searchTerm.trim()) return

    setLoading(true)
    setSearched(true)
    try {
      const data = await searchContent(searchTerm)
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSearch()
  }

  const totalResults = results.announcements.length + results.courses.length + results.pages.length

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Box */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm tin tức, khóa học, nội dung..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-red-800 focus:ring-2 focus:ring-red-200 outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-red-800 text-white rounded-lg font-medium hover:bg-red-900 transition-colors"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : searched ? (
          totalResults === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy kết quả cho &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-500">Tìm thấy {totalResults} kết quả</p>

              {/* Announcements */}
              {results.announcements.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-800" />
                    Tin tức ({results.announcements.length})
                  </h2>
                  <div className="space-y-3">
                    {results.announcements.map(ann => (
                      <Link key={ann.id} href={`/announcements/${ann.id}`}>
                        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all cursor-pointer">
                          <h3 className="font-medium text-gray-900 hover:text-blue-800 transition-colors">{ann.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{ann.content}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(ann.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses */}
              {results.courses.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Khóa học ({results.courses.length})
                  </h2>
                  <div className="space-y-3">
                    {results.courses.map(course => (
                      <Link key={course.id} href={`/courses/${course.id}`}>
                        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all cursor-pointer">
                          <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">{course.title}</h3>
                          {course.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{course.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            {course.gradeLevel && <span>Lớp {course.gradeLevel}</span>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Pages */}
              {results.pages.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Nội dung trang ({results.pages.length})
                  </h2>
                  <div className="space-y-3">
                    {results.pages.map(page => (
                      <div key={page.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all">
                        <h3 className="font-medium text-gray-900">{page.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{page.content}</p>
                        {page.menuLabel && (
                          <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                            {page.menuLabel}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nhập từ khóa để tìm kiếm</p>
          </div>
        )}
      </div>

      <footer className="bg-gray-800 text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © 2024 Trường THCS Nguyễn Trãi. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
