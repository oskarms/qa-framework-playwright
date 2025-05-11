import { test, expect } from '@playwright/test';

test('should open the todo app and check title', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');
  await expect(page).toHaveTitle(/TodoMVC/);
});

test('should open the todo app and check first div', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');
  await expect(page.getByText('This is just a demo of')).toBeVisible();
  await expect(page.locator('body')).toContainText('This is just a demo of TodoMVC for testing, not the real TodoMVC app.');
  await expect(page.locator('body')).toContainText('real TodoMVC app.');
  await page.getByRole('link', { name: 'real TodoMVC app.' }).click();
  await expect(page).toHaveURL('https://todomvc.com/');
});

test('should check text in header', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');
  const title = page.getByRole('heading', { level: 1 });
  await expect(title).toHaveText('todos');
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

test('check whether active tasks are remembered after reload', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  await page.getByPlaceholder('What needs to be done?').fill('Call mom');
  await page.keyboard.press('Enter');

  const item = page.locator('.todo-list li');
  await expect(item).toHaveCount(1);

  await page.reload();
  await expect(item).toHaveCount(1);
  await expect(item.first()).toHaveText('Call mom');
});

test('Check whether switching views changes visible tasks', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await page.getByPlaceholder('What needs to be done?').fill('Task 1');
  await page.keyboard.press('Enter');
  await page.getByPlaceholder('What needs to be done?').fill('Task 2');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Task 1')).toBeVisible();
  await expect(page.getByText('Task 2')).toBeVisible();
  await expect(page.locator('[data-testid="todo-count"] strong')).toHaveText('2');  
  await page.getByRole('listitem').filter({ hasText: 'Task 1' }).getByLabel('Toggle Todo').check();
  await expect(page.locator('[data-testid="todo-count"] strong')).toHaveText('1');  
    await page.getByRole('link', { name: 'Active' }).click();
      await expect(page.getByText('Task 1')).not.toBeVisible();
      await expect(page.getByText('Task 2')).toBeVisible();
      await expect(page.locator('[data-testid="todo-count"] strong')).toHaveText('1'); 
    await page.getByRole('link', { name: 'Completed' }).click();
      await expect(page.getByText('Task 1')).toBeVisible();
      await expect(page.getByText('Task 2')).not.toBeVisible();
      await expect(page.locator('[data-testid="todo-count"] strong')).toHaveText('1'); 
});

test('Check whether the user can edit the task', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  await page.getByPlaceholder('What needs to be done?').fill('Old task');
  await page.keyboard.press('Enter');

  await page.getByTestId('todo-title').dblclick();
  await page.getByRole('textbox', { name: 'Edit' }).fill('New task');
  await page.keyboard.press('Enter');

  const todoItems = page.locator('.todo-list li');
  await expect(todoItems).toHaveCount(1);
  await expect(todoItems.first()).toHaveText('New task');
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
