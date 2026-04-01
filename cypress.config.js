module.exports = {
  projectId: 'z51i7a',
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'reports/latest',
    reportFilename: 'report',
    overwrite: true,
    charts: true,
    reportPageTitle: 'WETPAINT Cypress Test Report',
    reportTitle: 'WETPAINT Cypress Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    ignoreVideos: true,
    saveAllAttempts: false,
  },
  env: {
    "PROXIEDMAIL_API_KEY": "d6f74c5e43bc096e573922e4e147d56b",
    "PROXIEDMAIL_API_BASE": "https://proxiedmail.com",
    "ROUNDCUBE_INBOX_URL": process.env.CYPRESS_ROUNDCUBE_INBOX_URL || "https://bear.potia.net:2096/logout?",
    "ROUNDCUBE_ACCOUNT": process.env.CYPRESS_ROUNDCUBE_ACCOUNT || "titan.lee@ruenxin.com.tw",
    "ROUNDCUBE_PASSWORD": process.env.CYPRESS_ROUNDCUBE_PASSWORD || "Titan89114625X"
  },

  e2e: {
    baseUrl: 'http://61.220.55.161:47080',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

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
