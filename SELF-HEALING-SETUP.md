# 🚀 Playwright Self-Healing Agent – Complete Setup Guide

---

## 📦 1. Install Agent

```bash
npm install playwright-self-heal-agent
```

---

## 🔧 2. Update Test Files

```ts
import { test } from 'playwright-self-heal-agent';
import { expect } from '@playwright/test';
```

---

## ⚙️ 3. Config File

### 📄 `.selfhealrc.json`

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

---

## 🔐 4. Environment File

### 📄 `.env`

```env
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 🧠 5. Cache File

### 📄 `.selfheal-cache.json`

```json
{}
```

---

## 📊 6. Report Generator

### 📁 Create folder
```
report/
```

---

### 📄 `report/generate-report.ts`

```ts
import fs from 'fs';
import path from 'path';

const inputFile = path.resolve('self-heal-report.json');
const outputFile = path.resolve('self-heal-report.html');

if (!fs.existsSync(inputFile)) {
  console.error('❌ self-heal-report.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

const total = data.length;
const success = data.filter((d: any) => d.status === 'success').length;
const failed = data.filter((d: any) => d.status === 'failed').length;

const html = `
<!DOCTYPE html>
<html>
<head>
<title>Self-Healing Dashboard</title>
<style>
body { font-family: Arial; background:#f4f6f9; margin:20px; }
table { width:100%; border-collapse: collapse; background:white; }
th, td { padding:10px; border-bottom:1px solid #ddd; }
th { background:#333; color:white; }
.success { color:green; }
.failed { color:red; }
</style>
</head>
<body>

<h1>🚀 Self-Healing Dashboard</h1>

<p>Total: ${total}</p>
<p class="success">Success: ${success}</p>
<p class="failed">Failed: ${failed}</p>

<table>
<tr>
<th>Test</th>
<th>Original</th>
<th>Healed</th>
<th>Status</th>
<th>Strategy</th>
<th>Action</th>
<th>Confidence</th>
</tr>

${data.map((d: any) => `
<tr>
<td>${d.test}</td>
<td>${d.original}</td>
<td>${d.healed || '-'}</td>
<td class="${d.status === 'failed' ? 'failed' : 'success'}">
${d.status === 'failed' ? '❌ Failed' : '✅ Success'}
</td>
<td>${d.strategy}</td>
<td>${d.action}</td>
<td>${d.confidence}</td>
</tr>
`).join('')}

</table>

</body>
</html>
`;

fs.writeFileSync(outputFile, html);
console.log('📊 Dashboard generated');
```

---

## 📦 7. package.json

```json
"scripts": {
  "test": "playwright test",
  "generate-report": "npx ts-node report/generate-report.ts"
}
```

---

## ▶️ 8. Run Tests

```bash
npx playwright test
```

---

## 📊 9. Generate Report

```bash
npm run generate-report
```

---

## 📁 Output Files

- self-heal-report.json  
- self-heal-report.html  
- .selfheal-cache.json  

---

## 🧠 Flow

```
Failure → Cache → Rule → LLM → Validate → Execute → Log
```

---

## 🚀 Done

✔ Self-healing  
✔ Cache  
✔ Reporting  
✔ Dashboard  