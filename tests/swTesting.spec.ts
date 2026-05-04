import { test } from 'playwright-self-heal-agent';
import { expect } from '@playwright/test';
import { ChatBotPage } from '../pages/ChatBotPage';
import * as path from 'path';

test.describe('Software Testing ChatBot Flow', () => {
    
    // Skip this test - chatbot not currently available on live website
    test('Software Testing flow with Excel data', async ({ page }) => {
        // Increase timeout for this test
       // test.setTimeout(120000);
        
        // Path to Excel file
        const excelPath = path.resolve('./testdata/ChatBotData.xlsx');
        const sheetName = 'SWData';
        
        // Execute Software Testing chatbot flow
        const chatBotPage = new ChatBotPage(page);
        await chatBotPage.executeSWTestingFlow(excelPath, sheetName);

        // Add a small wait to ensure flow completes
        await page.waitForTimeout(2000);
    });
});
