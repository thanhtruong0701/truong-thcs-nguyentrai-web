'use client'

import { PageTemplate } from '@/components/page-template'

export default function ChuyenMonPage() {
  return (
    <PageTemplate title="Hoạt động chuyên môn" breadcrumb="Hoạt động chuyên môn">
      <div className="prose prose-base max-w-none text-gray-700 space-y-4">
        <p>Trang tổng hợp các hoạt động chuyên môn của giáo viên và học sinh nhà trường.</p>
        <h2 className="text-xl font-bold text-gray-900 mt-6">Hoạt động bộ môn</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Hội thi giáo viên dạy giỏi cấp trường</li>
          <li>Thao giảng chuyên đề các bộ môn</li>
          <li>Hội thảo phương pháp giảng dạy mới</li>
          <li>Bồi dưỡng học sinh giỏi cấp quận</li>
        </ul>
        <h2 className="text-xl font-bold text-gray-900 mt-6">Đào tạo và bồi dưỡng</h2>
        <p>Teacher professional development activities are regularly organized to enhance teaching quality.</p>
      </div>
    </PageTemplate>
  )
}
