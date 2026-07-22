'use client'

import { PageTemplate } from '@/components/page-template'

export default function TKBPage() {
  return (
    <PageTemplate title="Thời khóa biểu" breadcrumb="Thời khóa biểu">
      <div className="prose prose-base max-w-none text-gray-700 space-y-4">
        <p>Thời khóa biểu học kỳ II năm học 2024-2025</p>
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900">Tiết</th>
                <th className="border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900">Thứ 2</th>
                <th className="border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900">Thứ 3</th>
                <th className="border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900">Thứ 4</th>
                <th className="border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900">Thứ 5</th>
                <th className="border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900">Thứ 6</th>
                <th className="border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900">Thứ 7</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center font-medium">1</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Toán</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Văn</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Anh</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">KHTN</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Toán</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Văn</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center font-medium">2</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Văn</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Toán</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">GDTC</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Anh</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Văn</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Mỹ thuật</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center font-medium">3</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Anh</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">KHTN</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Toán</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Văn</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Địa lý</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Âm nhạc</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center font-medium">4</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">KHTN</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Anh</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Văn</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Toán</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Sinh hoạt lớp</td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-center">Hoạt động trải nghiệm</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-4">* Lịch học có thể thay đổi theo thông báo của nhà trường</p>
      </div>
    </PageTemplate>
  )
}
