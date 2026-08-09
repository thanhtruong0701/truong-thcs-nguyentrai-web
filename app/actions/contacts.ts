'use server'

import { db, pool } from '@/lib/db'
import { contacts } from '@/lib/db/schema'

async function ensureContactsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        user_type TEXT NOT NULL DEFAULT 'parent',
        phone TEXT,
        email TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        response_note TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)
  } catch (err) {
    console.error('Failed to ensure contacts table exists:', err)
  }
}

export async function submitContactForm(data: {
  fullName: string
  userType: string
  phone?: string
  email?: string
  subject: string
  message: string
}) {
  if (!data.fullName?.trim() || !data.subject?.trim() || !data.message?.trim()) {
    return { success: false, error: 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)' }
  }

  await ensureContactsTable()

  try {
    const id = 'contact_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
    await db.insert(contacts).values({
      id,
      fullName: data.fullName.trim(),
      userType: data.userType || 'parent',
      phone: data.phone?.trim() || null,
      email: data.email?.trim() || null,
      subject: data.subject.trim(),
      message: data.message.trim(),
      isRead: false,
    })

    return {
      success: true,
      message: 'Cảm ơn bạn đã gửi ý kiến! Nhà trường đã nhận được và sẽ phản hồi sớm nhất.',
    }
  } catch (error: any) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.' }
  }
}
