'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, FileText, Calendar, Download, File, FileSpreadsheet, FileArchive } from 'lucide-react'
import { getPagesBySlug } from '@/app/actions/pages'
import { getPublishedFileUploads, incrementDownloadCount } from '@/app/actions/files'

import { SiteHeader } from '@/components/site-header'

interface MenuItem {
  id: string
  label: string
  link: string
}

interface Page {
  id: string
  menuItemId: string | null
  title: string
  content: string
  imageUrl?: string | null
  files?: string | null
  isPublished: boolean
  createdAt: Date
}

interface Attachment {
  url: string
  name: string
  type: string
  isImage: boolean
  allowDownload?: boolean
}

interface FileUpload {
  id: string
  title: string
  description?: string | null
  fileUrl: string
  fileName: string
  fileType: string
  fileSize?: number | null
  category?: string | null
  downloadCount: number
  allowDownload: boolean
  createdAt: Date
}

// Map slug to file category
const SLUG_TO_CATEGORY: Record<string, string> = {
  'bai-giang': 'tai-lieu',
  'giao-an': 'giao-an',
  'de-thi': 'de-thi',
  'tu-lieu': 'tai-lieu',
  'sang-kien': 'sang-kien',
  'toan-hoc-vui': 'toan-hoc-vui',
  'tin-giao-duc': 'tin-giao-duc',
  'bai-viet': 'general',
}

function getFileIcon(type: string) {
  switch (type) {
    case 'doc':
    case 'docx':
      return <FileText className="w-5 h-5 text-blue-600" />
    case 'xls':
    case 'xlsx':
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />
    case 'pdf':
      return <File className="w-5 h-5 text-red-600" />
    case 'rar':
    case 'zip':
      return <FileArchive className="w-5 h-5 text-yellow-600" />
    default:
      return <File className="w-5 h-5 text-gray-600" />
  }
}

function formatFileSize(bytes?: number) {
  if (!bytes) return 'N/A'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function CatchAllPage() {
  const params = useParams()
  const slug = (params.slug as string[])?.join('/') || ''
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null)
  const [pagesList, setPagesList] = useState<Page[]>([])
  const [files, setFiles] = useState<FileUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [found, setFound] = useState(true)

  useEffect(() => {
    Promise.all([
      getPagesBySlug(slug),
      getPublishedFileUploads(),
    ])
      .then(([pageData, allFiles]) => {
        if (pageData.menuItem) {
          setMenuItem(pageData.menuItem)
          setPagesList(pageData.pages)
          setFound(true)
        } else {
          setFound(false)
        }
        
        // Filter files by matching category
        const targetCategory = SLUG_TO_CATEGORY[slug]
        if (targetCategory) {
          setFiles(allFiles.filter(f => f.category === targetCategory))
        }
      })
      .catch(() => setFound(false))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded" />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Không tìm thấy danh mục
  if (!found || !menuItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Chưa có bài viết cho danh mục này</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Danh mục này vừa được tạo trong Admin. Bạn cần vào Admin &gt; **Quản lý Bài viết** (hoặc Trang) để tạo và gán bài viết vào danh mục này.
            </p>
            <Link href="/" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 inline-flex items-center gap-2 transition-colors shadow-sm">
              Trở về Trang chủ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  async function handleDownload(file: FileUpload) {
    await incrementDownloadCount(file.id)
    setFiles(files.map(f => f.id === file.id ? { ...f, downloadCount: (f.downloadCount || 0) + 1 } : f))
    window.open(file.fileUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{menuItem.label}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-red-600 rounded" />
          <h1 className="text-2xl font-bold text-gray-900">{menuItem.label}</h1>
        </div>

        {/* File uploads section */}
        {files.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Tài liệu tải về</h2>
            <div className="space-y-3">
              {files.map(file => (
                <div key={file.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getFileIcon(file.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{file.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="uppercase bg-gray-100 px-1.5 py-0.5 rounded font-medium">{file.fileType}</span>
                        <span>{formatFileSize(file.fileSize || undefined)}</span>
                        <span>{file.downloadCount || 0} lượt tải</span>
                      </div>
                      {file.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{file.description}</p>
                      )}
                    </div>
                    {file.allowDownload ? (
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex-shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        Tải về
                      </button>
                    ) : (
                      <span className="flex items-center gap-2 bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 cursor-not-allowed">
                        🔒 Xem thôi
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages content section */}
        {pagesList.length === 0 && files.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Chưa có nội dung nào cho danh mục này</p>
          </div>
        ) : pagesList.length > 0 ? (
          <div className="space-y-4">
            {pagesList.map(page => {
              let attachments: Attachment[] = []
              try { if (page.files) attachments = JSON.parse(page.files) } catch {}
              const images = attachments.filter(a => a.isImage)
              const files = attachments.filter(a => !a.isImage)

              return (
                <div key={page.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-all">
                  {page.imageUrl && (
                    <img src={page.imageUrl} alt={page.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                  )}
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{page.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    {new Date(page.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="prose prose-base max-w-none text-gray-700 whitespace-pre-wrap">{page.content}</div>

                  {/* Hiển thị ảnh đính kèm */}
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {images.map((img, i) => (
                        <a key={i} href={img.url} target="_blank" rel="noopener noreferrer">
                          <img src={img.url} alt={img.name} className="w-full h-32 object-cover rounded-lg hover:opacity-80 transition" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Hiển thị file đính kèm - kiểm tra allowDownload */}
                  {files.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <p className="text-sm font-medium text-gray-600">File đính kèm:</p>
                      {files.map((f, i) => (
                        f.allowDownload !== false ? (
                          <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm">
                            <Download className="w-4 h-4" />
                            {f.name}
                          </a>
                        ) : (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-400 rounded-lg text-sm cursor-not-allowed">
                            🔒 {f.name} <span className="text-xs">(không cho tải)</span>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : null}
      </div>

      <footer className="bg-gray-800 text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © 2024 Trường THCS Nguyễn Trãi. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
