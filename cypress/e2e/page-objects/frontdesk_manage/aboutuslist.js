import FrontDeskPage from './frontdeskpage';

class AboutUsList extends FrontDeskPage {
    constructor() {
        super();
        this.pagePath = '/about';
    }

    goToAboutUsPage() {
        this.clickAboutWeButton();
        this.verifyAboutUsListLoaded();
    }

    verifyAboutUsListLoaded() {
        cy.location('pathname', { timeout: 10000 }).should('include', this.pagePath);
        cy.get('main').should('be.visible');
        cy.get('main')
            .find('h1:visible, h2:visible, h3:visible, p:visible, div:visible')
            .its('length')
            .should('be.greaterThan', 5);
    }
}

export default AboutUsList;
