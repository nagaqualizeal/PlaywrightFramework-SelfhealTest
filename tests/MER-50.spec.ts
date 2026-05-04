import { test } from 'playwright-self-heal-agent';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import testData from '../test-data/MER-50.json';

test.describe('Login', () => {

  test('Valid Login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginFlow(
      testData.url,
      testData.validUser.username,
      testData.validUser.password
    );

    await expect(page).toHaveURL(/inventory/);
  });

  test('Invalid Login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginFlow(
      testData.url,
      testData.invalidUser.username,
      testData.invalidUser.password
    );

    await expect(page.locator('body')).toContainText('Epic sadface');
  });

});