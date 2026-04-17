import firstpagemanage from './firstpagemanage';

class questionlist extends firstpagemanage {
    goToChildListPage() {
        this.clickQuestionButton();
        this.verifyQuestionPageLoaded();
    }

    verifyQuestionPageLoaded() {
        cy.contains('div:visible,h1:visible,h2:visible,span:visible', '觀察題組').should('be.visible');
        cy.contains('button:visible', '搜尋').should('be.visible');
        cy.contains('button:visible', '篩選器').should('be.visible');
        cy.contains('button:visible', '+ 新增題目').should('be.visible');
        cy.contains('button:visible', '選擇題').should('be.visible');
        cy.contains('button:visible', '圖卡辨識').should('be.visible');
        cy.contains('button:visible', '圖卡配對').should('be.visible');
        cy.contains('button:visible', 'AI題組').should('be.visible');
    }

    selectFilterDropdown(label, value) {
        const dialogSelector = 'div[role="dialog"][data-state="open"]';
        const valueText = String(value).trim();

        cy.get(dialogSelector)
            .contains('label:visible', label)
            .parent()
            .find('button[role="combobox"]')
            .first()
            .should('be.visible')
            .click({ force: true });

        cy.get('[id^="reka-select-content-"]:visible')
            .contains(valueText)
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

        this.closeSelectPanelIfNeeded();
    }

    closeSelectPanelIfNeeded() {
        const openSelectSelector = '[id^="reka-select-content-"][data-state="open"]';
        const dialogSelector = 'div[role="dialog"][data-state="open"]';

        cy.get('body').then(($body) => {
            if ($body.find(openSelectSelector).length > 0) {
                cy.get('body').type('{esc}', { force: true });
                cy.get(dialogSelector).click(10, 10, { force: true });
            }
        });
    }

    clickDeletefitlerDetail() {
        cy.contains('button:visible', /清空條件|刪除條件|移除條件/)
            .first()
            .click({ force: true });
    }

    clickCheckQuestionfilter(aspect, warning, age) {
        const dialogSelector = 'div[role="dialog"][data-state="open"]';

        cy.contains('button:visible', '篩選器').should('be.visible').click({ force: true });
        cy.get(dialogSelector).should('be.visible').within(() => {
            cy.contains('h2:visible', '篩選器').should('be.visible');
        });

        this.selectFilterDropdown('面相', aspect);
        this.selectFilterDropdown('警示題', warning);
        this.selectFilterDropdown('施測年齡（月）', age);
    }

    clickfilterConfirmButton(type) {
        this.closeSelectPanelIfNeeded();

        switch (type) {
            case 'yes':
                cy.contains('div[role="dialog"][data-state="open"] button:visible', '套用')
                    .should('be.visible')
                    .click({ force: true });
                break;
            case 'no':
                cy.contains('div[role="dialog"][data-state="open"] button:visible', '取消')
                    .should('be.visible')
                    .click({ force: true });
                break;
            default:
                break;
        }
    }

    clickQuestionPageSelect(type) {
        cy.contains('button:visible', String(type))
            .should('be.visible')
            .click({ force: true });
    }
}

export default questionlist;
