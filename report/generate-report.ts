import fs from 'fs';
import path from 'path';

const inputFile = path.resolve('self-heal-report.json');
const outputFile = path.resolve('self-heal-report.html');

if (!fs.existsSync(inputFile)) {
  console.error('❌ self-heal-report.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

// ================= SUMMARY =================
const total = data.length;
const success = data.filter((d: any) => d.status === 'success').length;
const failed = data.filter((d: any) => d.status === 'failed').length;

// ================= FLAKY =================
const locatorCount: Record<string, number> = {};
data.forEach((d: any) => {
  locatorCount[d.original] = (locatorCount[d.original] || 0) + 1;
});

const flaky = Object.entries(locatorCount).filter(([_, c]) => c > 1);

const topFailures = Object.entries(locatorCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

// ================= FILTERS =================
const tests = [...new Set(data.map((d: any) => d.test))];
const strategies = [...new Set(data.map((d: any) => d.strategy))];
const actions = [...new Set(data.map((d: any) => d.action))];

// ================= HTML =================
const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Self-Healing Dashboard</title>

  <style>
    body {
      font-family: Arial;
      background: #f4f6f9;
      margin: 20px;
    }

    h1 {
      margin-bottom: 10px;
    }

    .summary {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .card {
      background: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      min-width: 120px;
      text-align: center;
    }

    .success { color: green; font-weight: bold; }
    .failed { color: red; font-weight: bold; }

    .grid {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .panel {
      flex: 1;
      background: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 10px;
      overflow: hidden;
    }

    th, td {
      padding: 10px;
      border-bottom: 1px solid #eee;
      vertical-align: top;
    }

    th {
      background: #333;
      color: white;
    }

    select {
      margin: 10px 5px;
      padding: 5px;
    }
  </style>
</head>

<body>

<h1>🚀 Self-Healing Dashboard</h1>

<!-- SUMMARY -->
<div class="summary">
  <div class="card">Total<br><b>${total}</b></div>
  <div class="card success">Success<br><b>${success}</b></div>
  <div class="card failed">Failed<br><b>${failed}</b></div>
</div>

<!-- PANELS -->
<div class="grid">

  <div class="panel">
    <h3>⚠️ Flaky Locators</h3>
    ${
      flaky.length === 0
        ? '<p>No flaky locators</p>'
        : flaky.map(f => `<p>${f[0]} → ${f[1]} times</p>`).join('')
    }
  </div>

  <div class="panel">
    <h3>🔥 Top Failures</h3>
    ${topFailures.map((f, i) => `<p>${i + 1}. ${f[0]} → ${f[1]} times</p>`).join('')}
  </div>

</div>

<!-- FILTERS -->
<div>
  <select id="testFilter">
    <option value="">All Tests</option>
    ${tests.map(t => `<option value="${t}">${t}</option>`).join('')}
  </select>

  <select id="strategyFilter">
    <option value="">All Strategies</option>
    ${strategies.map(s => `<option value="${s}">${s}</option>`).join('')}
  </select>

  <select id="actionFilter">
    <option value="">All Actions</option>
    ${actions.map(a => `<option value="${a}">${a}</option>`).join('')}
  </select>
</div>

<!-- TABLE -->
<table id="table">
<thead>
<tr>
  <th>Test</th>
  <th>Original</th>
  <th>Healed</th>
  <th>Status</th>
  <th>Strategy</th>
  <th>Action</th>
  <th>Confidence</th>
  <th>Attempts</th>
</tr>
</thead>

<tbody>
${data.map((d: any) => `
<tr>
  <td>${d.test || ''}</td>
  <td>${d.original}</td>
  <td>${d.healed || '-'}</td>
  <td class="${d.status === 'failed' ? 'failed' : 'success'}">
    ${d.status === 'failed' ? '❌ Failed' : '✅ Success'}
  </td>
  <td>${d.strategy || '-'}</td>
  <td>${d.action || '-'}</td>
  <td>${d.confidence ?? '-'}</td>
  <td>
    ${
      d.attempts
        ? d.attempts.map((a: any) =>
            `${a.strategy}: ${a.locator} → ${a.result}`
          ).join('<br>')
        : '-'
    }
  </td>
</tr>
`).join('')}
</tbody>
</table>

<script>
const data = ${JSON.stringify(data)};
const tableBody = document.querySelector('#table tbody');

function filter() {
  const t = document.getElementById('testFilter').value;
  const s = document.getElementById('strategyFilter').value;
  const a = document.getElementById('actionFilter').value;

  const filtered = data.filter(d =>
    (!t || d.test === t) &&
    (!s || d.strategy === s) &&
    (!a || d.action === a)
  );

  tableBody.innerHTML = filtered.map(d => \`
<tr>
<td>\${d.test || ''}</td>
<td>\${d.original}</td>
<td>\${d.healed || '-'}</td>
<td class="\${d.status === 'failed' ? 'failed' : 'success'}">
  \${d.status === 'failed' ? '❌ Failed' : '✅ Success'}
</td>
<td>\${d.strategy || '-'}</td>
<td>\${d.action || '-'}</td>
<td>\${d.confidence ?? '-'}</td>
<td>
  \${d.attempts
    ? d.attempts.map(a => a.strategy + ': ' + a.locator + ' → ' + a.result).join('<br>')
    : '-'}
</td>
</tr>\`).join('');
}

document.getElementById('testFilter').onchange = filter;
document.getElementById('strategyFilter').onchange = filter;
document.getElementById('actionFilter').onchange = filter;
</script>

</body>
</html>
`;

fs.writeFileSync(outputFile, html);
console.log('📊 Enhanced dashboard generated!');