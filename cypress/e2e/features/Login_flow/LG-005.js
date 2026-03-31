const FORGOT_PASSWORD_API = /\/api\/.*\/forg(?:o|e)t-password/i;

function verifyForgetPasswordPageMessage() {
    cy.url().should('include', '/forgot-password');
    cy.get('input#email, input[name="email"], input[placeholder="example@email.com"]')
        .first()
        .should('be.visible');
    cy.contains('button', /下一步|送出|發送/i).should('be.visible');
}

function verifyNextPageResetPasswordMessage() {
    cy.contains('h2', /重設密碼/i).should('be.visible');
    cy.get('#new-password').should('be.visible');
    cy.get('#confirm-password').should('be.visible');
    cy.contains('button', /變更密碼|送出/i).should('be.visible');
}

function verifyResetSuccessMessage() {
    cy.contains('h2, p', /成功|完成|重設/i).should('exist');
    cy.contains('button', /返回|回到登入|登入/i).should('be.visible');
}

function verifyForgetPasswordPageApI() {
    cy.intercept('POST', FORGOT_PASSWORD_API).as('forgetPasswordApi');
}

function verifyForgetPasswordPagefailAPI() {
    cy.intercept('POST', FORGOT_PASSWORD_API, {
        statusCode: 400,
        body: { msg: '請稍後再試' },
    }).as('forgetPasswordApiFail');

    cy.contains('button', /下一步|送出|發送/i).click();
}

function verifyForgetPasswordPageApiRequest(email) {
    cy.wait('@forgetPasswordApi').then(({ request, response }) => {
        expect(request.method).to.eq('POST');
        expect(request.url).to.match(FORGOT_PASSWORD_API);
        expect(request.body).to.have.property('email', email);
        expect(response.statusCode).to.eq(200);

        const body = response.body || {};
        const apiMessage = body.message || body.msg || body.error || '';
        expect(String(apiMessage).trim()).to.not.equal('');

        if (body.code !== undefined && body.code !== null) {
            expect(Number(body.code)).to.eq(200);
        }
    });
}

function buildResetLinkFromTaskResult(taskResult, step = 2) {
    if (!taskResult) return null;

    if (typeof taskResult === 'string') {
        const value = taskResult.trim();
        if (!value) return null;
        if (value.includes('/forgot-password')) return value;
        return `/forgot-password?token=${encodeURIComponent(value)}&step=${step}`;
    }

    if (typeof taskResult === 'object') {
        const url = taskResult.url || taskResult.resetLink || taskResult.link;
        if (url) return url;

        const token = taskResult.token || taskResult.resetToken;
        if (token) return `/forgot-password?token=${encodeURIComponent(token)}&step=${step}`;
    }

    return null;
}

function pollResetLink(email, retries, intervalMs, step) {
    cy.log(`poll reset link: retries left ${retries}`);
    return cy.task('getLatestResetPassword', { email }).then((taskResult) => {
        const resetLink = buildResetLinkFromTaskResult(taskResult, step);

        if (resetLink) return resetLink;

        if (retries <= 0) {
            return null;
        }

        return cy.wait(intervalMs).then(() =>
            pollResetLink(email, retries - 1, intervalMs, step)
        );
    });
}

function getResetLinkFromRoundcube(
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
                const $refresh = $body
                    .find('button, a, span')
                    .filter((_, el) => /重新整理|刷新|refresh/i.test(el.innerText || ''))
                    .filter(':visible')
                    .first();

                if ($refresh.length) {
                    cy.wrap($refresh).click({ force: true });
                    return;
                }

                // fallback if no visible refresh control
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

                // Wait a bit if login form might still be rendering.
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

                cy.log('roundcube: login form detected, typing credentials');

                if ($user.length) {
                    cy.wrap($user)
                        .clear()
                        .type(String(roundcubeAccount), { force: true });
                }

                cy.wrap($pass)
                    .clear()
                    .type(String(roundcubePassword), { log: false, force: true });

                const $submit = $body.find(submitSelector).filter(':visible').first();
                if ($submit.length) {
                    cy.wrap($submit).click({ force: true });
                    cy.wait(3000);
                    return;
                }

                cy.contains('button, input[type="submit"]', /log in|login|sign in|登入/i, { timeout: 10000 })
                    .click({ force: true });
                cy.wait(3000);
            });

        return openInbox(roundcubeInboxUrl)
            .then((ok) => {
                if (ok) return;

                // fallback when cpsess url expired
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
            .then(() => {
                const extractLinkFromCurrentPage = () =>
                    cy.document().then((doc) => {
                        let text = doc.body?.innerText || '';
                        const frame = doc.querySelector('iframe#messagecontframe');
                        const frameText = frame?.contentDocument?.body?.innerText || '';
                        if (frameText) {
                            text += `\n${frameText}`;
                        }

                        const fullUrlMatch = String(text).match(
                            /https?:\/\/[^\s"'<>]*\/forgot-password\?token=[A-Za-z0-9._-]+(?:&step=\d+)?/i
                        );
                        if (fullUrlMatch) return fullUrlMatch[0];

                        const pathMatch = String(text).match(
                            /\/forgot-password\?token=[A-Za-z0-9._-]+(?:&step=\d+)?/i
                        );
                        if (pathMatch) return pathMatch[0];

                        return null;
                    });

                const tryOpenResetMail = () =>
                    cy.get('body', { timeout: 20000 }).then(($body) => {
                        // 1) Always prefer newest row from mail list (top row).
                        const rowSelector = [
                            '#messagelist tbody tr',
                            'table#messagelist tbody tr',
                            'table.listing.messagelist tbody tr',
                            '.messagelist tbody tr',
                            'tr.message',
                        ].join(',');
                        const $rows = $body.find(rowSelector).filter(':visible');
                        if ($rows.length) {
                            const $target = $rows.first();
                            return cy.wrap($target).click({ force: true }).then(() => true);
                        }

                        // 2) Fallback: click subject text.
                        const $subject = $body
                            .find('a,span,div,td')
                            .filter((_, el) => /WETPAINT.*重設密碼通知|重設密碼通知/i.test(el.innerText || ''))
                            .filter(':visible')
                            .first();
                        if ($subject.length) {
                            return cy.wrap($subject).click({ force: true }).then(() => true);
                        }

                        return cy.wrap(false);
                    });

                const pollResetLinkFromInbox = (retriesLeft) =>
                    extractLinkFromCurrentPage().then((linkOnCurrentPage) => {
                        if (linkOnCurrentPage) return linkOnCurrentPage;

                        return tryOpenResetMail()
                            .then((clicked) => {
                                if (!clicked) return null;
                                cy.wait(2200);
                                return extractLinkFromCurrentPage();
                            })
                            .then((linkAfterOpen) => {
                                if (linkAfterOpen) return linkAfterOpen;

                                if (retriesLeft <= 0) {
                                    throw new Error(
                                        'Roundcube page did not contain a reset-password link before timeout.'
                                    );
                                }

                                cy.log(`roundcube: waiting new mail... retries left ${retriesLeft}`);
                                return cy.wait(messageIntervalMs)
                                    .then(() => refreshInboxSoft())
                                    .then(() => pollResetLinkFromInbox(retriesLeft - 1));
                            });
                    });

                return pollResetLinkFromInbox(messageRetries);
            });
        }
    );
}

