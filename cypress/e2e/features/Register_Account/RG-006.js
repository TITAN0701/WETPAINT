import LoginSys from '../../page-objects/Login_flow/LoginWetpaint';

function getLatestRegisterAccountPath() {
  const reportRunId = String(Cypress.env('REPORT_RUN_ID') || 'local').trim() || 'local';
  const safeRunId = reportRunId.replace(/[^A-Za-z0-9._-]/g, '-');
  return `cypress/.runtime/${safeRunId}/latest_register_account.json`;
}

function saveLatestRegisterAccount(account, options = {}) {
  const targetPath = options.path || getLatestRegisterAccountPath();
  const payload = {
    email: account?.email || '',
    phone: account?.phone || '',
    loginId: account?.loginId || account?.phone || account?.email || '',
    password: account?.password || '',
    inboxId: account?.inboxId || '',
    source: account?.source || '',
    createdAt: account?.createdAt || new Date().toISOString(),
  };

  expect(payload.loginId, 'latest register account login id').to.be.a('string').and.not.be.empty;
  expect(payload.password, 'latest register account password').to.be.a('string').and.not.be.empty;

  return cy.writeFile(targetPath, payload).then(() => payload);
}

function readLatestRegisterAccount(options = {}) {
  const targetPath = options.path || getLatestRegisterAccountPath();
  return cy.readFile(targetPath);
}

function loginWithLatestRegisterAccount(options = {}) {
  const { beforeLogin } = options;
  const loginSys = new LoginSys();

  return readLatestRegisterAccount().then(({ email, phone, loginId, password }) => {
    if (typeof beforeLogin === 'function') {
      beforeLogin();
    }

    const accountId = loginId || phone || email;

    expect(accountId, 'latest register account identifier').to.be.a('string').and.not.be.empty;
    loginSys.clickaccountnumber(accountId);
    loginSys.clickpassword(password);
    loginSys.clickLoginButton();
  });
}

function resolveMailSlurpApiKey(explicitApiKey, purpose = 'test') {
  if (explicitApiKey) {
    return explicitApiKey;
  }

  if (purpose === 'register') {
    return (
      Cypress.env('MAILSLURP_REGISTER_API_KEY') ||
      Cypress.env('MAILSLURP_API_KEY') ||
      Cypress.env('MAILSLURP_TEST_API_KEY') ||
      null
    );
  }

  return (
    Cypress.env('MAILSLURP_TEST_API_KEY') ||
    Cypress.env('MAILSLURP_API_KEY') ||
    Cypress.env('MAILSLURP_REGISTER_API_KEY') ||
    null
  );
}

function resolveMailSlurpApiKeySource(explicitApiKey, purpose = 'test') {
  if (explicitApiKey) {
    return 'explicit apiKey argument';
  }

  const registerOrder = [
    'MAILSLURP_REGISTER_API_KEY',
    'MAILSLURP_API_KEY',
    'MAILSLURP_TEST_API_KEY',
  ];
  const defaultOrder = [
    'MAILSLURP_TEST_API_KEY',
    'MAILSLURP_API_KEY',
    'MAILSLURP_REGISTER_API_KEY',
  ];
  const envOrder = purpose === 'register' ? registerOrder : defaultOrder;

  const matchedEnvName = envOrder.find((envName) => {
    const value = Cypress.env(envName);
    return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
  });

  return matchedEnvName || 'not found';
}

function createRegisterInboxWithMailSlurp(options = {}) {
  const { apiKey, createInboxOptions = {} } = options;
  const resolvedApiKey = resolveMailSlurpApiKey(apiKey, 'register');
  const apiKeySource = resolveMailSlurpApiKeySource(apiKey, 'register');

  expect(resolvedApiKey, 'mailslurp register api key').to.be.a('string').and.not.be.empty;
  cy.log(`MailSlurp register key source: ${apiKeySource}`);

  return cy.mailslurp({ apiKey: resolvedApiKey }).then((mailslurp) => mailslurp.createInboxWithOptions(createInboxOptions))
    .then((inbox) => {
      expect(inbox?.id, 'mailslurp inbox id').to.be.a('string').and.not.be.empty;
      expect(inbox?.emailAddress, 'mailslurp email address').to.be.a('string').and.not.be.empty;

      return {
        inboxId: inbox.id,
        emailAddress: inbox.emailAddress,
      };
    });
}

