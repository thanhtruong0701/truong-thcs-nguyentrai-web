'use client'

import { PageTemplate } from '@/components/page-template'

export default function PhapChePage() {
  return (
    <PageTemplate title="Pháp chế" breadcrumb="Pháp chế">
      <div className="prose prose-base max-w-none text-gray-700 space-y-4">
        <p>Trang Pháp chế cung cấp các thông tin về quy định, nội quy trường học và các văn bản pháp luật liên quan đến giáo dục.</p>
        <h2 className="text-xl font-bold text-gray-900 mt-6">Nội quy trường học</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Học sinh phải mặc đồng phục đúng quy định</li>
          <li>Đến trường đúng giờ, không bỏ tiết</li>
          <li>Tôn trọng thầy cô, bạn bè và nhân viên trường</li>
          <li>Giữ gìn vệ sinh chung, bảo vệ tài sản trường</li>
          <li>Không sử dụng điện thoại trong giờ học</li>
        </ul>
        <h2 className="text-xl font-bold text-gray-900 mt-6">Quy định về đánh giá</h2>
        <p>Điểm số được đánh giá theo quy định của Sở Giáo dục và Đào tạo TP. Hồ Chí Minh, bao gồm: điểm thường xuyên, điểm kiểm tra giữa kỳ và cuối kỳ.</p>
      </div>
    </PageTemplate>
  )
}
