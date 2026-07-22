'use server'

import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getSettings() {
  const rows = await db.select().from(settings)
  const map: Record<string, string> = {}
  for (const row of rows) map[row.key] = row.value ?? ''
  return map
}

export async function getSetting(key: string) {
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1)
  return result[0]?.value ?? null
}
