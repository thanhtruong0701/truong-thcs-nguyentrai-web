'use client'

import { PageTemplate } from '@/components/page-template'

export default function HoatDongPage() {
  return (
    <PageTemplate title="Hoạt động" breadcrumb="Hoạt động">
      <div className="prose prose-base max-w-none text-gray-700 space-y-4">
        <p>Trang tổng hợp các hoạt động nổi bật của nhà trường.</p>
        <div className="space-y-4 mt-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-medium text-gray-900">Lễ khai giảng năm học 2024-2025</p>
            <p className="text-sm text-gray-500 mt-1">Ngày 05/09/2024</p>
            <p className="text-sm text-gray-600 mt-2">Buổi lễlong trọng chào đón năm học mới với sự tham gia của toàn thể giáo viên và học sinh.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-medium text-gray-900">Ngày hội văn hóa</p>
            <p className="text-sm text-gray-500 mt-1">Ngày 20/11/2024</p>
            <p className="text-sm text-gray-600 mt-2">Hoạt động chào mừng ngày Nhà giáo Việt Nam với nhiều tiết mục văn nghệ đặc sắc.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-medium text-gray-900">Hội khỏe phù đổng</p>
            <p className="text-sm text-gray-500 mt-1">Tháng 12/2024</p>
            <p className="text-sm text-gray-600 mt-2">Cuộc thi thể thao giữa các lớp với nhiều môn thi đấu hấp dẫn.</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}
