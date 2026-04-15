function setupChildListAgeApiIntercepts() {
    cy.intercept('GET', /\/(?:cskapi\/)?api\/child(?:\/.*)?(?:\?.*)?$/).as('GetChildListAPI');
}

function normalizeText(value) {
    return String(value ?? '')
        .replace(/\s+/g, '')
        .replace(/\u81FA/g, '\u53F0')
        .trim();
}

function parseDate(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return null;

    const normalized = raw.replace(/\./g, '-').replace(/\//g, '-');
    const parsed = new Date(normalized);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed;
    }

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

function pickChildList(body) {
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

    return candidates.find((arr) => Array.isArray(arr)) || [];
}

function getChildField(child, keys) {
    return keys.map((key) => child?.[key]).find((value) => String(value ?? '').trim() !== '') ?? null;
}

function buildExpectedAgeCandidates(birthDate) {
    const { years, months } = calcAgeParts(birthDate);

    if (years <= 0) {
        return [normalizeText(`${months}個月`)];
    }

    return [
        normalizeText(`${years}歲${months}個月`),
        normalizeText(`${years}歲`),
    ];
}

function verifyCreatedChildAgeMatchesBirthDateFromApi(expectedChild = {}) {
    cy.wait('@GetChildListAPI', { timeout: 20000 }).then(({ response }) => {
        expect(response, 'child list response').to.exist;
        expect(response.statusCode, 'statusCode').to.eq(200);

        const childName = String(expectedChild?.childName || '').trim();
        const childselfcode = String(expectedChild?.childselfcode || '').trim().toUpperCase();
        expect(childName, 'expected child name from FLG-002').to.not.equal('');

        const childList = pickChildList(response.body);
        expect(childList.length, 'child list length').to.be.greaterThan(0);

        const matchedChild = childList.find((child) => {
            const apiName = String(getChildField(child, ['name', 'childName', 'fullName']) || '').trim();
            const apiIdentity = String(getChildField(child, [
                'identityNo',
                'idNo',
                'idNumber',
                'childIdentityNo',
                'nationalId',
                'identityNumber',
            ]) || '').trim().toUpperCase();

            return (
                (childselfcode && apiIdentity === childselfcode)
                || apiName === childName
            );
        });

        expect(matchedChild, `child ${childName} should exist in child list API`).to.exist;

        const birthRaw = getChildField(matchedChild, ['birthDate', 'birthday', 'dob', 'dateOfBirth']);
        expect(birthRaw, 'birthDate from API').to.exist;

        const birthDate = parseDate(birthRaw);
        expect(birthDate, `birthDate parse fail: ${birthRaw}`).to.exist;

        const expectedAgeCandidates = buildExpectedAgeCandidates(birthDate);

        cy.contains('div.group.cursor-pointer', childName, { timeout: 10000 })
            .should('be.visible')
            .then(($card) => {
                const cardText = normalizeText($card.text());
                const matchedAge = expectedAgeCandidates.some((candidate) => cardText.includes(candidate));

                expect(
                    matchedAge,
                    `frontdesk card age should include one of: ${expectedAgeCandidates.join(', ')}`
                ).to.eq(true);
            });
    });
}

export {
    setupChildListAgeApiIntercepts,
    verifyCreatedChildAgeMatchesBirthDateFromApi,
};
