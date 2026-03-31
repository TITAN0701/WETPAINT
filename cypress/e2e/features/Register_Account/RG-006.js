function verifygetoptFormProxiedEmail(email, retries = 7) {
  return cy.env('PROXIEDMAIL_API_BASE').then((apiBase) => {
    return cy.request({
      method: 'GET',
      url: `${apiBase}/en/settings`,
      failOnStatusCode: false,
    }).then(({ body }) => {
      const text = JSON.stringify(body || '');
      const otp = text.match(/\b\d{6}\b/)?.[0];

      if (otp) {
        return otp;
      }

      if (retries <= 0) {
        throw new Error(`Could not find OTP for ${email}`);
      }

      return cy.wait(2000).then(() => verifygetoptFormProxiedEmail(email, retries - 1));
    });
  });
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
  verifygetoptFormProxiedEmail,
  verifysetupsendotpAPI,
  verifyGetEmailotpAPI,
};