function verifygetlatestResetPassword(email, options = {}) {
    const {
        retries = 15,
        intervalMs = 3000,
        step = 2,
        mailRetries = 20,
        mailIntervalMs = 3000,
        source = 'auto', // 'auto' | 'roundcube' | 'task'
        roundcubeInboxUrl: inboxUrlFromOptions,
        roundcubeAccount: accountFromOptions,
        roundcubePassword: passwordFromOptions,
    } = options;

    const roundcubeInboxUrl =
        inboxUrlFromOptions ||
        Cypress.env('ROUNDCUBE_INBOX_URL') ||
        Cypress.env('ROUNDCUBE_URL');
    const roundcubeAccount =
        accountFromOptions ||
        Cypress.env('ROUNDCUBE_ACCOUNT');
    const roundcubePassword =
        passwordFromOptions ||
        Cypress.env('ROUNDCUBE_PASSWORD');

    const preferRoundcube =
        source === 'roundcube' || (source === 'auto' && Boolean(roundcubeInboxUrl));

    const resetLinkChain = preferRoundcube
        ? (() => {
            if (!roundcubeInboxUrl) {
                throw new Error(
                    'source=roundcube but no inbox url found. ' +
                    'Pass options.roundcubeInboxUrl or set ROUNDCUBE_INBOX_URL.'
                );
            }
            cy.log(`get reset link from roundcube => ${roundcubeInboxUrl}`);
            return getResetLinkFromRoundcube(
                roundcubeInboxUrl,
                roundcubeAccount,
                roundcubePassword,
                mailRetries,
                mailIntervalMs
            );
        })()
        : pollResetLink(email, retries, intervalMs, step).then((taskResetLink) => {
            if (taskResetLink) return taskResetLink;

            if (!roundcubeInboxUrl) {
                throw new Error(
                    `Could not get reset link/token for ${email}. ` +
                    'Set ROUNDCUBE_INBOX_URL in cypress env, or implement getLatestResetPassword task.'
                );
            }

            cy.log(`fallback roundcube => ${roundcubeInboxUrl}`);
            return getResetLinkFromRoundcube(
                roundcubeInboxUrl,
                roundcubeAccount,
                roundcubePassword,
                mailRetries,
                mailIntervalMs
            );
        });

    return resetLinkChain.then((resetLink) => {
        expect(resetLink).to.include('/forgot-password');
        const baseUrl = Cypress.config('baseUrl');
        const baseOrigin = new URL(baseUrl).origin;
        const parsedResetUrl = new URL(resetLink, baseUrl);

        // Email link may point to another host/IP (e.g. 192.168.x.x).
        // Keep path/query but force current test origin to avoid cross-origin failures.
        const targetUrl =
            parsedResetUrl.origin === baseOrigin
                ? parsedResetUrl.toString()
                : `${baseOrigin}${parsedResetUrl.pathname}${parsedResetUrl.search}${parsedResetUrl.hash}`;

        if (parsedResetUrl.origin !== baseOrigin) {
            cy.log(`normalize reset origin: ${parsedResetUrl.origin} -> ${baseOrigin}`);
        }

        cy.log(`reset link => ${targetUrl}`);
        cy.visit(targetUrl);
        return cy.location('href', { timeout: 10000 })
            .then((href) => {
                cy.log(`after visit => ${href}`);
                expect(href).to.include('/forgot-password');
                expect(href).to.match(/[?&]token=/);
            })
            .then(() => targetUrl);
    });
}

export {
    verifyForgetPasswordPageMessage,
    verifyForgetPasswordPageApI,
    verifyForgetPasswordPageApiRequest,
    verifyForgetPasswordPagefailAPI,
    verifyNextPageResetPasswordMessage,
    verifyResetSuccessMessage,
    verifygetlatestResetPassword,
};
