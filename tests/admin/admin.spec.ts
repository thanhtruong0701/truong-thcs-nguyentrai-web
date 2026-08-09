import { test, expect } from '@playwright/test';

test.describe('Admin Website E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Perform authentication
    await page.goto('http://localhost:3001/sign-in');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**');
  });

  test('Admin Dashboard should render stats overview', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Bảng điều khiển' })).toBeVisible();
  });

  test('Admin Announcements Page should render list', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/announcements');
    await expect(page.locator('h1', { hasText: 'Thông báo' })).toBeVisible();
  });

  test('Admin Courses Page should render list', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/courses');
    await expect(page.locator('h1', { hasText: 'Khóa học' })).toBeVisible();
  });

  test('Admin Files Page should render list', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/files');
    await expect(page.locator('h1', { hasText: 'Tài liệu' })).toBeVisible();
  });

  test('Admin Menus Page should render hierarchy', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/menus');
    await expect(page.locator('h1', { hasText: 'Danh mục' })).toBeVisible();
  });

  test('Admin Pages Page should render dynamic pages', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/pages');
    await expect(page.locator('h1', { hasText: 'Bài viết' })).toBeVisible();
  });

  test('Admin Quizzes Page should render list', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/quizzes');
    await expect(page.locator('h1', { hasText: 'Bài kiểm tra' })).toBeVisible();
  });

  test('Admin Settings Page should render school settings form', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/settings');
    await expect(page.locator('h1', { hasText: 'Cài đặt' })).toBeVisible();
  });

  test('Admin Users Page should render user list', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/users');
    await expect(page.locator('h1', { hasText: 'Người dùng' })).toBeVisible();
  });
});
