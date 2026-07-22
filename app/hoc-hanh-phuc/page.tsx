'use client'

import { PageTemplate } from '@/components/page-template'

export default function HocHanhPhucPage() {
  return (
    <PageTemplate title="Trường học hạnh phúc" breadcrumb="Trường học hạnh phúc">
      <div className="prose prose-base max-w-none text-gray-700 space-y-4">
        <p>Trường THCS Nguyễn Trãi thực hiện mô hình "Trường học hạnh phúc" với mục tiêu tạo môi trường học tập tích cực, an toàn và yêu thương.</p>
        <h2 className="text-xl font-bold text-gray-900 mt-6">Nguyên tắc trường học hạnh phúc</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Yêu thương:</strong> Xây dựng mối quan hệ tốt đẹp giữa thầy và trò</li>
          <li><strong>Tôn trọng:</strong> Lắng nghe và tôn trọng ý kiến của mỗi học sinh</li>
          <li><strong>Chia sẻ:</strong> Khuyến khích học sinh chia sẻ kiến thức và kinh nghiệm</li>
          <li><strong>Hợp tác:</strong> Làm việc nhóm hiệu quả, giúp đỡ lẫn nhau</li>
        </ul>
        <h2 className="text-xl font-bold text-gray-900 mt-6">Hoạt động tiêu biểu</h2>
        <p>Các hoạt động ngoại khóa, sự kiện văn hóa, thể thao được tổ chức thường xuyên để tạo sân chơi lành mạnh cho học sinh.</p>
      </div>
    </PageTemplate>
  )
}
