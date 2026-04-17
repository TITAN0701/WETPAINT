function normalizeText(value) {
    return String(value ?? '')
        .replace(/\s+/g, '')
        .replace(/\u81FA/g, '\u53F0')
        .trim();
}

function extractItems(body) {
    const candidates = [
        body?.data?.items,
        body?.data?.list,
        body?.data?.rows,
        body?.items,
        body?.list,
        body?.rows,
    ];

    return candidates.find((value) => Array.isArray(value)) || [];
}

function getChildField(child, keys) {
    return keys
        .map((key) => child?.[key])
        .find((value) => String(value ?? '').trim() !== '') ?? null;
}

function assertQueryValue(key, actualValue, expectedValue) {
    if (typeof expectedValue === 'function') {
        expectedValue(actualValue, key);
        return;
    }

    if (expectedValue instanceof RegExp) {
        expect(actualValue, `request query ${key}`).to.match(expectedValue);
        return;
    }

    expect(actualValue, `request query ${key}`).to.eq(String(expectedValue));
}

function buildRowTextsFromItem(item, extraExpectedTexts = []) {
    return [
        getChildField(item, ['fullName', 'childName', 'name']),
        getChildField(item, ['caseCode']),
        getChildField(item, ['cityName', 'city', 'cityLabel']),
        getChildField(item, ['distName', 'districtName', 'district', 'distLabel']),
        ...extraExpectedTexts,
    ]
        .filter((value) => String(value ?? '').trim() !== '')
        .filter((value, index, array) => array.indexOf(value) === index);
}

function setupChildListApiIntercept(alias = 'GetChildListAPI') {
    cy.intercept('GET', /\/(?:cskapi\/)?api\/child\/paged(?:\?.*)?$/).as(alias);
}

function verifychildlistMessage(options = {}) {
    const {
        title,
        filterButtonText,
        searchButtonText,
        expectedColumns = [],
    } = options;

    if (title) {
        cy.contains('div:visible,h1:visible,h2:visible,span:visible', title).should('exist');
    }

    if (filterButtonText) {
        cy.contains('button:visible', filterButtonText).should('be.visible');
    }

    if (searchButtonText) {
        cy.contains('button:visible', searchButtonText).should('be.visible');
    }

    cy.get('table:visible').should('exist');
    cy.get('table thead tr:visible')
        .first()
        .find('th:visible')
        .then(($headers) => {
            expect($headers.length, 'visible table headers').to.be.greaterThan(0);
        });

    expectedColumns.forEach((column) => {
        cy.contains('table thead th:visible, div:visible, span:visible', column).should('exist');
    });
}

