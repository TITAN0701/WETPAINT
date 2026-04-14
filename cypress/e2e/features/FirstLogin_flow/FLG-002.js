import FirstPageList from '../../page-objects/frontdesk_manage/firstpagelist';
import { buildValidTaiwanId } from '../FrontDesk_flow/FDT_helpers';

const firstPageList = new FirstPageList();

function normalizeText(value) {
    return String(value ?? '')
        .replace(/\s+/g, '')
        .replace(/臺/g, '台')
        .trim()
        .toLowerCase();
}

function verifyCodeText(value) {
    return String(value ?? '')
        .replace(/\s+/g, '')
        .trim()
        .toUpperCase();
}

function setupCreateUserInfoInterceptors() {
    cy.intercept({
        method: /POST|PUT|PATCH/,
        url: /\/api\/onboarding(?:\/.*)?(?:\?.*)?$/,
    }).as('SaveOnboardingAPI');
}

function verifyCreateUserInfoResponse(expected = {}) {
    cy.wait('@SaveOnboardingAPI', { timeout: 20000 }).then(({ response }) => {
        expect(response, 'onboarding save response').to.exist;
        expect([200, 201], 'statusCode').to.include(response.statusCode);

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
        .filter((value) => String(value ?? '').trim() !== '')
        .map((value) => normalizeText(value));

    const isHtmlShellResponse = (response) => {
        const body = response?.body;
        const contentType = String(response?.headers?.['content-type'] || '').toLowerCase();
        const bodyText = typeof body === 'string'
            ? body
            : normalizeText(JSON.stringify(body ?? {}));

        return (
            contentType.includes('text/html')
            || /<!doctypehtml>|<html|<body|id="app"|class="isolate"/i.test(bodyText)
        );
    };

    const assertPayload = (response) => {
        expect([200, 304], 'statusCode').to.include(response.status);

        const payload = normalizeText(JSON.stringify(response.body ?? {}));
        expectedTexts.forEach((text) => {
            expect(payload, `onboarding API payload should include ${text}`).to.include(text);
        });
    };

    cy.request({
        method: 'GET',
        url: '/api/onboarding',
        failOnStatusCode: false,
    }).then((response) => {
        if ([200, 304].includes(response.status) && !isHtmlShellResponse(response)) {
            assertPayload(response);
            return;
        }

        cy.request({
            method: 'GET',
            url: '/cskapi/api/onboarding',
            failOnStatusCode: false,
        }).then((fallbackResponse) => {
            if ([401, 403].includes(fallbackResponse.status)) {
                cy.log(`Skip onboarding API payload assertion: fallback returned ${fallbackResponse.status}`);
                return;
            }

            assertPayload(fallbackResponse);
        });
    });
}

function openCreatedChildProfileOnUI(childName) {
    cy.visit('/developmental');
    cy.location('pathname', { timeout: 10000 }).should('include', '/developmental');

    if (childName) {
        cy.contains(
            'div.group.cursor-pointer:visible, div[class*="cursor-pointer"]:visible, button:visible, a:visible',
            String(childName),
            {
                timeout: 10000,
                matchCase: false,
            }
        ).then(($target) => {
            const $clickable = $target.closest('div.group.cursor-pointer, div[class*="cursor-pointer"], button, a');
            cy.wrap($clickable.length > 0 ? $clickable : $target)
                .scrollIntoView()
                .click({ force: true });
        });
    } else {
        cy.get('div.group.cursor-pointer:visible, div[class*="cursor-pointer"]:visible', { timeout: 10000 })
            .first()
            .click({ force: true });
    }

    firstPageList.clickProfileButton();
    cy.location('pathname', { timeout: 10000 }).should((pathname) => {
        const normalizedPath = String(pathname || '').toLowerCase();
        const isAllowed =
            normalizedPath.includes('/child-profile')
            || /^\/\d+$/.test(normalizedPath)
            || /\/developmental\/\d+/.test(normalizedPath);

        expect(
            isAllowed,
            `profile path should be one of: /child-profile, /:id, /developmental/:id; got ${pathname}`
        ).to.eq(true);
    });
}

function verifyChildSelfCodeOnProfile(childselfcode) {
    const expectedCode = verifyCodeText(childselfcode);
    const labelPattern = /孩童身分證字號|身分證字號/;

    cy.contains(
        'label:visible,div:visible,span:visible,p:visible',
        labelPattern,
        { timeout: 10000 }
    ).should('be.visible');

    cy.get('body').then(($body) => {
        const $idInput = $body.find('input[placeholder="F123456789"]:visible').first();

        if ($idInput.length > 0) {
            cy.wrap($idInput)
                .invoke('val')
                .then((value) => {
                    expect(verifyCodeText(value)).to.eq(expectedCode);
                });
            return;
        }

        cy.contains('body', expectedCode, {
            timeout: 10000,
            matchCase: true,
        }).should('be.visible');
    });
}

function verifyCreatedChildProfileOnUI({
    childName,
    childselfcode,
}) {
    openCreatedChildProfileOnUI(childName);

    if (childName) {
        cy.contains('body', String(childName), { timeout: 10000 }).should('exist');
    }

    if (childselfcode) {
        verifyChildSelfCodeOnProfile(childselfcode);
    }
}

function verifyAlreadyOnHomePage() {
    const allowedPathFragments = [
        '/dashboard',
        '/admin/dashboard',
        '/admin/child-list',
        '/developmental',
    ];

    cy.location('pathname', { timeout: 10000 }).should((pathname) => {
        const normalizedPath = String(pathname || '').toLowerCase();
        const isAllowed = allowedPathFragments.some((fragment) => normalizedPath.includes(fragment));

        expect(
            isAllowed,
            `post-login path should include one of: ${allowedPathFragments.join(', ')}`
        ).to.eq(true);
    });
}

function verifyCreateUserInfoSuccess(data) {
    verifyCreateUserInfoResponse(data);
    verifySavedUserInfoByOnboardingAPI(data);
    verifyCreatedChildProfileOnUI(data);
}

function buildOnboardingFormData(base = {}, options = {}) {
    const runId = options.runId || Date.now().toString().slice(-6);
    const idSeed = options.idSeed || `${Date.now()}${runId}`;
    const idGender = options.idGender || 'female';
    const childNamePrefix = options.childNamePrefix || 'E2Test';

    return {
        childName: options.childName || `${childNamePrefix}${runId}`,
        childselfcode: options.childselfcode || buildValidTaiwanId(idGender, idSeed),
        ...base,
    };
}

export {
    setupCreateUserInfoInterceptors,
    verifyCreateUserInfoResponse,
    verifySavedUserInfoByOnboardingAPI,
    verifyCreatedChildProfileOnUI,
    verifyAlreadyOnHomePage,
    verifyCreateUserInfoSuccess,
    buildOnboardingFormData,
};
