function verifyAboutFrontPageLoaded() {
    cy.location('pathname', { timeout: 10000 }).should('include', '/about');
    cy.get('main').should('be.visible');
}

function verifyAboutFrontPageCoreBlocks() {
    cy.get('main').within(() => {
        cy.get('h1, h2, h3, p, div')
            .filter(':visible')
            .its('length')
            .should('be.greaterThan', 5);
    });
}

function verifyNoEditActionOnFrontPage() {
    cy.get('main').then(($main) => {
        const $actions = $main.find('button:visible, a:visible');
        const $editActions = Cypress.$($actions)
            .filter((_, el) => /edit|編輯/.test(Cypress.$(el).text().trim()));

        expect($editActions.length, 'front about page should not expose edit actions').to.eq(0);
    });
}

export {
    verifyAboutFrontPageLoaded,
    verifyAboutFrontPageCoreBlocks,
    verifyNoEditActionOnFrontPage,
};
