'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPublishedFileUploads, incrementDownloadCount } from '@/app/actions/files'
import { ChevronRight, Download, FileText, FileSpreadsheet, FileArchive, File, Search } from 'lucide-react'

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
  createdAt: Date
}

const CATEGORY_LABELS: Record<string, string> = {
  'general': 'Chung',
  'tai-lieu': 'Tài liệu',
  'de-thi': 'Đề thi',
  'phan-cong': 'Phân công',
  'quy-che': 'Quy chế',
  'bao-cao': 'Báo cáo',
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
      return <File className="w-5 h-5 text-blue-800" />
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

export default function TaiNguyenPage() {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getPublishedFileUploads()
      .then(setFiles)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const categories = ['all', ...new Set(files.map(f => f.category || 'general'))]
  const filteredFiles = filter === 'all' ? files : files.filter(f => (f.category || 'general') === filter)

  async function handleDownload(file: FileUpload) {
    await incrementDownloadCount(file.id)
    setFiles(files.map(f => f.id === file.id ? { ...f, downloadCount: (f.downloadCount || 0) + 1 } : f))
    window.open(file.fileUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header-bg text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-blue-700 font-bold text-xl">NT</span>
              </div>
              <div>
                <p className="text-xs opacity-80 tracking-wider uppercase">Cổng thông tin điện tử</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide">TRƯỜNG THCS NGUYỄN TRÃI</h1>
                <p className="text-xs opacity-80">Quận Gò Vấp, TP. Hồ Chí Minh</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-800 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Tài nguyên</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 section-bar rounded" />
          <h1 className="text-2xl font-bold text-gray-900">Tài nguyên tải về</h1>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === cat
                  ? 'section-bg-solid text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat === 'all' ? 'Tất cả' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Files List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <File className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Chưa có tài liệu nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map(file => (
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
                      {file.category && file.category !== 'general' && (
                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                          {CATEGORY_LABELS[file.category] || file.category}
                        </span>
                      )}
                    </div>
                    {file.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{file.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDownload(file)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Tải về
                  </button>
                </div>
              </div>
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
