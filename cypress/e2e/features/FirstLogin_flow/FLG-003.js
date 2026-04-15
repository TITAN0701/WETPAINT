import FirstPageList from '../../page-objects/frontdesk_manage/firstpagelist';
import * as TestFDT002 from '../FrontDesk_flow/FDT-002';

const firstPageList = new FirstPageList();

function normalizeText(value) {
    return String(value ?? '')
        .replace(/\s+/g, '')
        .replace(/\u81FA/g, '\u53F0')
        .trim()
        .toUpperCase();
}

function setupChildListAgeApiIntercepts() {
    cy.intercept('GET', /\/(?:cskapi\/)?api\/child(?:\/.*)?(?:\?.*)?$/).as('GetChildListAPI');
}

function pickChildFromBody(body) {
    const candidates = [
        body?.data?.items,
        body?.data?.list,
        body?.data?.rows,
        body?.data?.data,
        body?.data,
        body?.items,
        body?.list,
        body?.rows,
    ];

    const list = candidates.find((arr) => Array.isArray(arr) && arr.length > 0);
    return list ? list[0] : null;
}

function getChildField(child, keys) {
    return keys.map((key) => child?.[key]).find((value) => String(value ?? '').trim() !== '') ?? null;
}

function verifyAnyChildIdentityMatchesProfileFromApi() {
    cy.wait('@GetChildListAPI', { timeout: 20000 }).then(({ response }) => {
        expect(response, 'child list response').to.exist;
        expect(response.statusCode, 'statusCode').to.eq(200);

        const child = pickChildFromBody(response.body);
        expect(child, 'child list should have at least one child').to.exist;

        const identity = getChildField(child, [
            'identityNo',
            'idNo',
            'idNumber',
            'childIdentityNo',
            'nationalId',
            'identityNumber',
        ]);
        const childName = getChildField(child, ['name', 'childName', 'fullName']);

        expect(identity, 'identity from API').to.be.a('string').and.not.be.empty;
        expect(childName, 'child name from API').to.be.a('string').and.not.be.empty;

        cy.visit('/developmental');
        cy.location('pathname', { timeout: 10000 }).should('include', '/developmental');

        firstPageList.clickChildfileButton(childName);
        firstPageList.clickProfileButton();
        TestFDT002.verifyProfileTabLoaded();

        cy.get('body').then(($body) => {
            const $idInput = $body.find('input[placeholder="F123456789"]:visible').first();

            if ($idInput.length > 0) {
                cy.wrap($idInput).invoke('val').then((value) => {
                    expect(normalizeText(value)).to.eq(normalizeText(identity));
                });
                return;
            }

            cy.contains('body', normalizeText(identity), {
                timeout: 10000,
                matchCase: true,
            }).should('be.visible');
        });
    });
}

export {
    setupChildListAgeApiIntercepts,
    verifyAnyChildIdentityMatchesProfileFromApi,
};
