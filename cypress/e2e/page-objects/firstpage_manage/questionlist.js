import firstpagemanage from './firstpagemanage';

class questionlist extends firstpagemanage{
     goToChildListPage() {
        this.clickQuestionButton();
        this.verifyQuestionPageLoaded();
    }

    verifyQuestionPageLoaded(){
        cy.contains('button:visible', ' 篩選器 ').should('be.visible');
        cy.contains('button:visible', '+ 新增題目').should('be.visible');
        cy.contains('button:visible', '觀察題組').should('be.visible');
        cy.contains('button:visible', '圖卡識別').should('be.visible');
        cy.contains('button:visible', '圖卡配對').should('be.visible');
        cy.contains('button:visible', 'AI題組').should('be.visible');

    }

    selectFilterDropdown(label, value){
        const dialogSelector = 'div[role="dialog"][data-state="open"]';
        const valueText = String(value).trim();

        cy.get(dialogSelector).contains('label:visible', label).parent().find('button[role="combobox"]').first().should('be.visible').click({ force: true });
        cy.get('[id^="reka-select-content-"]:visible').contains(valueText).scrollIntoView().should('be.visible').click({ force: true });
        this.closeSelectPanelIfNeeded();
    }

    closeSelectPanelIfNeeded() {
        const openSelectSelector = '[id^="reka-select-content-"][data-state="open"]';
        const dialogSelector = 'div[role="dialog"][data-state="open"]';

        cy.get('body').then(($body) => {
            if ($body.find(openSelectSelector).length > 0) {
                // 選單不自動收合時，手動收合，避免遮住「套用」按鈕
                cy.get('body').type('{esc}', { force: true });
                cy.get(dialogSelector).click(10, 10, { force: true });
            }
        });
    }

    clickDeletefitlerDetail(){
        cy.contains('button', ' 清空條件 ').click();
    }

    clickCheckQuestionfilter(detail1, detail2, detail3){
        const dialogSelector = 'div[role="dialog"][data-state="open"]';
        cy.contains('button:visible', '篩選器').should('be.visible').click();
        cy.get(dialogSelector).should('be.visible').within(() => {
            cy.contains('h2:visible', '篩選器').should('be.visible');
        });
        this.selectFilterDropdown('面相', detail1);
        this.selectFilterDropdown('警示題目', detail2);
        this.selectFilterDropdown('施測年齡（月）', detail3);
    }

    clickfilterConfirmButton(type){
        this.closeSelectPanelIfNeeded();

        switch(type){
            case 'yes':
                cy.contains('div[role="dialog"][data-state="open"] button:visible', '套用').should('be.visible').should(($btn) => {
                    const isAriaDisabled = $btn.attr('aria-disabled') === 'true';
                    const isDisabled = $btn.is(':disabled');
                    expect(isAriaDisabled || isDisabled, '套用按鈕應可點擊').to.eq(false);
                }).click({ force: true });
                cy.wait(5000);
                break;
            case 'no':
                cy.contains('div[role="dialog"][data-state="open"] button:visible', '取消').should('be.visible').click({ force: true });
                cy.wait(5000);
                break;
        }
    }

    clickQuestionPageSelect(type){
        switch(type){
            case '觀察題組':
                cy.contains('button', '觀察題組').click();
                cy.wait(2000);
                break;
            case '圖卡識別':
                cy.contains('button', '圖卡識別').click();
                cy.wait(2000);
                break;
            case '圖卡配對':
                cy.contains('button', '圖卡配對').click();
                cy.wait(2000);
                break;
            case 'AI題組':
                cy.contains('button', 'AI題組').click();
                cy.wait(2000);
                break;
        }
    }


}

export default questionlist;
