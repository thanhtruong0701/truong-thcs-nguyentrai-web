'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/site-header'
import { BookOpen, Phone, MapPin, Mail, Calendar, ChevronRight } from 'lucide-react'
import { getAnnouncements } from '@/app/actions/announcements'
import { getPublishedCourses } from '@/app/actions/courses'
import { getVisibleMenuItems } from '@/app/actions/menus'
import { getSettings } from '@/app/actions/settings'

interface Announcement {
  id: string
  title: string
  content: string
  imageUrl?: string | null
  fileUrl?: string | null
  fileName?: string | null
  fileType?: string | null
  isPinned: boolean
  createdAt: Date
}

interface Course {
  id: string
  title: string
  description?: string | null
  gradeLevel?: number | null
  createdAt: Date
}

interface MenuItem {
  id: string
  label: string
  link: string
  icon: string | null
  menuType: string | null
  parentId: string | null
  orderIndex: number
  isVisible: boolean
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}


function formatLink(link: string | null | undefined, itemId: string, label: string): string {
  if (!link || link === '#' || link === '/') {
    const cleanLabel = label.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return `/${cleanLabel || itemId}`
  }
  if (link.startsWith('/') || link.startsWith('http')) return link
  return `/${link}`
}

export default function HomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set())
  const [schoolSettings, setSchoolSettings] = useState<any>(null)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())

  function toggleMenu(id: string) {
    setExpandedMenus(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    Promise.all([getAnnouncements(), getPublishedCourses(), getVisibleMenuItems(), getSettings()])
      .then(([anns, crs, menus, settings]) => {
        setAnnouncements(anns)
        setCourses(crs)
        setMenuItemsList(menus)
        setSchoolSettings(settings)
        // Apply color from database
        if (settings.primaryColor) {
          document.documentElement.style.setProperty('--primary', settings.primaryColor)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedItems((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [loading])

  const pinnedAnnouncements = announcements.filter(a => a.isPinned)
  const recentAnnouncements = announcements.slice(0, 8)
  const latestCourses = courses.slice(0, 6)

  // Build menu tree
  const rootMenuItems = menuItemsList.filter(i => !i.parentId)
  const getSubItems = (parentId: string) => menuItemsList.filter(i => i.parentId === parentId)

  const now = new Date()
  const dayNames = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const dateStr = `${dayNames[now.getDay()]}, ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Danh mục */}
          <aside className="lg:col-span-2 animate-slideRight">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-white px-4 py-2.5" style={{ backgroundColor: schoolSettings?.primaryColor || '#1e3a5f' }}>
                <h3 className="font-bold text-sm uppercase tracking-wide">Danh mục</h3>
              </div>
              <nav className="divide-y divide-gray-100">
                {rootMenuItems.map((item, i) => {
                  const children = getSubItems(item.id)
                  const hasChildren = children.length > 0
                  const isExpanded = expandedMenus.has(item.id)
                  return (
                    <div key={item.id}>
                      {/* Root item - nếu có con thì click để toggle */}
                      {hasChildren ? (
                        <button
                          onClick={() => toggleMenu(item.id)}
                          className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 flex items-center gap-2 group text-left"
                        >
                          <span className="text-base">{item.icon || '📄'}</span>
                          <span className="flex-1">{item.label}</span>
                          <svg
                            className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : item.menuType === 'category' ? (
                        <div className="px-4 py-2.5 text-sm font-semibold text-gray-500 bg-gray-50 flex items-center gap-2">
                          <span className="text-base">{item.icon || '📄'}</span>
                          {item.label}
                        </div>
                      ) : (
                        <Link
                          href={item.link}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 flex items-center gap-2 group"
                        >
                          <span className="text-base group-hover:scale-125 transition-transform duration-200">
                            {item.icon || '📄'}
                          </span>
                          <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
                          {item.label}
                        </Link>
                      )}

                      {/* Sub items - chỉ hiện khi expanded */}
                      {hasChildren && isExpanded && (
                        <div className="bg-gray-50 border-t border-gray-100">
                          {children.map(child => (
                            <Link
                              key={child.id}
                              href={formatLink(child.link, child.id, child.label)}
                              className="flex items-center gap-2 pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 border-l-2 border-blue-300 ml-4"
                            >
                              <span className="text-sm">{child.icon || '📄'}</span>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>

            {/* Quick Links */}
            <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-white px-4 py-2.5" style={{ backgroundColor: schoolSettings?.primaryColor ? adjustColor(schoolSettings.primaryColor, 20) : '#2563eb' }}>
                <h3 className="font-bold text-sm uppercase tracking-wide">Liên kết nhanh</h3>
              </div>
              <div className="p-3 space-y-2">
                <Link href="/courses" className="block px-3 py-2 bg-blue-50 rounded text-sm text-blue-700 hover:bg-blue-100 transition-all duration-200 hover:translate-x-1">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Khóa học trực tuyến
                </Link>
                <Link href="/contact" className="block px-3 py-2 bg-green-50 rounded text-sm text-green-700 hover:bg-green-100 transition-all duration-200 hover:translate-x-1">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Liên hệ nhà trường
                </Link>
              </div>
            </div>
          </aside>

          {/* Center Content */}
          <main className="lg:col-span-7">
            {/* Banner / Slider placeholder */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white mb-6 relative overflow-hidden group animate-fadeInUp hover:shadow-xl transition-shadow duration-300">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white rounded-full group-hover:scale-150 transition-transform duration-700" />
              </div>
              <div className="relative">
                <p className="text-sm opacity-80 mb-1 animate-slideRight">Quản lý Quận Gò Vấp</p>
                <h2 className="text-xl md:text-2xl font-bold mb-2 animate-slideRight" style={{ animationDelay: '100ms' }}>Trường THCS Nguyễn Trãi</h2>
                <p className="text-sm opacity-90 mb-4 animate-slideRight" style={{ animationDelay: '200ms' }}>Nơi ươm mầm tri thức,培养 tài năng tương lai</p>
                <div className="flex gap-3 animate-slideRight" style={{ animationDelay: '300ms' }}>
                  <Link href="/courses" className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all duration-200 hover:scale-105 hover:shadow-lg">
                    Khóa học
                  </Link>
                  <Link href="/contact" className="border border-white/50 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200 hover:scale-105 hover:shadow-lg">
                    Liên hệ
                  </Link>
                </div>
              </div>
            </div>

            {/* Tin tức nổi bật */}
            {pinnedAnnouncements.length > 0 && (
              <div className="mb-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded" style={{ backgroundColor: schoolSettings?.primaryColor || '#1e3a5f' }} />
                  <h2 className="text-lg font-bold text-gray-900">Tin nổi bật</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinnedAnnouncements.slice(0, 2).map((ann, i) => (
                    <Link key={ann.id} href={`/announcements/${ann.id}`}>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        {ann.imageUrl && (
                          <img src={ann.imageUrl} alt="" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors duration-200 line-clamp-2 mb-2">
                            {ann.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{ann.content}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tin tức sự kiện */}
            <div className="mb-6 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded" style={{ backgroundColor: schoolSettings?.primaryColor || '#1e3a5f' }} />
                  <h2 className="text-lg font-bold text-gray-900">Tin tức - Sự kiện</h2>
                </div>
                <Link href="/#announcements" className="text-sm text-blue-800 hover:text-blue-700 flex items-center gap-1 group">
                  Xem thêm <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentAnnouncements.slice(0, 6).map((ann, i) => (
                  <Link key={ann.id} href={`/announcements/${ann.id}`}>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300 group cursor-pointer flex gap-4 hover:-translate-y-0.5"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {ann.imageUrl && (
                        <img src={ann.imageUrl} alt="" className="w-24 h-20 rounded object-cover flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-800 transition-colors duration-200 line-clamp-1 mb-1">
                          {ann.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{ann.content}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(ann.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                {recentAnnouncements.length === 0 && !loading && (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
                    Chưa có tin tức nào
                  </div>
                )}
              </div>
            </div>

            {/* Khóa học nổi bật */}
            {latestCourses.length > 0 && (
              <div className="animate-fadeInUp" style={{ animationDelay: '600ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded" style={{ backgroundColor: schoolSettings?.primaryColor ? adjustColor(schoolSettings.primaryColor, 20) : '#2563eb' }} />
                    <h2 className="text-lg font-bold text-gray-900">Khóa học mới</h2>
                  </div>
                  <Link href="/courses" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                    Xem thêm <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {latestCourses.slice(0, 3).map((course, i) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors duration-200">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                      )}
                      {course.gradeLevel && (
                        <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-200">
                          Lớp {course.gradeLevel}
                        </span>
                      )}
                      <div className="mt-3 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Nhấn để xem chi tiết →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 animate-slideLeft">
            {/* Tin nổi bật */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4 hover:shadow-md transition-shadow duration-300">
              <div className="text-white px-4 py-2.5" style={{ backgroundColor: schoolSettings?.primaryColor || '#1e3a5f' }}>
                <h3 className="font-bold text-sm uppercase tracking-wide">Tin nổi bật</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {announcements.slice(0, 5).map((ann, i) => (
                  <Link key={ann.id} href={`/announcements/${ann.id}`}>
                    <div className="px-4 py-3 hover:bg-gray-50 transition-all duration-200 group cursor-pointer">
                      <div className="flex gap-3">
                        <span className="text-2xl font-bold text-gray-200 group-hover:text-blue-200 transition-colors duration-200">{i + 1}</span>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-800 transition-colors duration-200 line-clamp-2">
                            {ann.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(ann.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Liên hệ */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-white px-4 py-2.5" style={{ backgroundColor: schoolSettings?.primaryColor ? adjustColor(schoolSettings.primaryColor, 20) : '#2563eb' }}>
                <h3 className="font-bold text-sm uppercase tracking-wide">Thông tin liên hệ</h3>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex items-start gap-3 group cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-blue-500 transition-colors duration-200" />
                  <div>
                    <p className="font-medium text-gray-900">Địa chỉ</p>
                    <p className="text-gray-500">{schoolSettings?.schoolAddress || '250 Nguyễn Trọng Cát, phường Tân Ninh, Tây Ninh'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-blue-500 transition-colors duration-200" />
                  <div>
                    <p className="font-medium text-gray-900">Điện thoại</p>
                    <p className="text-gray-500">{schoolSettings?.schoolPhone || '02763621963'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-blue-500 transition-colors duration-200" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-500">{schoolSettings?.schoolEmail || 'nguyentraitx@gmail.com'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-blue-500 transition-colors duration-200" />
                  <div>
                    <p className="font-medium text-gray-900">Giờ làm việc</p>
                    <p className="text-gray-500">{schoolSettings?.workingHours || 'Thứ 2 - Thứ 6: 7:00 - 17:00'}</p>
                    <p className="text-gray-500">Thứ 7: 7:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <span className="text-blue-700 font-bold">NT</span>
                </div>
                <div>
                  <p className="font-bold">{schoolSettings?.schoolName || 'THCS Nguyễn Trãi'}</p>
                  <p className="text-xs text-gray-400">{schoolSettings?.schoolAddress || 'Tây Ninh'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Cổng thông tin điện tử {schoolSettings?.schoolName || 'trường THCS Nguyễn Trãi'} - Nơi kết nối học sinh, giáo viên và phụ huynh.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Liên kết</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/courses" className="block hover:text-white transition-colors duration-200 hover:translate-x-1">Khóa học</Link>
                <Link href="/contact" className="block hover:text-white transition-colors duration-200 hover:translate-x-1">Liên hệ</Link>
                <a href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'} className="block hover:text-white transition-colors duration-200 hover:translate-x-1" target="_blank" rel="noopener noreferrer">Quản trị</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3">Liên hệ</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>{schoolSettings?.schoolAddress || '250 Nguyễn Trọng Cát, phường Tân Ninh, Tây Ninh'}</p>
                <p>Điện thoại: {schoolSettings?.schoolPhone || '02763621963'}</p>
                <p>Email: {schoolSettings?.schoolEmail || 'nguyentraitx@gmail.com'}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-500">
            © 2024 Trường THCS Nguyễn Trãi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
