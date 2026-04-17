function verifyInviteTableStructure(expectedHeaders = ['帳號編號', '帳號名稱', '角色', '來源', '動作']) {
    cy.get('table:visible').should('exist');
    expectedHeaders.forEach((header) => {
        cy.contains('th:visible', header).should('be.visible');
    });
    cy.get('table tbody tr:visible').its('length').should('be.gte', 1);
}

function verifyInviteRowCountAtMost(maxRows) {
    cy.get('table tbody tr:visible').its('length').should('be.lte', maxRows);
}

function verifyInvitePageSizeValue(expectedValue) {
    cy.contains('span:visible', '每頁顯示')
        .parent()
        .find('[role="combobox"]:visible [data-slot="value"]')
        .first()
        .invoke('text')
        .then((text) => {
            expect(text.trim()).to.eq(String(expectedValue));
        });
}

function verifyInviteSourceColumnValues(expectedSource) {
    cy.get('table tbody tr:visible').each(($row) => {
        const sourceText = $row.find('td').eq(3).text().trim();
        expect(sourceText).to.eq(String(expectedSource));
    });
}

function verifyInviteSearchResultMatchesAlias(alias = 'inviteSearchCode') {
    cy.get(`@${alias}`).then((accountCode) => {
        const expectedCode = String(accountCode).trim();

        cy.get('table tbody tr:visible').its('length').should('be.gte', 1);
        cy.get('table tbody tr:visible').then(($rows) => {
            const visibleCodes = Cypress.$($rows)
                .map((_, row) => Cypress.$(row).find('td').eq(0).text().trim())
                .get()
                .filter(Boolean);

            expect(visibleCodes, 'visible invite account codes').to.include(expectedCode);
        });
    });
}

function verifyInviteFirstRowActionButtons(minButtons = 3) {
    cy.get('table tbody tr:visible')
        .first()
        .find('td')
        .last()
        .find('button:visible')
        .its('length')
        .should('be.gte', minButtons);
}

function verifyInviteManagementShareLink() {
    cy.window().then((win) => {
        if (!win.navigator.clipboard) {
            Object.defineProperty(win.navigator, 'clipboard', {
                configurable: true,
                value: { writeText: () => Promise.resolve() },
            });
        }
        cy.stub(win.navigator.clipboard, 'writeText').resolves().as('writeText');
    });
}

function verifyInviteCopyNotTriggeredYet() {
    cy.get('@writeText').should('not.have.been.called');
}

function verifyInviteManageGetlink() {
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
    verifyInviteTableStructure,
    verifyInviteRowCountAtMost,
    verifyInvitePageSizeValue,
    verifyInviteSourceColumnValues,
    verifyInviteSearchResultMatchesAlias,
    verifyInviteFirstRowActionButtons,
    verifyInviteManagementShareLink,
    verifyInviteCopyNotTriggeredYet,
    verifyInviteManageGetlink
};
