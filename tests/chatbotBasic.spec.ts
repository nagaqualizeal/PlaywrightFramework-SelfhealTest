import { test } from 'playwright-self-heal-agent';
import { expect } from '@playwright/test';
import { ChatBotPage } from '../pages/ChatBotPage';

test.describe('ChatBot Basic Flow', () => {
    
    // Skip this test - chatbot not currently available on live website
    test('Complete basic chatbot interaction flow', async ({ page }) => {
        // Increase timeout for this test as chatbot may take time to load
        // test.setTimeout(90000);
        
        // Execute chatbot basic flow
        const chatBotPage = new ChatBotPage(page);
        await chatBotPage.executeBasicFlow();

        // Add a small wait to ensure flow completes
        await page.waitForTimeout(2000);
    });
});
