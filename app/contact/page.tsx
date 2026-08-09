'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { getSettings } from '@/app/actions/settings'
import { submitContactForm } from '@/app/actions/contacts'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronRight, User, School, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null)
  const [form, setForm] = useState({
    fullName: '',
    userType: 'parent', // 'parent' | 'student' | 'other'
    phone: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    setSubmitSuccess(null)

    if (!form.fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên phụ huynh hoặc học sinh')
      return
    }
    if (!form.phone.trim() && !form.email.trim()) {
      setErrorMessage('Vui lòng nhập số điện thoại hoặc email để nhà trường liên hệ lại')
      return
    }
    if (!form.subject.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề kiến nghị / góp ý')
      return
    }
    if (!form.message.trim()) {
      setErrorMessage('Vui lòng nhập nội dung chi tiết')
      return
    }

    setSubmitting(true)
    try {
      const res = await submitContactForm(form)
      if (res.success) {
        setSubmitSuccess(res.message || 'Gửi thành công!')
        setForm({
          fullName: '',
          userType: 'parent',
          phone: '',
          email: '',
          subject: '',
          message: '',
        })
      } else {
        setErrorMessage(res.error || 'Đã có lỗi xảy ra')
      }
    } catch {
      setErrorMessage('Lỗi kết nối máy chủ. Vui lòng thử lại!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Liên hệ & Góp ý kiến nghị</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Title */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Liên hệ & Hộp thư Kiến nghị</h1>
          <p className="text-gray-600 mt-2">
            Gửi ý kiến đóng góp, thắc mắc hoặc kiến nghị từ Phụ huynh & Học sinh tới Ban giám hiệu Nhà trường.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: School Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xl">
                  NT
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">
                    {settings?.schoolName || 'TRƯỜNG THCS NGUYỄN TRÃI'}
                  </h2>
                  <p className="text-xs text-gray-500">Cổng thông tin & Tiếp nhận thông tin</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Địa chỉ:</span>
                    <span>{settings?.schoolAddress || '250 Nguyễn Trọng Cát, phường Tân Ninh, Tây Ninh'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Điện thoại / Hotline:</span>
                    <a href={`tel:${settings?.schoolPhone || '02763621963'}`} className="text-blue-600 hover:underline">
                      {settings?.schoolPhone || '02763621963'} / (028) 3842-5904
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Email chính thức:</span>
                    <a href={`mailto:${settings?.schoolEmail || 'nguyentraitx@gmail.com'}`} className="text-blue-600 hover:underline">
                      {settings?.schoolEmail || 'nguyentraitx@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 block">Giờ tiếp phụ huynh:</span>
                    <span>{settings?.workingHours || 'Thứ 2 - Thứ 6: 07:00 - 17:00'}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Thứ 7: 07:00 - 11:30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-sm text-gray-800">Bản đồ vị trí nhà trường</span>
              </div>
              <div className="h-64 bg-gray-100 relative flex items-center justify-center text-center p-4">
                <iframe
                  title="School Map"
                  src="https://maps.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng+THCS+Nguy%E1%BB%85n+Tr%C3%A3i+T%C3%A2y+Ninh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 rounded-b-2xl"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Feedback / Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Gửi Kiến nghị & Phản hồi</h2>
                  <p className="text-xs text-gray-500">Thông tin sẽ được gửi trực tiếp đến Ban quản trị Nhà trường</p>
                </div>
              </div>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-start gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Gửi thành công!</h4>
                    <p className="text-xs mt-1 text-green-700">{submitSuccess}</p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fadeIn">
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Đối tượng */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Bạn là: <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'parent', label: '👨‍👩‍👧 Phụ huynh', desc: 'Phụ huynh học sinh' },
                      { id: 'student', label: '🎓 Học sinh', desc: 'Học sinh đang học' },
                      { id: 'other', label: '👤 Khác', desc: 'Cơ quan / Đơn vị khác' },
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setForm({ ...form, userType: item.id })}
                        className={`p-3 rounded-xl border-2 text-center text-sm font-medium transition-all ${
                          form.userType === item.id
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Họ tên */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-1">
                    Họ và tên người gửi <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn A (Phụ huynh em Nguyễn Văn B - Lớp 7A1)"
                    className="w-full h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* SĐT & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-1">
                      Số điện thoại liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Ví dụ: 0912 345 678"
                      className="w-full h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                      Email liên hệ (tùy chọn)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Ví dụ: phuhuynh@gmail.com"
                      className="w-full h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>

                {/* Tiêu đề */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-800 mb-1">
                    Tiêu đề kiến nghị / đóng góp ý kiến <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Ví dụ: Ý kiến về thời khóa biểu / Phản ánh cơ sở vật chất..."
                    className="w-full h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* Nội dung */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-1">
                    Nội dung chi tiết <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Nhập chi tiết ý kiến đóng góp hoặc nội dung kiến nghị gửi tới Ban Giám hiệu..."
                    className="w-full rounded-xl border border-gray-300 p-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang gửi ý kiến...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Gửi kiến nghị về Nhà trường
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
