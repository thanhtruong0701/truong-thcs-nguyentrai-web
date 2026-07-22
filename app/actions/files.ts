'use server'

import { db } from '@/lib/db'
import { fileUploads } from '@/lib/db/schema'
import { desc, eq, sql } from 'drizzle-orm'

export async function getPublishedFileUploads() {
  return db
    .select()
    .from(fileUploads)
    .where(eq(fileUploads.isPublished, true))
    .orderBy(desc(fileUploads.createdAt))
}

export async function getPublishedFilesByCategory(category: string) {
  return db
    .select()
    .from(fileUploads)
    .where(sql`${fileUploads.isPublished} = true AND ${fileUploads.category} = ${category}`)
    .orderBy(desc(fileUploads.createdAt))
}

export async function getFileCategories() {
  const result = await db
    .select({ category: fileUploads.category })
    .from(fileUploads)
    .where(eq(fileUploads.isPublished, true))
  const categories = [...new Set(result.map(r => r.category || 'general'))]
  return categories
}

export async function incrementDownloadCount(id: string) {
  const file = await db.select().from(fileUploads).where(eq(fileUploads.id, id)).limit(1)
  if (file[0]) {
    await db
      .update(fileUploads)
      .set({ downloadCount: (file[0].downloadCount || 0) + 1 })
      .where(eq(fileUploads.id, id))
  }
}

export async function uploadMultipleFiles(
  files: File[],
  category: string
) {
  const results = []

  for (const file of files) {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
    const mimeType = file.type
    
    const ALLOWED_TYPES: Record<string, string> = {
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/pdf': 'pdf',
      'application/x-rar-compressed': 'rar',
      'application/vnd.rar': 'rar',
      'application/zip': 'zip',
      'application/x-zip-compressed': 'zip',
    }

    const fileType = ALLOWED_TYPES[mimeType] || fileExt

    if (!ALLOWED_TYPES[mimeType]) {
      throw new Error(`File "${file.name}" có loại không được hỗ trợ`)
    }

    if (file.size > 50 * 1024 * 1024) {
      throw new Error(`File "${file.name}" quá lớn. Tối đa 50MB`)
    }

    const result = await db
      .select()
      .from(fileUploads)
      .where(eq(fileUploads.fileName, file.name))
      .limit(1)

    if (result.length > 0) {
      results.push(result[0])
      continue
    }
  }

  return results
}
