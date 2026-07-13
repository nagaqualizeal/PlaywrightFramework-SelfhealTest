import { test as base, Page, expect } from '@playwright/test';
import { register } from 'playwright-self-heal-agent/dist/register';

type HealerFixtures = {
  page: Page;
};

/**
 * Global fixture that auto-registers the self-healer on every page
 * Handles both initial page AND new pages/tabs opened during test
 * No changes needed to individual tests - healing works automatically everywhere!
 */
export const test = base.extend<HealerFixtures>({
  page: async ({ page, context }, use, testInfo) => {
    // 📋 Attach test information to the page object for healer to access
    (page as any).__testInfo = {
      title: testInfo.title,
      file: testInfo.file,
      suite: testInfo.titlePath.join(' › '),
      fileName: testInfo.file.split(/[/\\]/).pop(),
    };

    // ✅ Register the healer on the initial page
    register(page);

    // 🔧 Auto-register healer on ANY new pages/tabs opened during test
    const handleNewPage = (newPage: Page) => {
      console.log('🔧 New page detected - auto-registering healer...');
      // Propagate test info to new page as well
      (newPage as any).__testInfo = {
        title: testInfo.title,
        file: testInfo.file,
        suite: testInfo.titlePath.join(' › '),
        fileName: testInfo.file.split(/[/\\]/).pop(),
      };
      register(newPage);
    };

    // Listen for new pages in the context
    context.on('page', handleNewPage);

    // ✅ Provide page to test
    await use(page);

    // Cleanup: remove listener after test
    context.removeListener('page', handleNewPage);
  },
});

export { expect };
