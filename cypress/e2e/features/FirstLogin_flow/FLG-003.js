function setupChildListAgeApiIntercepts() {
    // Match both:
    // /api/child
    // /api/child/paged?...
    // /cskapi/api/child
    // /cskapi/api/child/paged?...
    cy.intercept('GET', /\/(?:cskapi\/)?api\/child(?:\/.*)?(?:\?.*)?$/).as('GetChildListAPI');
}

function normalizeText(value) {
    return String(value ?? '')
        .replace(/\s+/g, '')
        .replace(/\u81FA/g, '\u53F0') // 臺 -> 台
        .trim();
}

function parseDate(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return null;

    const normalized = raw.replace(/\./g, '-').replace(/\//g, '-');
    const d = new Date(normalized);
    if (!Number.isNaN(d.getTime())) return d;

    return null;
}

function calcAgeParts(birthDate, now = new Date()) {
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();

    if (now.getDate() < birthDate.getDate()) {
        months -= 1;
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months };
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
    if (!list) return null;

    return list[0];
}

function getChildField(child, keys) {
    return keys.map((k) => child?.[k]).find((v) => String(v ?? '').trim() !== '') ?? null;
}

function verifyAnyChildAgeMatchesBirthDateFromApi() {
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
            'id',
        ]);
        const childName = getChildField(child, ['name', 'childName', 'fullName']);
        const birthRaw = getChildField(child, ['birthDate', 'birthday', 'dob', 'dateOfBirth']);
        expect(birthRaw, 'birthDate from API').to.exist;

        const birthDate = parseDate(birthRaw);
        expect(birthDate, `birthDate parse fail: ${birthRaw}`).to.exist;

        const { years, months } = calcAgeParts(birthDate);
        const expectedAgeCandidates = years <= 0
            ? [normalizeText(`${months}\u500B\u6708`)] // 個月
            : [
                normalizeText(`${years}\u6B72${months}\u500B\u6708`), // 歲 + 個月
                normalizeText(`${years}\u6B72`), // 歲
            ];

        const rowKey = identity || childName;
        expect(rowKey, 'row key (identity/name)').to.exist;

        cy.contains('table tbody tr', String(rowKey), { timeout: 10000 })
            .should('be.visible')
            .within(() => {
                // 年齡欄位在第 4 欄（index 3）
                cy.get('td').eq(3).invoke('text').then((ageText) => {
                    const actual = normalizeText(ageText);
                    expect(
                        expectedAgeCandidates,
                        `age text should match one of ${expectedAgeCandidates.join(', ')}`
                    ).to.include(actual);
                });
            });
    });
}

export {
    setupChildListAgeApiIntercepts,
    verifyAnyChildAgeMatchesBirthDateFromApi,
};
