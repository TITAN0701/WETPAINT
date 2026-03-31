function verifyInviteManagementMessage(accountcode, accountname, role, tip, expectedRowCount = null) {
    const codeText = String(accountcode).trim();
    const expectedName = String(accountname).trim();
    const expectedRole = String(role).trim();
    const expectedTip = String(tip).trim();

    const findRowOnCurrentPage = () =>
        cy.get('table tbody tr:visible', { timeout: 15000 }).then(($rows) => {
            const $row = Cypress.$($rows)
                .filter((_, row) => Cypress.$(row).find('td').eq(0).text().trim() === codeText)
                .first();
            return $row.length ? $row : null;
        });

    const assertRowCells = ($row) => {
        const $td = $row.find('td');
        expect($td.eq(0).text().trim()).to.eq(codeText);
        expect($td.eq(1).text().trim()).to.eq(expectedName);
        expect($td.eq(2).text().trim()).to.eq(expectedRole);
        expect($td.eq(3).text().trim()).to.eq(expectedTip);
    };

    cy.get('button[data-type="page"]:visible').then(($btns) => {
        const pages = [...new Set(
            [...$btns]
                .map((el) => Cypress.$(el).attr('value'))
                .filter(Boolean)
        )];
        const targets = pages.length ? pages : [null];

        const scanPage = (index) => {
            if (index >= targets.length) {
                throw new Error(`row with account code ${codeText} not found in any visible page`);
            }

            const pageValue = targets[index];
            if (pageValue) {
                cy.get(`button[data-type="page"][value="${pageValue}"]`)
                    .should('be.visible')
                    .click({ force: true });
            }

            return findRowOnCurrentPage().then(($row) => {
                if ($row) {
                    assertRowCells($row);
                    return;
                }
                return scanPage(index + 1);
            });
        };

        return scanPage(0);
    });

    // Scroll list container to ensure lazy/virtual rows are rendered before counting.
    cy.get('body').then(($body) => {
        const containerSelector = 'div.relative.overflow-auto.rounded-2xl';
        if ($body.find(containerSelector).length > 0) {
            cy.get(containerSelector).first().scrollTo('bottom', { ensureScrollable: false });
            cy.wait(300);
            cy.get(containerSelector).first().scrollTo('top', { ensureScrollable: false });
        }
    });

    cy.get('table tbody tr:visible').its('length').then((count) => {
        cy.log(`rows: ${count}`);
        if (expectedRowCount !== null && expectedRowCount !== undefined && expectedRowCount !== '') {
            const expected = Number(expectedRowCount);
            expect(Number.isNaN(expected), 'expectedRowCount must be numeric').to.eq(false);
            expect(count, 'visible row count').to.eq(expected);
        }
    });
}

function verifyInviteManagementShareLink(){
    cy.window().then((win) => {
        if (!win.navigator.clipboard) {
            Object.defineProperty(win.navigator, 'clipboard', {
                configurable: true, value: { writeText: () => Promise.resolve() },
            });
        }
        cy.stub(win.navigator.clipboard, 'writeText').resolves().as('writeText');
    });
}

function verifyInviteCopyNotTriggeredYet(){
    cy.get('@writeText').should('not.have.been.called');
}

function verifyInviteManageGetlink(){
    cy.get('div[role="dialog"][data-state="open"]').last().within(() => {
        cy.get('input').invoke('val').then((url) => {
            const copiedUrl = String(url).trim();
            expect(copiedUrl, 'invite link input').to.not.eq('');
            cy.get('@writeText').should('have.callCount', 1);
            cy.get('@writeText').should('have.been.calledWith', copiedUrl);
        });
    });
}





export {
    verifyInviteManagementMessage,
    verifyInviteManagementShareLink,
    verifyInviteCopyNotTriggeredYet,
    verifyInviteManageGetlink
};
