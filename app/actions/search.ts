'use server'

import { db } from '@/lib/db'
import { announcements, courses, pages, menuItems } from '@/lib/db/schema'
import { eq, or, ilike, desc } from 'drizzle-orm'

export async function searchContent(query: string) {
  if (!query || query.trim().length === 0) {
    return { announcements: [], courses: [], pages: [] }
  }

  const searchTerm = `%${query.trim()}%`

  const [announcementsResult, coursesResult, pagesResult] = await Promise.all([
    db
      .select()
      .from(announcements)
      .where(or(ilike(announcements.title, searchTerm), ilike(announcements.content, searchTerm)))
      .orderBy(desc(announcements.createdAt))
      .limit(10),
    db
      .select()
      .from(courses)
      .where(or(ilike(courses.title, searchTerm), ilike(courses.description, searchTerm)))
      .orderBy(desc(courses.createdAt))
      .limit(10),
    db
      .select({
        id: pages.id,
        title: pages.title,
        content: pages.content,
        imageUrl: pages.imageUrl,
        createdAt: pages.createdAt,
        menuLabel: menuItems.label,
      })
      .from(pages)
      .leftJoin(menuItems, eq(pages.menuItemId, menuItems.id))
      .where(or(ilike(pages.title, searchTerm), ilike(pages.content, searchTerm)))
      .orderBy(desc(pages.createdAt))
      .limit(10),
  ])

  return {
    announcements: announcementsResult,
    courses: coursesResult,
    pages: pagesResult,
  }
}
