# 🚀 Playwright Self-Healing Agent Framework

A Playwright automation framework with AI-powered self-healing capabilities using TypeScript and Page Object Model (POM) pattern. Automatically fixes broken tests when selectors change!

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Required Files & Configuration](#required-files--configuration)
- [How to Use](#how-to-use)
- [Running Tests](#running-tests)
- [Viewing Reports](#viewing-reports)
- [Self-Healing Features](#self-healing-features)

---

## 📖 Overview

This framework combines **Playwright** with the **Self-Healing Agent** to automatically detect and repair broken selectors during test execution. When a selector fails, the AI agent attempts to find the element using alternative strategies and updates the locator dynamically.

### Key Features

✅ **AI-Powered Self-Healing** - Automatically fixes broken selectors  
✅ **TypeScript for Type Safety** - Full type checking and IDE support  
✅ **Page Object Model (POM)** - Clean, maintainable test structure  
✅ **HTML Dashboards** - Visual reports with healing insights  
✅ **Excel Data-Driven Testing** - Load test data from Excel files  
✅ **Multi-browser Support** - Chromium, Firefox, WebKit  
✅ **Screenshots & Videos** - Automatic capture on failures  

---

## 🔧 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **OpenAI API Key** (for self-healing agent to work)

### Setup Steps

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Create environment file
cp .env.example .env

# 4. Add your OpenAI API key to .env
# Edit .env and add: OPENAI_API_KEY=your_key_here
```

---

## 📦 Required Files & Configuration

### 1. **`.env` - Environment Variables**
```env
OPENAI_API_KEY=sk-your-openai-key-here
```
- Store your OpenAI API key securely
- Never commit this file to version control

### 2. **`.selfhealrc.json` - Self-Healing Configuration**
```json
{
  "llm": true,
  "cache": true,
  "report": true,
  "llmProvider": "openai",
  "openai": {
    "model": "gpt-4o-mini"
  }
}
```
- `llm`: Enable AI-powered healing
- `cache`: Cache healed selectors for reuse
- `report`: Generate healing report
- `llmProvider`: AI provider (openai, anthropic, etc.)
- `openai.model`: Specific model to use (gpt-4o-mini is cost-effective)

### 3. **`.selfheal-cache.json` - Healing Cache**
```json
{}
```
- Stores previously healed selectors
- Speeds up test execution by reusing solutions
- Auto-populated during test runs

### 4. **`report/` - Report Generation Folder**
```
report/
└── generate-report.ts  # Report generator script
```
- Contains TypeScript script to generate HTML dashboard
- Processes `self-heal-report.json` into visual reports

### 5. **Project Structure**
```
PlaywrightFramework/
├── pages/                    # Page Object Model classes
│   ├── LoginPage.ts
│   ├── ChatBotPage.ts
│   └── ...
├── tests/                    # Test specification files
│   ├── MER-50.spec.ts
│   ├── chatbotBasic.spec.ts
│   └── ...
├── utils/                    # Utility functions
│   └── ExcelReader.ts
├── testdata/                 # Test data (Excel files)
│   └── MER-50.json
├── report/                   # Report generation
│   └── generate-report.ts
├── .env                      # Environment variables (ignored by git)
├── .selfhealrc.json          # Self-healing config
├── .selfheal-cache.json      # Healing cache
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## 🎯 How to Use

### Step 1: Import Self-Healing Test
In your test files, import from the self-healing agent:

```typescript
import { test } from 'playwright-self-heal-agent';
import { expect } from '@playwright/test';

test('Example Test', async ({ page }) => {
  await page.goto('https://example.com');
  // Your test code here
});
```

### Step 2: Use Page Objects
Use Page Object Model classes for cleaner tests:

```typescript
import { test } from 'playwright-self-heal-agent';
import { LoginPage } from '../pages/LoginPage';

test('Valid Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.enterUsername('user@example.com');
  await loginPage.enterPassword('password');
  await loginPage.clickLogin();
  
  // Assertion
  await expect(loginPage.successMessage).toBeVisible();
});
```

### Step 3: Data-Driven Testing (Optional)
Load test data from Excel files:

```typescript
import { ExcelReader } from '../utils/ExcelReader';

test.describe('Data-Driven Tests', () => {
  const excelData = ExcelReader.readTestData('testdata/Data.xlsx', 'LoginSheet');
  
  excelData.forEach(testCase => {
    test(`Login with ${testCase.username}`, async ({ page }) => {
      // Use testCase.username, testCase.password, etc.
    });
  });
});
```

---

## ▶️ Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode (see browser)
```bash
npm run test:headed
```

### Run Specific Test File
```bash
npx playwright test tests/MER-50.spec.ts
```

### Run Tests with Debugging
```bash
npx playwright test --debug
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
# or firefox, webkit
```

---

## 📊 Viewing Reports

### 1. **Self-Healing Report (Recommended)**
View AI healing insights and statistics:

```bash
# Generate HTML dashboard from healing data
npm run generate-report

# Open the generated report
# Report location: self-heal-report.html
```

The dashboard shows:
- ✅ Total tests executed
- ✅ Successfully healed selectors
- ❌ Failed healing attempts
- 🔧 Healing strategies used
- 📈 Confidence scores

### 2. **Playwright HTML Report**
View detailed test execution results:

```bash
npm run report
```

This opens the Playwright report with:
- Step-by-step screenshots
- Video recordings of test runs
- Error details and stack traces
- Timing information

### 3. **Report Files Location**
- **Healing Report**: `./self-heal-report.html`
- **Healing Data**: `./self-heal-report.json` (raw data)
- **Playwright Report**: `./playwright-report/` (interactive report)
- **Test Results**: `./test-results/` (detailed logs)

---

## 🧠 Self-Healing Features

### How Self-Healing Works

1. **Test Fails** → Selector not found
2. **Agent Detects Failure** → Analyzes the page
3. **AI Analysis** → Looks for similar elements
4. **Healing Strategies**:
   - 🔍 Fuzzy matching on text/attributes
   - 🎯 XPath normalization
   - 🧠 AI vision (understands visual similarity)
   - 📍 Relative positioning
5. **Update & Cache** → Saves fixed selector for future runs
6. **Report Generated** → Documents the healing action

### Cache Benefits
- ⚡ Faster test execution (reuses healed selectors)
- 💾 Reduced API calls to OpenAI
- 📝 Quick reference for selector changes

### Confidence Scoring
Each healed selector gets a confidence score (0-100%):
- **90-100%** → High confidence, use immediately
- **70-89%** → Medium confidence, verify manually
- **Below 70%** → Low confidence, needs review

---

## 🔍 Troubleshooting

### Self-Healing Not Working?
1. Check `.env` file has valid `OPENAI_API_KEY`
2. Verify `.selfhealrc.json` has `"llm": true`
3. Check internet connection (API calls required)
4. Review test error in `test-results/` folder

### Report Not Generating?
```bash
npm run generate-report
```
Check if `self-heal-report.json` exists in root folder

### Cache Not Updating?
- Ensure `.selfheal-cache.json` is writable
- Check file permissions
- Verify `"cache": true` in `.selfhealrc.json`

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Self-Healing Agent Docs](./SELF-HEALING-SETUP.md)
- [Framework Structure](./FRAMEWORK_STRUCTURE.md)
