function normalizeText(value) {
    return String(value ?? '')
        .replace(/\s+/g, '')
        .replace(/臺/g, '台')
        .trim()
        .toLowerCase();
}

function setupCreateUserInfoInterceptors() {
    cy.intercept({ method: /POST|PUT|PATCH/, url: '**/api/onboarding*' }).as('SaveOnboardingAPI');
}

function verifyCreateUserInfoResponse(expected = {}) {
    const expectedTexts = [
        expected.roleName,
        expected.domainName,
        expected.childName,
        expected.childselfcode,
    ]
        .filter((v) => String(v ?? '').trim() !== '')
        .map((v) => normalizeText(v));

    cy.wait('@SaveOnboardingAPI', { timeout: 20000 }).then(({ request, response }) => {
        expect(response, 'onboarding save response').to.exist;
        expect([200, 201], 'statusCode').to.include(response.statusCode);

        const reqPayload = normalizeText(JSON.stringify(request?.body ?? {}));
        expectedTexts.forEach((txt) => {
            expect(reqPayload, `onboarding request should include ${txt}`).to.include(txt);
        });

        if (response.body) {
            if (Object.prototype.hasOwnProperty.call(response.body, 'success')) {
                expect(response.body.success).to.eq(true);
            }
            if (Object.prototype.hasOwnProperty.call(response.body, 'code')) {
                expect(response.body.code).to.eq(200);
            }
        }
    });
}

function verifySavedUserInfoByOnboardingAPI({
    roleName,
    domainName,
    childName,
    childselfcode,
}) {
    const expectedTexts = [roleName, domainName, childName, childselfcode]
        .filter((v) => String(v ?? '').trim() !== '')
        .map((v) => normalizeText(v));

    const assertPayload = (response) => {
        expect([200, 304], 'statusCode').to.include(response.status);

        const payload = normalizeText(JSON.stringify(response.body ?? {}));
        expectedTexts.forEach((txt) => {
            expect(payload, `onboarding API payload should include ${txt}`).to.include(txt);
        });
    };

    cy.request({
        method: 'GET',
        url: '/api/onboarding',
        failOnStatusCode: false,
    }).then((response) => {
        if ([200, 304].includes(response.status)) {
            assertPayload(response);
            return;
        }

        cy.request({
            method: 'GET',
            url: '/cskapi/api/onboarding',
            failOnStatusCode: false,
        }).then((fallbackResponse) => {
            assertPayload(fallbackResponse);
        });
    });
}

function verifyCreatedChildProfileOnUI({
    childName,
    childselfcode,
}) {
    cy.visit('/admin/child-list');
    cy.location('pathname', { timeout: 10000 }).should('include', '/admin/child-list');

    if (childName) {
        cy.contains('body', String(childName), { timeout: 10000 }).should('exist');
    }

    if (childselfcode) {
        cy.contains('body', String(childselfcode), { timeout: 10000 }).should('exist');
    }
}

function verifyCreateUserInfoSuccess(data) {
    verifyCreateUserInfoResponse(data);
    verifySavedUserInfoByOnboardingAPI(data);
    verifyCreatedChildProfileOnUI(data);
}

export {
    setupCreateUserInfoInterceptors,
    verifyCreateUserInfoResponse,
    verifySavedUserInfoByOnboardingAPI,
    verifyCreatedChildProfileOnUI,
    verifyCreateUserInfoSuccess,
};
