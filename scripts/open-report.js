const fs = require('fs');
const { spawnSync } = require('child_process');
const { repoRoot, allureReportDir, relativeToRepo } = require('./report-paths');

function quoteWindowsArg(value) {
  if (!/[ \t"]/u.test(value)) {
    return value;
  }

  return `"${String(value).replace(/"/g, '\\"')}"`;
}

if (!fs.existsSync(allureReportDir)) {
  console.error(`Allure report not found at ${relativeToRepo(allureReportDir)}. Run "npm run report" first.`);
  process.exit(1);
}

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const spawnConfig =
  process.platform === 'win32'
    ? {
        command: process.env.comspec || 'cmd.exe',
        args: ['/d', '/s', '/c', [command, 'allure', 'open', relativeToRepo(allureReportDir)].map(quoteWindowsArg).join(' ')],
      }
    : {
        command,
        args: ['allure', 'open', relativeToRepo(allureReportDir)],
      };

const result = spawnSync(spawnConfig.command, spawnConfig.args, {
  cwd: repoRoot,
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