function verifychildInfoMessage(title, result) {
    cy.contains('button:visible', '孩童資料', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.contains('div:visible,label:visible,span:visible,p:visible', title, { timeout: 10000 })
        .should('be.visible')
        .parent()
        .within(() => {
            cy.get('div:visible')
                .eq(1)
                .invoke('text')
                .then((txt) => {
                    expect(String(txt).trim()).to.include(String(result));
                });
        });
}

function verifyFilterChips(expectedValues = [], options = {}) {
    const { containerText } = options;

    if (containerText) {
        cy.contains('body', String(containerText)).should('be.visible');
    }

    expectedValues
        .filter((value) => value !== undefined && value !== null && value !== '')
        .forEach((value) => {
            cy.contains('body', String(value), { matchCase: false }).should('be.visible');
        });
}

function verifychildlistfilterMessage(...chips) {
    verifyFilterChips(chips.filter(Boolean));
}

function verifyChildListApiResponse(options = {}) {
    const {
        alias = 'GetChildListAPI',
        query = {},
        requiredQueryKeys = [],
        expectHasData,
    } = options;

    return cy.wait(`@${alias}`, { timeout: 20000 }).then(({ request, response }) => {
        expect(response, 'child list response').to.exist;
        expect(response.statusCode, 'statusCode').to.eq(200);

        if (response.body?.code !== undefined) {
            expect(response.body.code, 'response code').to.eq(200);
        }

        if (response.body?.success !== undefined) {
            expect(response.body.success, 'response success').to.eq(true);
        }

        const requestUrl = new URL(request.url);

        requiredQueryKeys.forEach((key) => {
            const actualValue = requestUrl.searchParams.get(key);
            expect(actualValue, `request query ${key}`).to.be.a('string').and.not.be.empty;
        });

        Object.entries(query).forEach(([key, expectedValue]) => {
            assertQueryValue(key, requestUrl.searchParams.get(key), expectedValue);
        });

        const items = extractItems(response.body);
        expect(items, 'response items').to.be.an('array');

        if (expectHasData === true) {
            expect(items.length, 'items length').to.be.greaterThan(0);
        }

        if (expectHasData === false) {
            expect(items.length, 'items length').to.eq(0);
        }

        return { request, response, requestUrl, items };
    });
}

function verifyChildListFirstRowMatchesItem(item, options = {}) {
    const {
        rowIndex = 0,
        expectedTexts = [],
    } = options;

    expect(item, 'child list item').to.exist;

    const rowTexts = buildRowTextsFromItem(item, expectedTexts);

    cy.get('table tbody tr:visible')
        .eq(rowIndex)
        .should('be.visible')
        .invoke('text')
        .then((rowText) => {
            const normalizedRowText = normalizeText(rowText);

            rowTexts.forEach((text) => {
                expect(normalizedRowText, 'child list row text').to.include(normalizeText(text));
            });
        });
}

function verifyNoDataState(text = 'No data') {
    cy.contains('table td:visible, div:visible, span:visible', new RegExp(`^${text}$`)).should('be.visible');
}

function verifyRowViewButtonMessage() {
    cy.contains('button:visible,span:visible', '孩童資料').should('be.visible');
    cy.contains('button:visible,span:visible', /檢測建議|建議/).should('be.visible');
}

function verifyCheckResultButtonMessage() {
    cy.contains('div:visible,h1:visible,h2:visible,span:visible', /檢測結果|結果列表/).should('exist');
}

function verifyUpdatePage() {
    cy.intercept('GET', /\/(?:cskapi\/)?api\/child\/(?!paged)(?:[^/?]+)(?:\?.*)?$/).as('GetChildDetailAPI');
}

function verifyRequestUpdatePage() {
    cy.wait('@GetChildDetailAPI', { timeout: 20000 }).then(({ response }) => {
        expect(response, 'child detail response').to.exist;
        expect(response.statusCode, 'statusCode').to.eq(200);

        if (response.body?.code !== undefined) {
            expect(response.body.code, 'response code').to.eq(200);
        }

        if (response.body?.success !== undefined) {
            expect(response.body.success, 'response success').to.eq(true);
        }
    });
}

function resolveDeleteLookup(Addresscode, name, time) {
    if (Addresscode !== undefined && Addresscode !== null && Addresscode !== '') {
        return cy.wrap({
            primaryText: String(Addresscode),
            fallbackTexts: [name, time].filter(Boolean).map(String),
        });
    }

    return cy.get('@deletedChildInfo').then((info) => {
        const fallbackTexts = [info?.name, info?.caseCode, info?.rowText, name, time]
            .filter(Boolean)
            .map(String);

        return {
            primaryText: info?.caseCode || info?.name || fallbackTexts[0],
            fallbackTexts,
        };
    });
}

function verifyDeleteChildInfo(Addresscode, name, time, assertType = 'exist') {
    return resolveDeleteLookup(Addresscode, name, time).then(({ primaryText, fallbackTexts }) => {
        expect(primaryText, 'delete lookup text').to.exist;

        if (assertType === 'not.exist') {
            fallbackTexts.forEach((text) => {
                cy.contains('body', text, { matchCase: false }).should('not.exist');
            });
            return;
        }

        cy.contains('body', primaryText, { matchCase: false, timeout: 10000 })
            .should('exist')
            .closest('div.group.cursor-pointer, div[class*="cursor-pointer"]')
            .should('exist')
            .scrollIntoView()
            .within(() => {
                fallbackTexts.forEach((text) => {
                    cy.contains(String(text), { matchCase: false }).should('exist');
                });
            });
    });
}

function logDeleteChildInfo(Addresscode) {
    return resolveDeleteLookup(Addresscode).then(({ primaryText }) => {
        return cy.contains('body', primaryText, { matchCase: false, timeout: 10000 })
            .should('exist')
            .closest('div.group.cursor-pointer, div[class*="cursor-pointer"]')
            .should('exist')
            .scrollIntoView()
            .invoke('text')
            .then((text) => {
                const cleanedText = String(text)
                    .split('\n')
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .join(' | ');

                cy.log(`Delete child info: ${cleanedText}`);
                console.log('Delete child info:', cleanedText);

                return cleanedText;
            });
    });
}

export {
    setupChildListApiIntercept,
    verifychildlistMessage,
    verifychildInfoMessage,
    verifychildlistfilterMessage,
    verifyChildListApiResponse,
    verifyChildListFirstRowMatchesItem,
    verifyFilterChips,
    verifyNoDataState,
    verifyRowViewButtonMessage,
    verifyCheckResultButtonMessage,
    verifyUpdatePage,
    verifyRequestUpdatePage,
    verifyDeleteChildInfo,
    logDeleteChildInfo,
};
