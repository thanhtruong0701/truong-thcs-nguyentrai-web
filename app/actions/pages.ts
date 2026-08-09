'use server'

import { db } from '@/lib/db'
import { pages, menuItems } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getPagesBySlug(slug: string) {
  const rawLast = slug.split('/').filter(Boolean).pop() || slug
  const lastSegment = decodeURIComponent(rawLast)
  const linkWithSlash = slug.startsWith('/') ? slug : `/${slug}`
  const linkWithoutSlash = slug.replace(/^\/+/, '')
  const lastWithSlash = `/${lastSegment}`

  // 1. Fetch all visible menu items & all published pages
  const [allMenus, allPages] = await Promise.all([
    db.select().from(menuItems).where(eq(menuItems.isVisible, true)),
    db.select().from(pages).where(eq(pages.isPublished, true)).orderBy(desc(pages.createdAt))
  ])

  // 2. Find matching menu item by link, id, or label slug
  let targetMenu = allMenus.find(m =>
    m.id === slug ||
    m.id === lastSegment ||
    m.link === linkWithSlash ||
    m.link === linkWithoutSlash ||
    m.link === lastWithSlash ||
    m.link === lastSegment ||
    slugify(m.label) === lastSegment.toLowerCase() ||
    slugify(m.label) === slugify(slug)
  )

  if (!targetMenu) {
    targetMenu = allMenus.find(m =>
      m.label.toLowerCase() === lastSegment.toLowerCase() ||
      m.label.toLowerCase().includes(lastSegment.toLowerCase())
    )
  }

  // If no menu matched, check if slug is a direct page ID
  if (!targetMenu) {
    const pageById = allPages.find(p => p.id === slug || p.id === lastSegment)
    if (pageById) {
      const associatedMenu = allMenus.find(m => m.id === pageById.menuItemId) || {
        id: 'direct',
        label: pageById.title,
        link: `/${slug}`,
        icon: '📄',
        menuType: 'page',
        parentId: null,
        orderIndex: 0,
        isVisible: true,
        createdAt: pageById.createdAt,
        updatedAt: pageById.updatedAt,
      }
      return { menuItem: associatedMenu, pages: [pageById] }
    }

    // Fallback virtual menu for general pages
    targetMenu = {
      id: 'general',
      label: lastSegment === 'bai-viet' || lastSegment === 'baiviet' ? 'Bài viết' : lastSegment,
      link: `/${slug}`,
      icon: '📄',
      menuType: 'page',
      parentId: null,
      orderIndex: 0,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  // 3. Collect target menu ID and its children (if parent category)
  const targetMenuIds = new Set<string>([targetMenu.id])
  
  // If target menu has children, add children IDs
  const children = allMenus.filter(m => m.parentId === targetMenu!.id)
  for (const child of children) {
    targetMenuIds.add(child.id)
  }

  // 4. Filter pages STRICTLY assigned to targetMenu or its children
  let matchedPages = allPages.filter(p => p.menuItemId && targetMenuIds.has(p.menuItemId))

  // Only if slug is explicitly general '/bai-viet' or '/baiviet', return all pages
  if (slug === 'bai-viet' || slug === 'baiviet' || slug === 'posts') {
    matchedPages = allPages
  }

  return { menuItem: targetMenu, pages: matchedPages }
}

export async function getPageDetail(pageId: string) {
  const result = await db.select().from(pages).where(eq(pages.id, pageId)).limit(1)
  return result[0] || null
}
