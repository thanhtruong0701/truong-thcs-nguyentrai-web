'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, ChevronRight, Download } from 'lucide-react'
import { getAnnouncementById } from '@/app/actions/announcements'
import { SiteHeader } from '@/components/site-header'

interface AttachmentFile {
  url: string
  name: string
  type: string
}

interface Announcement {
  id: string
  title: string
  content: string
  imageUrl?: string | null
  fileUrl?: string | null
  fileName?: string | null
  fileType?: string | null
  images?: string | null
  files?: string | null
  isPinned: boolean
  createdAt: Date
}

export default function AnnouncementDetailPage() {
  const params = useParams()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      getAnnouncementById(params.id as string)
        .then((data) => {
          if (data) {
            setAnnouncement(data)
          } else {
            setError('Không tìm thấy thông báo')
          }
        })
        .catch((err) => {
          console.error('Error:', err)
          setError('Lỗi khi tải thông báo')
        })
        .finally(() => setLoading(false))
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-48 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <p className="text-gray-500 mb-4">{error || 'Không tìm thấy thông báo'}</p>
            <Link href="/" className="text-red-600 hover:text-red-700 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  let imagesList: string[] = []
  if (announcement.images) {
    try { imagesList = JSON.parse(announcement.images) } catch {}
  } else if (announcement.imageUrl) {
    imagesList = [announcement.imageUrl]
  }

  let filesList: AttachmentFile[] = []
  if (announcement.files) {
    try { filesList = JSON.parse(announcement.files) } catch {}
  } else if (announcement.fileUrl) {
    filesList = [{
      url: announcement.fileUrl,
      name: announcement.fileName || 'Tải file đính kèm',
      type: announcement.fileType || 'File đính kèm'
    }]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/#announcements" className="hover:text-red-600 transition-colors">Tin tức</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium line-clamp-1">{announcement.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Back Button */}
          <div className="px-6 pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay về trang chủ
            </Link>
          </div>

          {/* Title & Meta */}
          <div className="px-6 py-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              {announcement.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(announcement.createdAt).toLocaleDateString('vi-VN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              {announcement.isPinned && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                  Tin ghim
                </span>
              )}
            </div>
          </div>

          {/* Multiple Images Gallery */}
          {imagesList.length > 0 && (
            <div className="px-6 py-2 space-y-3">
              {imagesList.length === 1 ? (
                <img
                  src={imagesList[0]}
                  alt={announcement.title}
                  className="w-full h-48 md:h-64 max-h-[400px] object-cover rounded-lg"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {imagesList.map((imgUrl, i) => (
                    <a key={i} href={imgUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg border border-gray-200 hover:opacity-90 transition">
                      <img src={imgUrl} alt={`Ảnh ${i + 1}`} className="w-full h-48 object-cover" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attached Files List */}
          {filesList.length > 0 && (
            <div className="px-6 py-3 space-y-2">
              <p className="text-sm font-semibold text-gray-800">Tài liệu / File đính kèm ({filesList.length}):</p>
              <div className="space-y-2">
                {filesList.map((f, i) => (
                  <a
                    key={i}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Download className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-900 truncate">
                        {f.name || 'Tải file đính kèm'}
                      </p>
                      <p className="text-xs text-blue-600">
                        {f.type || 'File đính kèm'}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded font-medium flex-shrink-0">Tải về</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Content - proper typography */}
          <div className="px-6 py-6">
            <div className="prose prose-base max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {announcement.content}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay về trang chủ
              </Link>
              <Link
                href="/#announcements"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Xem thêm tin tức
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>
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
