import { Page, Locator, FrameLocator } from '@playwright/test';
import { ExcelReader } from '../utils/ExcelReader';

export class ChatBotPage {
    readonly page: Page;
    readonly btnChatBotLauncher: Locator;
    readonly chatBotFrame: FrameLocator;
    readonly optionSWTesting: Locator;
    readonly optionAI: Locator;
    readonly inputTextBox: Locator;
    readonly btnSend: Locator;
    readonly bubbleOption: Locator;
    readonly btnConfirm: Locator;
    readonly btnCTA: Locator;

    constructor(page: Page) {
        this.page = page;
        this.btnChatBotLauncher = page.locator('#chat-bot-launcher-button');
        this.chatBotFrame = page.frameLocator('#chat-bot-iframe');
        
        // Locators within the iframe
        this.optionSWTesting = this.chatBotFrame.locator('//div[contains(text(),"Software Testing")]');
        this.optionAI = this.chatBotFrame.locator('//div[contains(text(),"AI & Analytics")]');
        this.inputTextBox = this.chatBotFrame.locator('#textInput');
        this.btnSend = this.chatBotFrame.locator('.send-button');
        this.bubbleOption = this.chatBotFrame.locator('.bubble:nth-child(2) > div');
        this.btnConfirm = this.chatBotFrame.locator('button');
        this.btnCTA = this.chatBotFrame.locator('.cta-btn');
    }

    /**
     * Navigate to DSS website
     */
    async navigateToDSSWebsite(): Promise<void> {
        await this.page.goto('https://playwright.dev/', { waitUntil: 'networkidle' });
    }

    /**
     * Open the chatbot
     */
    async openChatBot(): Promise<void> {
        await this.btnChatBotLauncher.click();
    }

    /**
     * Fill in name in chatbot
     */
    async fillName(name: string): Promise<void> {
        await this.inputTextBox.fill(name);
        await this.btnSend.click();
    }

    /**
     * Fill in text response in chatbot
     */
    async fillTextResponse(text: string): Promise<void> {
        await this.inputTextBox.fill(text);
        await this.btnSend.click();
    }

    /**
     * Fill in email in chatbot
     */
    async fillEmail(email: string): Promise<void> {
        await this.inputTextBox.fill(email);
        await this.btnSend.click();
    }

    /**
     * Confirm the chatbot interaction
     */
    async confirmInteraction(): Promise<void> {
        await this.btnConfirm.click();
    }

    /**
     * Click on CTA button
     */
    async clickCTA(): Promise<void> {
        await this.btnCTA.click();
    }

    /**
     * Select SW Testing option
     */
    async selectSWTestingOption(): Promise<void> {
        await this.optionSWTesting.click();
    }

    /**
     * Select AI & Analytics option
     */
    async selectAIOption(): Promise<void> {
        await this.optionAI.click();
    }

    /**
     * Basic chatbot flow for DSS website
     * Opens chatbot, fills in basic information
     */
    async executeBasicFlow(): Promise<void> {
        await this.navigateToDSSWebsite();
        await this.openChatBot();
        await this.bubbleOption.click();
        await this.fillName('Naga');
        await this.fillTextResponse('i dont know');
        await this.fillEmail('iwillnotgive@gmail.com');
        await this.confirmInteraction();
        await this.clickCTA();
    }

    /**
     * Software Testing chatbot flow with data-driven approach
     */
    async executeSWTestingFlow(excelPath: string, sheetName: string): Promise<void> {
        const excelReader = new ExcelReader(excelPath, sheetName);

        // Navigate to URL from Excel
        const url = excelReader.getCellData(1, 'URL');
        await this.page.goto(url, { waitUntil: 'networkidle' });

        // Wait for chatbot launcher
        await this.openChatBot();

        // Click Software Testing option
        await this.selectSWTestingOption();

        // Get all headers and iterate through them (skip URL column)
        const headers = excelReader.getHeaders();
        for (let col = 1; col < headers.length; col++) {
            const header = headers[col];
            const cellData = excelReader.getCellData(1, header);
            
            await this.fillTextResponse(cellData);
        }
    }

    /**
     * AI & Analytics chatbot flow with data-driven approach
     */
    async executeAIAnalyticsFlow(excelPath: string, sheetName: string): Promise<void> {
        const excelReader = new ExcelReader(excelPath, sheetName);

        // Navigate to URL from Excel
        const url = excelReader.getCellData(1, 'URL');
        await this.page.goto(url, { waitUntil: 'networkidle' });

        // Wait for chatbot launcher
        await this.openChatBot();

        // Click AI & Analytics option
        await this.selectAIOption();

        // Get all headers and iterate through them (skip URL column)
        const headers = excelReader.getHeaders();
        for (let col = 1; col < headers.length; col++) {
            const header = headers[col];
            const cellData = excelReader.getCellData(1, header);
            
            await this.fillTextResponse(cellData);
        }
    }
}
