import FirstPageList from './firstpagelist';

class MobileFirstPageList extends FirstPageList {
    getphonechildfileButton(){
        return cy.get('div.fixed.bottom-0.left-0.right-0.cursor-pointer').filter(':visible').first();
    }

    getphoneChildDrawer() {
        return cy.get('div.fixed.right-0.bottom-0.left-0.z-50.bg-white').filter(':visible').first();
    }

    getphoneChildList() {
        return this.getphoneChildDrawer().find('div.overflow-y-auto').first();
    }

    findPhoneChildfileInScrollableList(name, attempt = 0) {
        const maxAttempts = 6;
        const targetName = String(name).trim();

        return this.getphoneChildList().then(($list) => {
            const $target = Cypress.$($list).find('span').filter((_, element) => Cypress.$(element).text().trim() === targetName).first();

            if ($target.length) {
                return cy.wrap($target).scrollIntoView().should('be.visible').closest('div.cursor-pointer').should('be.visible');
            }

            if (attempt >= maxAttempts) {
                throw new Error(`Phone child list item not found: ${targetName}`);
            }

            return this.getphoneChildList().then(($scrollableList) => {
                const listElement = $scrollableList[0];
                const nextScrollTop = listElement.scrollTop + Math.max(listElement.clientHeight * 0.8, 120);

                return cy.wrap($scrollableList).scrollTo(0, nextScrollTop, { ensureScrollable: false, duration: 200 }).wait(200)
                    .then(() => this.findPhoneChildfileInScrollableList(targetName, attempt + 1));
            });
        });
    }

    getphoneChildfileName(name){
        return this.findPhoneChildfileInScrollableList(name);
    }

    getphoneDevelopChildName(name){
        return this.getdevelopmentPanel().contains('span', String(name).trim()).should('be.visible');
    }

    clickPhoneChildfileButton(name){
        this.getphonechildfileButton().should('be.visible').click();
        this.getphoneChildDrawer().should('be.visible');
        this.getphoneChildfileName(name).click({ force: true });
        cy.get('body').should('not.have.css', 'pointer-events', 'none');
    }

    clickphonedevelopmentButton(type){
        this.getdevelopmentPanel(type).click();
    }

    runMobilePendingTestModeFlows(flowActions = [], option1 = 'start') {
        return super.runPendingTestModeFlows(flowActions, option1);
    }

    runMobileChoiceQuestions(questionCountOrAnswers = 1, defaultAnswer = 'yes', tutorialAction = 'skip') {
        return super.answerChoiceQuestions(questionCountOrAnswers, defaultAnswer, tutorialAction);
    }
}

export default MobileFirstPageList;
