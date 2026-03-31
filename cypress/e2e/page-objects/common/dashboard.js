class DashboardPageObject {
  openUserMenu() {
    const openMenuSelector = '[role="dialog"][id^="reka-popover-content-"][data-state="open"]';

    return cy.get('body').then(($body) => {
      if ($body.find(openMenuSelector).length === 0) {
        cy.get('[id^="reka-popover-trigger-"][aria-haspopup="dialog"] img')
          .first()
          .should('be.visible')
          .click();
      }
    }).then(() => {
      return cy.get(openMenuSelector).as('userMenu').should('be.visible');
    });
  }

  Elementsarevisble() {
    this.openUserMenu();

    cy.get('@userMenu').within(() => {
      cy.contains('個人資料').should('be.visible');
      cy.contains('前往前台').should('be.visible');
      cy.contains('系統設定').should('be.visible');
      cy.contains('登出').should('be.visible');
    });

    cy.get('main').should('be.visible');
    cy.get('main[class*="pb-7"]').should('be.visible');
  }

  GetUserName() {
    return this.openUserMenu().find('.bg-primary-200 .text-secondary-700').first();
  }
}

export default DashboardPageObject;