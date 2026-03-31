class firstpagemanage {
    constructor() {
        this.pageURL = '/login';
    }

    goToLoginPage() {
        cy.visit(this.pageURL);
    }

    clickTopNavItem(label, path) {
        const openMenuSelector = '[role="dialog"][id^="reka-popover-content-"][data-state="open"]';
        cy.get('body').then(($body) => {
            if ($body.find(openMenuSelector).length > 0) {
                cy.get('body').type('{esc}', { force: true });
            }
        });

        cy.get(`header nav a[href="${path}"]`).filter(':visible').first().should('contain.text', label)
        .scrollIntoView().click({ force: true });

        cy.location('pathname', { timeout: 10000 }).should('include', path);
    }

    clickOtherPageItem(type){
        const itemText = String(type).trim();
        const triggerSelector = 'div[id^="reka-popover-trigger-"][type="button"]';

        cy.get(triggerSelector).filter(':visible').then(($triggers) => {
            const $expanded = Cypress.$($triggers).filter('[aria-expanded="true"]').first();
            if ($expanded.length) {
                cy.wrap($expanded).as('profileTrigger');
                return;
            }

            const $collapsed = Cypress.$($triggers).filter('[aria-expanded="false"]').first();
            const $target = $collapsed.length ? $collapsed : Cypress.$($triggers).last();
            cy.wrap($target).as('profileTrigger');
        });

        cy.get('@profileTrigger').then(($trigger) => {
            if ($trigger.attr('aria-expanded') !== 'true') {
                cy.wrap($trigger).click({ force: true });
            }
        });

        cy.get('@profileTrigger').then(($trigger) => {
            const contentId = $trigger.attr('aria-controls');
            const contentSelector = contentId
                ? `#${contentId}`
                : '[id^="reka-popover-content-"][data-state="open"], [id^="reka-popover-content-"]:visible';

            cy.get(contentSelector, { timeout: 10000 }).filter(':visible').last().should('be.visible').within(() => {
                cy.contains('button:visible, [role="menuitem"]:visible, a:visible, span:visible', itemText)
                    .should('be.visible')
                    .then(($el) => {
                        const $clickable = $el.closest('button,a,[role="menuitem"],div');
                        cy.wrap($clickable.length ? $clickable.first() : $el).click({ force: true });
                    });
            });
        });
    }

    clickDashboardButton() {
        this.clickTopNavItem('儀錶板', '/admin/dashboard');
    }

    clickChildtable() {
        this.clickTopNavItem('孩童列表', '/admin/child-list');
    }

    clickQuestionButton() {
        this.clickTopNavItem('題目管理', '/admin/question');
    }

    clickInviteButton() {
        this.clickTopNavItem('邀請管理', '/admin/invite');
    }

    clickAboutWeButton() {
        this.clickTopNavItem('關於我們', '/admin/about');
    }
}

export default firstpagemanage;
