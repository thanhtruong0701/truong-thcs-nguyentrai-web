'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, ChevronRight, BookOpen, FileText, Download } from 'lucide-react'
import { getCourseById, getLessonsByCourse, getMaterialsByLesson } from '@/app/actions/courses'

interface Course {
  id: string
  title: string
  description?: string | null
  gradeLevel?: number | null
  teacherId: string
  isPublished: boolean
  createdAt: Date
}

interface Lesson {
  id: string
  courseId: string
  title: string
  content?: string | null
  orderIndex: number
  createdAt: Date
}

interface Material {
  id: string
  lessonId: string
  title: string
  fileUrl: string
  fileType: string
  fileSize?: number | null
  createdAt: Date
}

export default function CourseDetailPage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      Promise.all([
        getCourseById(params.id as string),
        getLessonsByCourse(params.id as string),
      ])
        .then(([courseData, lessonsData]) => {
          if (courseData) {
            setCourse(courseData)
            setLessons(lessonsData)
          } else {
            setError('Không tìm thấy khóa học')
          }
        })
        .catch((err) => {
          console.error('Error:', err)
          setError('Lỗi khi tải khóa học')
        })
        .finally(() => setLoading(false))
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-red-700 font-bold text-xl">NT</span>
              </div>
              <div>
                <p className="text-xs opacity-80 tracking-wider uppercase">Cổng thông tin điện tử</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide">TRƯỜNG THCS NGUYỄN TRÃI</h1>
              </div>
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-red-700 font-bold text-xl">NT</span>
              </div>
              <div>
                <p className="text-xs opacity-80 tracking-wider uppercase">Cổng thông tin điện tử</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide">TRƯỜNG THCS NGUYỄN TRÃI</h1>
              </div>
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <p className="text-gray-500 mb-4">{error || 'Không tìm thấy khóa học'}</p>
            <Link href="/courses" className="text-red-600 hover:text-red-700 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay về danh sách khóa học
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-red-700 font-bold text-xl">NT</span>
              </div>
              <div>
                <p className="text-xs opacity-80 tracking-wider uppercase">Cổng thông tin điện tử</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide group-hover:tracking-wider transition-all duration-300">TRƯỜNG THCS NGUYỄN TRÃI</h1>
                <p className="text-xs opacity-80">Quận Gò Vấp, TP. Hồ Chí Minh</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/courses" className="hover:text-red-600 transition-colors">Khóa học</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium line-clamp-1">{course.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeInUp">
        {/* Course Info */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
          <div className="p-6">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors duration-200 group mb-4"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Quay về danh sách
            </Link>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {course.gradeLevel && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      Lớp {course.gradeLevel}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {lessons.length} bài giảng
                  </span>
                </div>
              </div>
            </div>

            {course.description && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Giới thiệu khóa học</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Danh sách bài giảng</h2>
          </div>
          
          {lessons.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Chưa có bài giảng nào
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {lessons.map((lesson, i) => (
                <LessonItem key={lesson.id} lesson={lesson} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © 2024 Trường THCS Nguyễn Trãi. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function LessonItem({ lesson, index }: { lesson: Lesson; index: number }) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [showMaterials, setShowMaterials] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleMaterials = async () => {
    if (!showMaterials && materials.length === 0) {
      setLoading(true)
      try {
        const data = await getMaterialsByLesson(lesson.id)
        setMaterials(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    setShowMaterials(!showMaterials)
  }

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{lesson.title}</h3>
          {lesson.content && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">{lesson.content}</p>
          )}
          <button
            onClick={toggleMaterials}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <Download className="w-4 h-4" />
            {loading ? 'Đang tải...' : `Tài liệu (${materials.length})`}
          </button>
          
          {showMaterials && materials.length > 0 && (
            <div className="mt-3 space-y-2 animate-fadeIn">
              {materials.map((material) => (
                <a
                  key={material.id}
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">{material.title}</span>
                  {material.fileSize && (
                    <span className="text-xs text-gray-400 ml-auto">
                      {(material.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
