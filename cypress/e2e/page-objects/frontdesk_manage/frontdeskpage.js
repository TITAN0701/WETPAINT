class FrontDeskPage {
    constructor() {
        this.pageURL = '/login';
    }

    goToRegisterPage() {
        cy.visit(this.pageURL);
    }

    clickTopNavItem(label, path) {
        const openMenuSelector = '[role="dialog"][id^="reka-popover-content-"][data-state="open"]';

        cy.get('body').then(($body) => {
            if ($body.find(openMenuSelector).length > 0) {
                cy.get('body').type('{esc}', { force: true });
            }
        });

        cy.get(`header nav a[href="${path}"]`).filter(':visible').first().should('contain.text', label).scrollIntoView().click({ force: true });
        cy.location('pathname', { timeout: 10000 }).should('include', path);
    }

    clickFirstPageButton() {
        this.clickTopNavItem('孩童檔案', '/90/developmental');
    }

    clickFaqButton() {
        this.clickTopNavItem('FAQs', '/faqs');
    }

    clickAboutWeButton() {
        this.clickTopNavItem('關於我們', '/about');
    }
}

export default FrontDeskPage;
