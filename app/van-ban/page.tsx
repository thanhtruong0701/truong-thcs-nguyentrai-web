'use client'

import { PageTemplate } from '@/components/page-template'

export default function VanBanPage() {
  return (
    <PageTemplate title="Văn bản" breadcrumb="Văn bản">
      <div className="prose prose-base max-w-none text-gray-700 space-y-4">
        <p>Trang Văn bản tổng hợp các quyết định, thông báo và văn bản hành chính của nhà trường.</p>
        <div className="space-y-3 mt-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-medium text-gray-900">Quyết định số 01/QD-THCS về việc tổ chức năm học 2024-2025</p>
            <p className="text-sm text-gray-500 mt-1">Ngày ban hành: 01/08/2024</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-medium text-gray-900">Thông báo về lịch nghỉ Tết Nguyên Đán 2025</p>
            <p className="text-sm text-gray-500 mt-1">Ngày ban hành: 15/01/2025</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-medium text-gray-900">Quy định về đánh giá học kỳ I năm học 2024-2025</p>
            <p className="text-sm text-gray-500 mt-1">Ngày ban hành: 10/12/2024</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}