function verifyGetRegisterOtpFromMailSlurp(inboxId, options = {}) {
  const {
    apiKey,
    timeoutMs = 120000,
    unreadOnly = true,
    pattern = '(\\d{6})',
  } = options;
  const resolvedApiKey = resolveMailSlurpApiKey(apiKey, 'register');
  const apiKeySource = resolveMailSlurpApiKeySource(apiKey, 'register');

  expect(inboxId, 'mailslurp inbox id').to.be.a('string').and.not.be.empty;
  expect(resolvedApiKey, 'mailslurp register api key').to.be.a('string').and.not.be.empty;
  cy.log(`MailSlurp register key source: ${apiKeySource}`);

  return cy.mailslurp({ apiKey: resolvedApiKey }).then({ timeout: timeoutMs }, (mailslurp) =>
      mailslurp.waitForLatestEmail(inboxId, timeoutMs, unreadOnly).then((email) =>
          mailslurp.emailController.getEmailContentMatch({
            emailId: email.id,
            contentMatchOptions: {
              pattern,
            },
          })
        )
        .then(({ matches }) => {
          const otp =
            matches?.[1] ||
            matches?.[0] ||
            null;

          expect(otp, 'mailslurp register otp').to.match(/^\d{6}$/);
          return otp;
        })
    );
}

