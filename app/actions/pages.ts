'use server'

import { db } from '@/lib/db'
import { pages, menuItems } from '@/lib/db/schema'
import { desc, eq, and } from 'drizzle-orm'

export async function getPagesBySlug(slug: string) {
  const link = `/${slug}`

  const menuItem = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.link, link))
    .limit(1)

  if (!menuItem[0]) {
    return { menuItem: null, pages: [] }
  }

  const pagesList = await db
    .select()
    .from(pages)
    .where(and(eq(pages.menuItemId, menuItem[0].id), eq(pages.isPublished, true)))
    .orderBy(desc(pages.createdAt))

  return { menuItem: menuItem[0], pages: pagesList }
}

export async function getPageDetail(pageId: string) {
  const result = await db.select().from(pages).where(eq(pages.id, pageId)).limit(1)
  return result[0] || null
}
