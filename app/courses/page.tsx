'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight, Calendar, Eye, FileText, Download } from 'lucide-react'
import { getPublishedCourses, getCourseById } from '@/app/actions/courses'
import { Modal } from '@/components/modal'

interface Course {
  id: string
  title: string
  description?: string | null
  gradeLevel?: number | null
  createdAt: Date
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    getPublishedCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCourseClick = useCallback(async (id: string) => {
    try {
      const data = await getCourseById(id)
      if (data) {
        setSelectedCourse(data)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header-bg text-white animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-blue-700 font-bold text-xl">NT</span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 animate-fadeInUp">
          <div className="w-1 h-6 section-bar rounded" />
          <h1 className="text-2xl font-bold text-gray-900">Khóa học trực tuyến</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400 animate-fadeIn">
            Chưa có khóa học nào
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer hover:-translate-y-1 animate-fadeInUp"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                  {course.title}
                </h2>
                {course.description && (
                  <p className="text-sm text-gray-500 line-clamp-3 mb-3">{course.description}</p>
                )}
                <div className="flex items-center justify-between">
                  {course.gradeLevel && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-200">
                      Lớp {course.gradeLevel}
                    </span>
                  )}
                  <span className="text-sm text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Xem chi tiết <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © 2024 Trường THCS Nguyễn Trãi. All rights reserved.
        </div>
      </footer>

      {/* Course Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCourse?.title}
      >
        {selectedCourse && (
          <CourseModalContent courseId={selectedCourse.id} selectedCourse={selectedCourse} />
        )}
      </Modal>
    </div>
  )
}

function CourseModalContent({ courseId, selectedCourse }: { courseId: string; selectedCourse: Course }) {
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourseById(courseId)
      .then(async (c) => {
        const { getLessonsByCourse, getMaterialsByLesson } = await import('@/app/actions/courses')
        const lessonList = await getLessonsByCourse(courseId)
        const lessonsWithMaterials = await Promise.all(
          lessonList.map(async (l: any) => {
            const mats = await getMaterialsByLesson(l.id)
            return { ...l, materials: mats }
          })
        )
        setLessons(lessonsWithMaterials)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [courseId])

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{selectedCourse.title}</h3>
          {selectedCourse.gradeLevel && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">Lớp {selectedCourse.gradeLevel}</span>
          )}
        </div>
      </div>

      {selectedCourse.description && (
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
          {selectedCourse.description}
        </div>
      )}

      {/* Danh sách Bài giảng & File đính kèm */}
      <div className="space-y-3 pt-2">
        <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Danh sách bài giảng & Tài liệu ({lessons.length})
        </h4>

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : lessons.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Chưa có bài giảng nào trong khóa học này.</p>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <div key={lesson.id} className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 font-bold rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="font-medium text-sm text-gray-900">{lesson.title}</h5>
                    {lesson.content && <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{lesson.content}</p>}
                  </div>
                </div>

                {/* Tài liệu của bài học */}
                {lesson.materials && lesson.materials.length > 0 && (
                  <div className="pl-8 space-y-1.5 pt-1">
                    <p className="text-xs font-semibold text-gray-600">Tài liệu đính kèm:</p>
                    {lesson.materials.map((mat: any) => (
                      <a
                        key={mat.id}
                        href={mat.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition text-xs font-medium border border-blue-100"
                      >
                        <Download className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate flex-1">{mat.title}</span>
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] flex-shrink-0">Tải về</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Ngày tạo: {new Date(selectedCourse.createdAt).toLocaleDateString('vi-VN')}
        </span>
        <Link
          href={`/courses/${selectedCourse.id}`}
          className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          Trang chi tiết
        </Link>
      </div>
    </div>
  )
}
