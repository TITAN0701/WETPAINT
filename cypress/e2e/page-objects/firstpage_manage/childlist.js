import firstpagemanage from './firstpagemanage';

class childlist extends firstpagemanage {
    goToChildListPage() {
        this.clickChildtable();
        this.verifyChildListPageLoaded();
    }

    verifyChildListPageLoaded() {
        cy.contains('div:visible', '孩童列表').should('be.visible');
        cy.contains('button:visible', ' 篩選器 ').should('be.visible');
    }

    verifyChildListColumns() {
        const columns = ['孩童姓名', '身分證字號', '性別', '年齡', '地區', '上次測驗日期', '結果', '動作'];

        columns.forEach((column) => {
            cy.contains('th:visible,div:visible,span:visible,p:visible', column).should('exist');
        });
    }

    clickFilterButton(city, state, result) {
        cy.contains('button:visible', '篩選器').should('be.visible').click();
        cy.contains('h2:visible', '篩選器').should('be.visible');
        cy.contains('label:visible', '孩童居住地').should('be.visible');
        // 縣市
        cy.contains('label:visible', '孩童居住地').next('div').find('button[role="combobox"]').eq(0).should('be.visible').click();
        cy.get('[id^="reka-select-content-"]:visible').contains(city).click();

        // 區域
        cy.contains('label:visible', '孩童居住地').next('div').find('button[role="combobox"]').eq(1).should('be.visible').click();
        cy.get('[id^="reka-select-content-"]:visible').contains(state).click();

        // 測驗結果
        cy.contains('label:visible', '測驗結果').next('button[role="combobox"]').should('be.visible').click();
        cy.get('[id^="reka-select-content-"]:visible').contains(result).click();
    }

    clickfilterConfirm(outtype){
        switch(outtype){
            case 'yes':
                cy.contains('button', ' 套用 ').click();
                break;
            case 'no':
                cy.contains('button', ' 取消 ').click();
                break;
        }
    }

    clickFirstRowViewButton(index) {
        cy.get('table tbody tr:visible').eq(index).find('td').last().find('button:visible').first().click();
    }

    clickCheckResultButton(index){
        cy.get('span:visible').filter((_, el) => el.innerText.includes('檢測結果建議')).eq(index).should('be.visible').then(($span) => {
            const $clickable = $span.closest('button,a,[role="button"]');
                if ($clickable.length > 0) {
                    cy.wrap($clickable).click();
                } else {
                    cy.wrap($span).click({ force: true });
                }
            });
    }

    clickChildlistReturnButton(){
        cy.contains('span:visible', '返回').click();
    }

    clickChildInfoButton(){
        cy.contains('button:visible', /^孩童資料$/, { timeout: 10000 })
            .should('be.visible')
            .then(($button) => {
                const $tab = Cypress.$($button);

                if (!$tab.hasClass('bg-secondary-200')) {
                    cy.wrap($button).click({ force: true });
                }

                cy.wrap($button).should('have.class', 'bg-secondary-200');
            });
    }

    clickChildSuggestButton(){
        cy.contains('button', '發展結果與建議').should('exist').click();
    }

    clickFirstRowDeleteButton(target, type) {
        let rowChain;

        if (typeof target === 'number') {
            rowChain = cy.get('table tbody tr:visible').eq(target);
        } else if (target) {
            rowChain = cy.contains('table tbody tr:visible', String(target), { matchCase: false });
        } else {
            rowChain = cy.get('table tbody tr:visible').first();
        }

        rowChain.should('be.visible').find('td').last().find('button:visible').last().click();
        switch (type) {
            case 'yes':
                cy.contains('button', /^\s*確認\s*$/).click();
                break;
            case 'no':
                cy.contains('button', /^\s*取消\s*$/).click();
                break;
            default:
                break;
        }
    }

    //切換前台或後台
    clickBackendButton(downlist){
        //個人資料、前往前台、系統設定、登出、通知管理
        cy.get('img[alt="管理者"]').should('be.visible').click();
        cy.contains('span:visible', downlist).should('be.visible').click();
    }
}

export default childlist;
