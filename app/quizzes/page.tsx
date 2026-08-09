'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPublishedQuizzes } from '@/app/actions/quizzes'
import { ChevronRight, ClipboardCheck, Clock, CheckCircle } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

interface Quiz {
  id: string
  title: string
  description?: string | null
  timeLimit?: number | null
  maxAttempts?: number | null
  createdAt: Date
  questionCount: number
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublishedQuizzes()
      .then(setQuizzes)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Bài kiểm tra</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-purple-600 rounded" />
          <h1 className="text-2xl font-bold text-gray-900">Bài kiểm tra</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardCheck className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Chưa có bài kiểm tra nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map(quiz => (
              <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
                <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {quiz.title}
                      </h2>
                      {quiz.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{quiz.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ClipboardCheck className="w-4 h-4" />
                          {quiz.questionCount} câu hỏi
                        </span>
                        {quiz.timeLimit && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {quiz.timeLimit} phút
                          </span>
                        )}
                        <span>Số lần tối đa: {quiz.maxAttempts}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Bắt đầu</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © 2024 Trường THCS Nguyễn Trãi. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
