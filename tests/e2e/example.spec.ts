import { test, expect } from '@playwright/test';

test('should open the todo app and check title', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');
  await expect(page).toHaveTitle(/TodoMVC/);
});

test('should add a new todo item', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await page.getByPlaceholder('What needs to be done?').fill('Buy milk');
  await page.keyboard.press('Enter');

  const todoItems = page.locator('.todo-list li');
  await expect(todoItems).toHaveCount(1);
  await expect(todoItems.first()).toHaveText('Buy milk');
});

test('should show only active tasks when filtered', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  await page.getByPlaceholder('What needs to be done?').fill('Task 1');
  await page.keyboard.press('Enter');
  await page.getByPlaceholder('What needs to be done?').fill('Task 2');
  await page.keyboard.press('Enter');

  await page.locator('.todo-list li').first().locator('.toggle').check();
  await page.getByRole('link', { name: 'Active' }).click();

  const items = page.locator('.todo-list li');
  await expect(items).toHaveCount(1);
  await expect(items.first()).toHaveText('Task 2');
});

test('should delete a todo item', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  await page.getByPlaceholder('What needs to be done?').fill('Task to remove');
  await page.keyboard.press('Enter');

  const item = page.locator('.todo-list li');
  await expect(item).toHaveCount(1);

  await item.hover();
  await item.locator('.destroy').click();

  await expect(page.locator('.todo-list li')).toHaveCount(0);
});
