import { test, expect } from '@playwright/test';

test('should delete a todo item by name regardless of position', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  const tasks = ['Task A', 'Task B', 'Do skasowania', 'Task C'];
  for (const task of tasks) {
    await page.getByPlaceholder('What needs to be done?').fill(task);
    await page.keyboard.press('Enter');
  }

  const itemToDelete = page.locator('.todo-list li', { hasText: 'Do skasowania' });

  await itemToDelete.scrollIntoViewIfNeeded();
  await itemToDelete.hover();
  await itemToDelete.locator('.destroy').click({ force: true });

  const remainingItems = page.locator('.todo-list li');
  await expect(remainingItems).toHaveCount(3);
  await expect(remainingItems).not.toContainText('Do skasowania');
});