function getRegisterOtpFromRoundcube(
  roundcubeInboxUrl,
  roundcubeAccount,
  roundcubePassword,
  messageRetries = 20,
  messageIntervalMs = 3000
) {
  const origin = new URL(roundcubeInboxUrl).origin;

  return cy.origin(
    origin,
    {
      args: {
        roundcubeInboxUrl,
        roundcubeAccount,
        roundcubePassword,
        messageRetries,
        messageIntervalMs,
      },
    },
    ({ roundcubeInboxUrl, roundcubeAccount, roundcubePassword, messageRetries, messageIntervalMs }) => {
      Cypress.on('uncaught:exception', (err) => {
        if (/rcube_webmail is not defined/i.test(err.message || '')) {
          return false;
        }
      });

      const is404Page = () =>
        cy.get('body', { timeout: 20000 }).then(($body) => {
          const text = String($body.text() || '');
          return /404|Not Found|requested URL was not found/i.test(text);
        });

      const openInbox = (url) =>
        cy.visit(url, { failOnStatusCode: false }).then(() => is404Page().then((is404) => !is404));

      const refreshInboxSoft = () =>
        cy.get('body').then(($body) => {
          const $refresh = $body.find('button, a, span').filter((_, el) => /重新整理|刷新|refresh/i.test(el.innerText || ''))
            .filter(':visible').first();

          if ($refresh.length) {
            cy.wrap($refresh).click({ force: true });
            return;
          }

          cy.reload();
        });

      const loginIfNeeded = (retry = 5) =>
        cy.get('body', { timeout: 20000 }).then(($body) => {
          const userSelector = [
            'input#rcmloginuser',
            'input[name="_user"]',
            'input[name="user"]',
            'input#user',
            'input[type="email"]',
            'input[autocomplete="username"]',
          ].join(',');

          const passSelector = [
            'input#rcmloginpwd',
            'input[name="_pass"]',
            'input[name="pass"]',
            'input#pass',
            'input[type="password"]',
            'input[autocomplete="current-password"]',
          ].join(',');

          const submitSelector = [
            'button#rcmloginsubmit',
            'button[type="submit"]',
            'input[type="submit"]',
            '#login_submit',
          ].join(',');

          const $user = $body.find(userSelector).filter(':visible').first();
          const $pass = $body.find(passSelector).filter(':visible').first();

          if (!$pass.length) {
            if (retry > 0) {
              cy.wait(800);
              return loginIfNeeded(retry - 1);
            }
            cy.log('roundcube: login form not detected after retries, skip login');
            return;
          }

          if (!roundcubeAccount || !roundcubePassword) {
            throw new Error(
              'Roundcube login page detected, but no credentials provided. ' +
              'Set CYPRESS_ROUNDCUBE_ACCOUNT and CYPRESS_ROUNDCUBE_PASSWORD.'
            );
          }

          if ($user.length) {
            cy.wrap($user)
              .clear()
              .type(String(roundcubeAccount), { force: true });
          }

          cy.wrap($pass).clear().type(String(roundcubePassword), { log: false, force: true });

          const $submit = $body.find(submitSelector).filter(':visible').first();
          if ($submit.length) {
            cy.wrap($submit).click({ force: true });
            cy.wait(3000);
            return;
          }

          cy.contains('button, input[type="submit"]', /log in|login|sign in|登入/i, { timeout: 10000 }).click({ force: true });
          cy.wait(3000);
        });

      const extractOtpFromCurrentPage = () =>
        cy.document().then((doc) => {
          let text = doc.body?.innerText || '';
          const frame = doc.querySelector('iframe#messagecontframe');
          const frameText = frame?.contentDocument?.body?.innerText || '';

          if (frameText) {
            text += `\n${frameText}`;
          }

          const labeledMatch = String(text).match(/(?:驗證碼(?:為|:)?\s*|code(?: is|:)?\s*)(\d{6})/i);
          if (labeledMatch?.[1]) return labeledMatch[1];

          return String(text).match(/\b\d{6}\b/)?.[0] || null;
        });

      const tryOpenOtpMail = () =>
        cy.get('body', { timeout: 20000 }).then(($body) => {
          const rowSelector = [
            '#messagelist tbody tr',
            'table#messagelist tbody tr',
            'table.listing.messagelist tbody tr',
            '.messagelist tbody tr',
            'tr.message',
          ].join(',');

          const $subjectRow = $body.find(rowSelector).filter((_, el) => /WETPAINT.*驗證碼|驗證碼/i.test(el.innerText || ''))
            .filter(':visible').first();

          if ($subjectRow.length) {
            return cy.wrap($subjectRow).click({ force: true }).then(() => true);
          }

          const $rows = $body.find(rowSelector).filter(':visible');
          if ($rows.length) {
            return cy.wrap($rows.first()).click({ force: true }).then(() => true);
          }

          return cy.wrap(false);
        });

      const pollOtpFromInbox = (retriesLeft) =>
        extractOtpFromCurrentPage().then((otpOnCurrentPage) => {
          if (otpOnCurrentPage) return otpOnCurrentPage;

          return tryOpenOtpMail().then((clicked) => {
              if (!clicked) return null;
              cy.wait(2200);
              return extractOtpFromCurrentPage();
            })
            .then((otpAfterOpen) => {
              if (otpAfterOpen) return otpAfterOpen;

              if (retriesLeft <= 0) {
                throw new Error('Roundcube page did not contain a 6-digit register OTP before timeout.');
              }

              cy.log(`roundcube register otp: waiting new mail... retries left ${retriesLeft}`);
              return cy.wait(messageIntervalMs).then(() => refreshInboxSoft())
                .then(() => pollOtpFromInbox(retriesLeft - 1));
            });
        });

      return openInbox(roundcubeInboxUrl)
        .then((ok) => {
          if (ok) return;

          return openInbox('/3rdparty/roundcube/?_task=mail&_mbox=INBOX').then((okFallback) => {
            if (!okFallback) {
              throw new Error(
                'Roundcube inbox URL is invalid or expired (cpsess). ' +
                'Please update CYPRESS_ROUNDCUBE_INBOX_URL.'
              );
            }
          });
        })
        .then(() => loginIfNeeded())
        .then(() => pollOtpFromInbox(messageRetries));
    }
  );
}

function verifysetupsendotpAPI() {
  cy.intercept('POST', '**/api/auth/code/send*').as('getSendotpAPI');
}

function verifyGetEmailotpAPI(options = {}) {
  const {
    expectedStatusCode = 200,
    expectedMessageIncludes,
  } = options;

  cy.wait('@getSendotpAPI').then(({ request, response }) => {
    expect(request.method).to.eq('POST');
    if (expectedStatusCode === 409) {
      const body = response.body || {};
      const message = body.message || body.error || body.msg;

      if (expectedMessageIncludes) {
        expect(message).to.include(expectedMessageIncludes);
      }
    }
  });
}

export {
  createRegisterInboxWithMailSlurp,
  loginWithLatestRegisterAccount,
  readLatestRegisterAccount,
  saveLatestRegisterAccount,
  verifyGetRegisterOtpFromMailSlurp,
  verifysetupsendotpAPI,
  verifyGetEmailotpAPI,
};
