const { allureCypress } = require('allure-cypress/reporter');
const { relativeToRepo, allureResultsDir } = require('./scripts/report-paths');
const DEFAULT_BASE_URL = 'https://sit-wetpaint.ddns.net';

function resolveEnvValue(...keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

module.exports = {
  projectId: 'z51i7a',
  env: {
    ROUNDCUBE_INBOX_URL: resolveEnvValue('CYPRESS_ROUNDCUBE_INBOX_URL', 'ROUNDCUBE_INBOX_URL'),
    ROUNDCUBE_ACCOUNT: resolveEnvValue('CYPRESS_ROUNDCUBE_ACCOUNT', 'ROUNDCUBE_ACCOUNT'),
    ROUNDCUBE_PASSWORD: resolveEnvValue('CYPRESS_ROUNDCUBE_PASSWORD', 'ROUNDCUBE_PASSWORD'),
    REPORT_RUN_ID: resolveEnvValue('CYPRESS_REPORT_RUN_ID', 'REPORT_RUN_ID'),
    REPORT_ATTACH_SCREENSHOTS:
      resolveEnvValue('CYPRESS_REPORT_ATTACH_SCREENSHOTS', 'REPORT_ATTACH_SCREENSHOTS') || 'failed',
  },

  e2e: {
    baseUrl: resolveEnvValue('CYPRESS_BASE_URL', 'BASE_URL') || DEFAULT_BASE_URL,
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: relativeToRepo(allureResultsDir),
      });

      on('task', {
        async getLatestResetPassword({ email }) {
          console.log('getLatestResetPassword for email:', email);

          // 1) If you already have the full reset URL, return it directly.
          const manualResetLink =
            process.env.RESET_PASSWORD_LINK || config.env.RESET_PASSWORD_LINK;
          if (manualResetLink) {
            return manualResetLink;
          }

          // 2) If you only have token, return token (LG-005 will build URL).
          const manualResetToken =
            process.env.RESET_PASSWORD_TOKEN || config.env.RESET_PASSWORD_TOKEN;
          if (manualResetToken) {
            return { token: manualResetToken };
          }

          return null;
        },
      });
      return config;
    },
  },
};
