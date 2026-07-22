'use server'

import { db } from '@/lib/db'
import { menuItems } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getVisibleMenuItems() {
  return db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isVisible, true))
    .orderBy(menuItems.orderIndex)
}
