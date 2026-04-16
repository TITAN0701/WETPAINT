const { allureCypress } = require('allure-cypress/reporter');
const { relativeToRepo, allureResultsDir } = require('./scripts/report-paths');

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
    PROXIEDMAIL_API_KEY: resolveEnvValue('CYPRESS_PROXIEDMAIL_API_KEY', 'PROXIEDMAIL_API_KEY'),
    PROXIEDMAIL_API_BASE:
      resolveEnvValue('CYPRESS_PROXIEDMAIL_API_BASE', 'PROXIEDMAIL_API_BASE') || 'https://proxiedmail.com',
    ROUNDCUBE_INBOX_URL: resolveEnvValue('CYPRESS_ROUNDCUBE_INBOX_URL', 'ROUNDCUBE_INBOX_URL'),
    ROUNDCUBE_ACCOUNT: resolveEnvValue('CYPRESS_ROUNDCUBE_ACCOUNT', 'ROUNDCUBE_ACCOUNT'),
    ROUNDCUBE_PASSWORD: resolveEnvValue('CYPRESS_ROUNDCUBE_PASSWORD', 'ROUNDCUBE_PASSWORD'),
    RG006_REGISTER_EMAIL:
      resolveEnvValue('CYPRESS_RG006_REGISTER_EMAIL', 'RG006_REGISTER_EMAIL')
      || resolveEnvValue('CYPRESS_ROUNDCUBE_ACCOUNT', 'ROUNDCUBE_ACCOUNT'),
    REPORT_RUN_ID: resolveEnvValue('CYPRESS_REPORT_RUN_ID', 'REPORT_RUN_ID'),
    REPORT_ATTACH_SCREENSHOTS:
      resolveEnvValue('CYPRESS_REPORT_ATTACH_SCREENSHOTS', 'REPORT_ATTACH_SCREENSHOTS') || 'failed',
  },

  e2e: {
    baseUrl: 'http://61.220.55.161:47080',
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

          // 3) Try pulling from mail provider content and extract reset URL/token.
          const apiBase =
            process.env.PROXIEDMAIL_API_BASE || config.env.PROXIEDMAIL_API_BASE;

          if (apiBase) {
            try {
              const res = await fetch(`${apiBase}/en/settings`, {
                method: 'GET',
                headers: {
                  accept: 'application/json,text/html,*/*',
                },
              });

              const raw = await res.text();

              // Prefer full reset link if found.
              const linkMatches =
                raw.match(/https?:\/\/[^\s"'<>]*\/forgot-password\?token=[^"' <>&]+(?:&step=\d+)?/gi) || [];
              if (linkMatches.length > 0) {
                return linkMatches[linkMatches.length - 1];
              }

              // Fallback: extract token and let test build reset URL.
              const tokenMatch =
                raw.match(/(?:token["']?\s*[:=]\s*["']?|token=)([A-Za-z0-9_-]{16,})/i);
              if (tokenMatch?.[1]) {
                return { token: tokenMatch[1] };
              }
            } catch (error) {
              console.log('getLatestResetPassword fetch error:', error?.message || error);
            }
          }

          return null;
        },
      });
      return config;
    },
  },
};
