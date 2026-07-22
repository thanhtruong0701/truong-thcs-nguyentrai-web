'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header-bg text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Giới thiệu</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Giới thiệu trường THCS Nguyễn Trãi</h1>
          <div className="prose prose-base max-w-none text-gray-700 space-y-4">
            <p>Trường THCS Nguyễn Trãi thuộc Quận Gò Vấp, Thành phố Hồ Chí Minh, là một trong những trường THCS có truyền thống dạy tốt, học tốt của quận.</p>
            <p>Trường được thành lập với sứ mệnh đào tạo thế hệ học sinh phát triển toàn diện về đức, trí, thể, mỹ, rèn luyện kỹ năng sống và thích ứng với xã hội hiện đại.</p>
            <p>Với đội ngũ giáo viên giàu kinh nghiệm, tâm huyết với nghề, cơ sở vật chất khang trang, trường THCS Nguyễn Trãi luôn là địa chỉ tin cậy của phụ huynh và học sinh.</p>
            <h2 className="text-xl font-bold text-gray-900 mt-6">Thông tin liên hệ</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Địa chỉ: 179 Đường số 7, Phường 10, Quận Gò Vấp, TP. HCM</li>
              <li>Điện thoại: (028) 3842-5904</li>
              <li>Email: thcsnguyentraigovap@gmail.com</li>
              <li>Website: truongnguyen.edu.vn</li>
            </ul>
          </div>
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
