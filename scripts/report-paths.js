const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const reportsRoot = path.join(repoRoot, 'reports');
const generatedRoot = path.join(reportsRoot, '.generated');
const allureResultsDir = path.join(generatedRoot, 'allure-results');
const allureReportDir = path.join(generatedRoot, 'allure-report');
const runtimeRoot = path.join(repoRoot, 'cypress', '.runtime');

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function relativeToRepo(targetPath) {
  return toPosixPath(path.relative(repoRoot, targetPath));
}

function sanitizeSegment(value, fallback = 'item') {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);

  return normalized || fallback;
}

function getRuntimeDir(runId) {
  return path.join(runtimeRoot, sanitizeSegment(runId, 'local'));
}

module.exports = {
  repoRoot,
  reportsRoot,
  generatedRoot,
  allureResultsDir,
  allureReportDir,
  runtimeRoot,
  toPosixPath,
  relativeToRepo,
  sanitizeSegment,
  getRuntimeDir,
};
