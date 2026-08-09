import { test, expect } from '@playwright/test';

test.describe('Public Website E2E Tests', () => {
  test('Home Page should load successfully with 200 OK', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h2', { hasText: 'Trường THCS Nguyễn Trãi' })).toBeVisible();
  });

  test('Announcements Page should load and list items', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/announcements');
    expect(response?.status()).toBe(200);
  });

  test('Courses Page should load successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/courses');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1', { hasText: 'Khóa học' })).toBeVisible();
  });

  test('Resource Library Page should load successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/tai-nguyen');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1', { hasText: 'Tài nguyên' })).toBeVisible();
  });

  test('Quizzes Page should load successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/quizzes');
    expect(response?.status()).toBe(200);
  });

  test('Search Page should execute query successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/search?q=THCS');
    expect(response?.status()).toBe(200);
  });

  test('Sign In and Sign Up Pages should render correctly', async ({ page }) => {
    const signInRes = await page.goto('http://localhost:3000/sign-in');
    expect(signInRes?.status()).toBe(200);

    const signUpRes = await page.goto('http://localhost:3000/sign-up');
    expect(signUpRes?.status()).toBe(200);
  });
});
