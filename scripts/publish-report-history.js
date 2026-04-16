const fs = require('fs');
const path = require('path');
const { sanitizeSegment } = require('./report-paths');

function requireEnv(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function copyDirectory(sourceDir, destinationDir) {
  fs.rmSync(destinationDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(destinationDir), { recursive: true });
  fs.cpSync(sourceDir, destinationDir, { recursive: true });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildIndexHtml(manifest) {
  const rows = manifest.runs
    .map((entry) => {
      const reportHref = `${entry.reportPath}/`;
      const latestBadge = entry.isLatest ? ' <strong>(latest)</strong>' : '';

      return `
        <tr>
          <td>${escapeHtml(entry.createdAt)}</td>
          <td>${escapeHtml(entry.branch)}</td>
          <td><a href="${escapeHtml(reportHref)}">${escapeHtml(entry.runLabel)}</a>${latestBadge}</td>
          <td>${escapeHtml(entry.specPath)}</td>
          <td><code>${escapeHtml(entry.commitShortSha)}</code></td>
          <td><a href="${escapeHtml(entry.workflowRunUrl)}">workflow</a></td>
        </tr>
      `;
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>WETPAINT Cypress Reports</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f7fb;
      --card: #ffffff;
      --text: #142033;
      --muted: #5d6b82;
      --line: #d8e0ec;
      --accent: #1666d3;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", "Noto Sans TC", sans-serif;
      background: linear-gradient(180deg, #eaf2ff 0%, var(--bg) 220px);
      color: var(--text);
    }
    main {
      max-width: 1120px;
      margin: 0 auto;
      padding: 40px 20px 56px;
    }
    .hero, .card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 20px;
      box-shadow: 0 18px 40px rgba(20, 32, 51, 0.08);
    }
    .hero {
      padding: 28px;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 28px;
    }
    p {
      margin: 0;
      color: var(--muted);
      line-height: 1.6;
    }
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 18px;
    }
    .links a {
      text-decoration: none;
      color: white;
      background: var(--accent);
      border-radius: 999px;
      padding: 10px 16px;
      font-weight: 600;
    }
    .card {
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 10px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      vertical-align: top;
      font-size: 14px;
    }
    th {
      color: var(--muted);
      font-weight: 600;
    }
    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 13px;
    }
    a {
      color: var(--accent);
    }
    .empty {
      padding: 24px 0 8px;
      color: var(--muted);
    }
    @media (max-width: 768px) {
      th:nth-child(5),
      td:nth-child(5),
      th:nth-child(6),
      td:nth-child(6) {
        display: none;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <h1>WETPAINT Cypress Reports</h1>
      <p>Latest report and per-run history published from GitHub Actions. Each run keeps its own Allure site so the team can share a stable URL without overwriting previous results.</p>
      <div class="links">
        <a href="latest/">Open Latest Report</a>
      </div>
    </section>
    <section class="card">
      <table>
        <thead>
          <tr>
            <th>Created</th>
            <th>Branch</th>
            <th>Run</th>
            <th>Spec</th>
            <th>Commit</th>
            <th>Workflow</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="6" class="empty">No reports published yet.</td></tr>'}
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>
`;
}

const sourceDir = path.resolve(requireEnv('REPORT_SOURCE_DIR'));
const pagesDir = path.resolve(requireEnv('PAGES_DIR'));
const branchName = requireEnv('PUBLISH_BRANCH_NAME');
const specPath = requireEnv('REPORT_SPEC_PATH');
const runNumber = Number(process.env.GITHUB_RUN_NUMBER || 0);
const runAttempt = Number(process.env.GITHUB_RUN_ATTEMPT || 1);
const workflowRunUrl = requireEnv('WORKFLOW_RUN_URL');
const commitSha = requireEnv('GITHUB_SHA');
const createdAt = new Date().toISOString();

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Report source directory not found: ${sourceDir}`);
}

const branchSlug = sanitizeSegment(branchName, 'unknown-branch');
const specSlug = sanitizeSegment(
  specPath
    .replace(/^cypress[\\/]/i, '')
    .replace(/[\\/]/g, '-')
    .replace(/\.(cy|spec)\.[^.]+$/i, '')
    .replace(/\.[^.]+$/, ''),
  'spec'
).slice(0, 80);
const runLabel = runAttempt > 1 ? `${runNumber}-attempt-${runAttempt}-${specSlug}` : `${runNumber}-${specSlug}`;
const reportPath = path.posix.join('runs', branchSlug, runLabel);

const manifestPath = path.join(pagesDir, 'index.json');
const manifest = readJson(manifestPath, {
  version: 1,
  generatedAt: null,
  latest: null,
  runs: [],
});

fs.mkdirSync(pagesDir, { recursive: true });
copyDirectory(sourceDir, path.join(pagesDir, reportPath));
copyDirectory(sourceDir, path.join(pagesDir, 'latest'));
fs.writeFileSync(path.join(pagesDir, '.nojekyll'), '');

const entry = {
  id: `${branchSlug}-${runLabel}`,
  branch: branchName,
  branchSlug,
  specPath,
  specSlug,
  runNumber,
  runAttempt,
  runLabel,
  createdAt,
  commitSha,
  commitShortSha: commitSha.slice(0, 7),
  workflowRunUrl,
  reportPath,
  isLatest: true,
};

manifest.runs = Array.isArray(manifest.runs) ? manifest.runs : [];
manifest.runs = manifest.runs
  .filter((existingEntry) => existingEntry.reportPath !== entry.reportPath)
  .map((existingEntry) => ({
    ...existingEntry,
    isLatest: false,
  }));
manifest.runs.unshift(entry);
manifest.runs.sort((left, right) => {
  const leftScore = Number(left.runNumber || 0) * 100 + Number(left.runAttempt || 0);
  const rightScore = Number(right.runNumber || 0) * 100 + Number(right.runAttempt || 0);
  return rightScore - leftScore;
});

const keptRuns = [];
const branchCounts = new Map();
const removedRuns = [];

for (const currentEntry of manifest.runs) {
  const count = branchCounts.get(currentEntry.branchSlug) || 0;
  if (count < 30) {
    keptRuns.push(currentEntry);
    branchCounts.set(currentEntry.branchSlug, count + 1);
    continue;
  }

  removedRuns.push(currentEntry);
}

for (const currentEntry of removedRuns) {
  fs.rmSync(path.join(pagesDir, currentEntry.reportPath), { recursive: true, force: true });
}

manifest.generatedAt = createdAt;
manifest.latest = entry;
manifest.runs = keptRuns.map((currentEntry) => ({
  ...currentEntry,
  isLatest: currentEntry.reportPath === entry.reportPath,
}));

writeJson(manifestPath, manifest);
writeJson(path.join(pagesDir, 'latest', 'metadata.json'), entry);
writeJson(path.join(pagesDir, reportPath, 'metadata.json'), entry);
fs.writeFileSync(path.join(pagesDir, 'index.html'), buildIndexHtml(manifest), 'utf8');

console.log(`Published report history entry at ${reportPath}`);
