'use client'

import { PageTemplate } from '@/components/page-template'

export default function VideoPage() {
  return (
    <PageTemplate title="Tin Video" breadcrumb="Tin Video">
      <div className="prose prose-base max-w-none text-gray-700 space-y-4">
        <p>Trang Tin Video tổng hợp các video về hoạt động của nhà trường.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
            <p className="text-gray-500">Video sẽ được cập nhật sớm</p>
          </div>
          <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
            <p className="text-gray-500">Video sẽ được cập nhật sớm</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}
