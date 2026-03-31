const FAQ_TITLE = '常見問題';
const CONTACT_BUTTON = '聯絡我們';
const FAQ_QUESTION_1 = '我的孩子可以加入研究案嗎?';
const FAQ_QUESTION_2 = '我的孩子參加研究，會如何進行評估施測呢? 會有侵入性治療嗎?';

function getFaqTriggers() {
    return cy.get('[id^="reka-accordion-trigger-"]:visible, button[aria-controls]:visible');
}

function getContactButton() {
    return cy.contains('button:visible, a:visible', CONTACT_BUTTON);
}

function verifyFQAMessage() {
    cy.location('pathname', { timeout: 10000 }).should('include', '/faqs');
    cy.contains('div:visible, h1:visible, h2:visible, span:visible', FAQ_TITLE).should('exist');
    getContactButton().should('be.visible');
    cy.contains('button:visible, span:visible', FAQ_QUESTION_1).should('be.visible');
    cy.contains('button:visible, span:visible', FAQ_QUESTION_2).should('be.visible');

    getFaqTriggers().its('length').should('be.gte', 3);
}

function verifyAccordionCanTrigger(index, questionText, answerKeywords = []) {
    getFaqTriggers().eq(index).as('faqTrigger');

    cy.get('@faqTrigger')
        .should('be.visible')
        .and('contain.text', questionText)
        .click({ force: true });

    cy.get('@faqTrigger').should(($trigger) => {
        const isExpanded = $trigger.attr('aria-expanded') === 'true';
        const isOpen = $trigger.attr('data-state') === 'open';
        expect(isExpanded || isOpen, `accordion[${index}] opened`).to.eq(true);
    });

    cy.get('@faqTrigger').invoke('attr', 'aria-controls').then((contentId) => {
        if (contentId) {
            cy.get(`#${contentId}`).should('be.visible').within(() => {
                answerKeywords.forEach((keyword) => {
                    cy.contains(String(keyword)).should('exist');
                });
            });
        }
    });
}

function verifyContactButtonCanTrigger() {
    cy.window().then((win) => {
        cy.stub(win, 'open').as('contactWindowOpen');
    });

    cy.location('href').then((beforeHref) => {
        getContactButton()
            .should('be.visible')
            .and(($button) => {
                expect($button.is(':disabled'), 'contact button disabled').to.eq(false);
            })
            .then(($button) => {
                const beforeExpanded = String($button.attr('aria-expanded') || '');
                const beforeState = String($button.attr('data-state') || '');
                const beforeDialogs = Cypress.$('[role="dialog"]:visible, [id^="reka-dialog-content-"]:visible').length;

                cy.wrap($button).click({ force: true });

                cy.location('href').then((afterHref) => {
                    cy.get('@contactWindowOpen').then((openStub) => {
                        const $freshButton = Cypress.$('button:visible, a:visible')
                            .filter((_, el) => (el.innerText || '').includes(CONTACT_BUTTON))
                            .first();
                        const afterExpanded = String($freshButton.attr('aria-expanded') || '');
                        const afterState = String($freshButton.attr('data-state') || '');
                        const afterDialogs = Cypress.$('[role="dialog"]:visible, [id^="reka-dialog-content-"]:visible').length;

                        const triggered =
                            afterHref !== beforeHref
                            || openStub.callCount > 0
                            || afterDialogs > beforeDialogs
                            || afterExpanded !== beforeExpanded
                            || afterState !== beforeState;

                        expect(
                            triggered,
                            'contact button should trigger navigation, window open, dialog open, or state change'
                        ).to.eq(true);
                    });
                });
            });
    });
}

export {
    verifyFQAMessage,
    verifyAccordionCanTrigger,
    verifyContactButtonCanTrigger,
};
