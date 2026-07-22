'use client'

import { PageTemplate } from '@/components/page-template'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <PageTemplate title="Liên hệ" breadcrumb="Liên hệ">
      <div className="prose prose-base max-w-none text-gray-700 space-y-6">
        <p>Trường THCS Nguyễn Trãi luôn sẵn sàng tiếp nhận và phản hồi các ý kiến đóng góp của phụ huynh và học sinh.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Địa chỉ</p>
                <p className="text-sm text-gray-600">179 Đường số 7, Phường 10, Quận Gò Vấp, TP. HCM</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Điện thoại</p>
                <p className="text-sm text-gray-600">(028) 3842-5904</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">thcsnguyentraigovap@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Giờ làm việc</p>
                <p className="text-sm text-gray-600">Thứ 2 - Thứ 6: 7:00 - 17:00</p>
                <p className="text-sm text-gray-600">Thứ 7: 7:00 - 12:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  )
}
