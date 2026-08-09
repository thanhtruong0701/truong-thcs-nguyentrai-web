import { test, expect } from '@playwright/test';

test.describe('Admin ↔ Public Integration E2E Tests', () => {
  const testTitle = `E2E_TEST_Dynamic_Sync_${Date.now()}`;

  test('Admin Announcement Create -> Public View -> Admin Delete Sync Flow', async ({ page }) => {
    // 1. Login to Admin
    await page.goto('http://localhost:3001/sign-in');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**');

    // 2. Create Announcement
    await page.goto('http://localhost:3001/admin/announcements');
    await page.click('a[href="/admin/announcements/new"]');
    await page.waitForURL('**/admin/announcements/new**');

    await page.fill('input[placeholder="Nhập tiêu đề thông báo"]', testTitle);
    await page.fill('textarea[placeholder="Nhập nội dung thông báo"]', 'Nội dung thông báo kiểm thử tự động E2E.');
    await page.click('button:has-text("Tạo thông báo")');
    await page.waitForURL('**/admin/announcements**');
    await page.waitForTimeout(1000);

    // 3. Verify on Public Web Home Page (.first() resolves Playwright strict mode when title renders in multiple sections)
    await page.goto('http://localhost:3000/');
    await expect(page.locator(`text=${testTitle}`).first()).toBeVisible({ timeout: 10000 });

    // 4. Delete in Admin
    await page.goto('http://localhost:3001/admin/announcements');
    page.on('dialog', dialog => dialog.accept());
    const deleteBtn = page.locator(`div:has-text("${testTitle}") button:has(.text-red-500)`).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(1000);
    }

    // 5. Verify Removal on Public Web Home Page
    await page.goto('http://localhost:3000/');
    await expect(page.locator(`text=${testTitle}`).first()).not.toBeVisible({ timeout: 10000 });
  });
});
