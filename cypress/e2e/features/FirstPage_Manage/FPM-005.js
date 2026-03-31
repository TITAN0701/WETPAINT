function verifyAboutPageLoaded() {
    cy.location('pathname', { timeout: 10000 }).should('include', '/admin/about');
    cy.get('main').should('be.visible');
    cy.get('main button:visible').its('length').should('be.greaterThan', 0);
}

function verifyAboutPageCoreBlocks() {
    cy.get('main').within(() => {
        cy.get('h1, h2, h3, p, div')
            .filter(':visible')
            .its('length')
            .should('be.greaterThan', 5);
    });
}

function verifyAboutEditDialogCanOpenAndClose() {
    const dialogSelector = 'div[role="dialog"][data-state="open"]';

    cy.get('main').then(($main) => {
        const $buttons = $main.find('button:visible');
        expect($buttons.length, 'about page button count').to.be.greaterThan(0);

        const $editButton = Cypress.$($buttons)
            .filter((_, el) => /edit|編輯/i.test(Cypress.$(el).text()));

        if ($editButton.length > 0) {
            cy.wrap($editButton.first()).click({ force: true });
            return;
        }

        cy.wrap($buttons[0]).click({ force: true });
    });

    cy.get(dialogSelector, { timeout: 10000 }).should('be.visible');
    cy.get(dialogSelector).find('button:visible').its('length').should('be.greaterThan', 1);

    cy.get('body').type('{esc}', { force: true });
    cy.get(dialogSelector).should('not.exist');
}

export {
    verifyAboutPageLoaded,
    verifyAboutPageCoreBlocks,
    verifyAboutEditDialogCanOpenAndClose,
};
