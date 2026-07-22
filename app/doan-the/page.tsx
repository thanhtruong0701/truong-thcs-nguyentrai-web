'use client'

import { PageTemplate } from '@/components/page-template'

export default function DoanThePage() {
  return (
    <PageTemplate title="Hoạt động đoàn thể" breadcrumb="Hoạt động đoàn thể">
      <div className="prose prose-base max-w-none text-gray-700 space-y-4">
        <p>Trang tổng hợp các hoạt động của Đội TNTP Hồ Chí Minh và các đoàn thể trong nhà trường.</p>
        <h2 className="text-xl font-bold text-gray-900 mt-6">Đội Thiếu niên Tiền phong Hồ Chí Minh</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Lễ kết nạp đội viên mới</li>
          <li>Hội trại truyền thống</li>
          <li>Hoạt động tình nguyện vì cộng đồng</li>
          <li>Thi đua rèn luyện đội viên tốt</li>
        </ul>
        <h2 className="text-xl font-bold text-gray-900 mt-6">Các hoạt động khác</h2>
        <p>Nhà trường tổ chức nhiều hoạt động ý nghĩa như: thăm hỏi bà con có hoàn cảnh khó khăn, trồng cây xanh, tuyên truyền phòng chống tệ nạn xã hội.</p>
      </div>
    </PageTemplate>
  )
}
