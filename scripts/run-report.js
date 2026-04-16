const fs = require('fs');
const { spawnSync } = require('child_process');
const {
  repoRoot,
  generatedRoot,
  allureResultsDir,
  allureReportDir,
  relativeToRepo,
  sanitizeSegment,
  getRuntimeDir,
} = require('./report-paths');

function resolveExecutable(command) {
  return process.platform === 'win32' ? `${command}.cmd` : command;
}

function quoteWindowsArg(value) {
  if (!/[ \t"]/u.test(value)) {
    return value;
  }

  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function run(command, args, env) {
  const spawnConfig =
    process.platform === 'win32'
      ? {
          command: process.env.comspec || 'cmd.exe',
          args: ['/d', '/s', '/c', [command, ...args].map(quoteWindowsArg).join(' ')],
        }
      : {
          command,
          args,
        };

  const result = spawnSync(spawnConfig.command, spawnConfig.args, {
    cwd: repoRoot,
    env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}

function resolveReportRunId() {
  const explicitRunId = String(process.env.REPORT_RUN_ID || '').trim();
  if (explicitRunId) {
    return sanitizeSegment(explicitRunId, 'local-run');
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return sanitizeSegment(`local-${timestamp}`, 'local-run');
}

const cliArgs = process.argv.slice(2);
const reportRunId = resolveReportRunId();
const screenshotMode = String(process.env.REPORT_ATTACH_SCREENSHOTS || 'failed').trim() || 'failed';
const runtimeDir = getRuntimeDir(reportRunId);

fs.rmSync(generatedRoot, { recursive: true, force: true });
fs.mkdirSync(generatedRoot, { recursive: true });
fs.rmSync(runtimeDir, { recursive: true, force: true });

const env = {
  ...process.env,
  REPORT_RUN_ID: reportRunId,
  CYPRESS_REPORT_RUN_ID: reportRunId,
  REPORT_ATTACH_SCREENSHOTS: screenshotMode,
  CYPRESS_REPORT_ATTACH_SCREENSHOTS: screenshotMode,
};

console.log(`REPORT_RUN_ID=${reportRunId}`);
console.log(`REPORT_ATTACH_SCREENSHOTS=${screenshotMode}`);

const cypressStatus = run(resolveExecutable('npx'), ['cypress', 'run', ...cliArgs], env);

let allureStatus = 0;
if (fs.existsSync(allureResultsDir) && fs.readdirSync(allureResultsDir).length > 0) {
  allureStatus = run(
    resolveExecutable('npx'),
    ['allure', 'generate', relativeToRepo(allureResultsDir), '--clean', '-o', relativeToRepo(allureReportDir)],
    env
  );

  if (allureStatus === 0) {
    console.log(`Allure report generated at ${relativeToRepo(allureReportDir)}`);
    console.log('Open it with: npm run report:open');
  }
} else {
  console.warn(`Allure results not found at ${relativeToRepo(allureResultsDir)}.`);
}

if (cypressStatus === 0 && allureStatus !== 0) {
  process.exit(allureStatus);
}

process.exit(cypressStatus);
