import firstpagemanage from './firstpagemanage';


class Invitelist extends firstpagemanage{
    goToChildListPage() {
        this.clickInviteButton();
        this.verifyInvitePageLoaded();
    }

    verifyInvitePageLoaded(){
        cy.contains('button:visible', ' 篩選器 ').should('be.visible');
        cy.get('Input[placeholder="搜尋"]').should('be.visible');
        cy.get('input[placeholder="搜尋"]').invoke('attr', 'placeholder').should('eq', '搜尋');
        cy.contains('button:visible', '產生邀請連結').should('be.visible');

        cy.contains('th:visible', '帳號編號').should('be.visible');
        cy.contains('th:visible', '帳號名稱').should('be.visible');
        cy.contains('th:visible', '角色').should('be.visible');
        cy.contains('th:visible', '備註').should('be.visible');
        cy.contains('th:visible', '動作').should('be.visible');
    }

    // 排序方式: 由新到舊、由舊到新 / 屬性: 不選、操作人員、機構、局處、管理者、家長
    clickFilterButton(detail1, detail2){
        const dialogSelector = 'div[role="dialog"][data-state="open"]';
        cy.contains('button:visible', '篩選器').should('be.visible').click();
        cy.get(dialogSelector).should('be.visible').within(() => {
            cy.contains('h2:visible', '篩選器').should('be.visible');
        });
        this.selectFilterDropdown('排序方式', detail1);
        this.selectFilterDropdown('屬性', detail2);
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

    escapeRegExp(text) {
        return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    normalizeComparableText(text) {
        return String(text ?? '').replace(/\s+/g, '').trim();
    }

    findDialogFieldLabel($dialogEl, label) {
        const labelPattern = new RegExp(`^\\s*${this.escapeRegExp(label)}\\s*$`);

        return $dialogEl.find('label:visible,span:visible,p:visible,div:visible')
            .filter((_, el) => labelPattern.test(Cypress.$(el).text()))
            .first();
    }

    findFieldControl($dialogEl, $labelEl, selector, orderedFieldLabels = []) {
        let $control = Cypress.$();
        let $cursor = $labelEl;

        while ($cursor.length && !$cursor.is($dialogEl) && !$cursor.is('body')) {
            $control = $cursor.find(selector).filter(':visible').first();
            if ($control.length) {
                break;
            }

            $control = $cursor.siblings().find(selector).filter(':visible').first();
            if ($control.length) {
                break;
            }

            $cursor = $cursor.parent();
        }

        if (!$control.length && orderedFieldLabels.length > 0) {
            const $orderedLabels = $dialogEl.find('label:visible,span:visible,p:visible,div:visible')
                .filter((_, el) => orderedFieldLabels.includes(Cypress.$(el).text().trim()));
            const labelText = $labelEl.text().trim();
            const labelIndex = $orderedLabels.toArray().findIndex((el) => Cypress.$(el).text().trim() === labelText);
            const $allControls = $dialogEl.find(selector).filter(':visible');

            if (labelIndex >= 0 && labelIndex < $allControls.length) {
                $control = $allControls.eq(labelIndex);
            }
        }

        return $control;
    }

    setDialogInputValue(label, value){
        const dialogSelector = 'div[role="dialog"][data-state="open"]';
        const normalizedValue = String(value ?? '').trim();
        const inputValue = normalizedValue.replace(/\D/g, '') || normalizedValue;

        cy.get(dialogSelector).filter(':visible').last().should('be.visible').then(($dialog) => {
            const $dialogEl = Cypress.$($dialog);
            const $labelEl = this.findDialogFieldLabel($dialogEl, label);

            expect($labelEl.length, `label "${label}"`).to.be.greaterThan(0);

            const $input = this.findFieldControl(
                $dialogEl,
                $labelEl,
                'input:visible:not([type="hidden"]):not([readonly]), textarea:visible:not([readonly])',
                ['有效期限', '最大使用數量', '身份角色選項']
            );

            expect($input.length, `input for label "${label}"`).to.be.greaterThan(0);

            cy.wrap($input.first())
                .click({ force: true })
                .clear({ force: true })
                .type(inputValue, { force: true });
        });
    }

    selectFilterDropdown(label, value){
        const dialogSelector = 'div[role="dialog"][data-state="open"]';
        const valueText = String(value).trim();
        const triggerSelector = '[role="combobox"], button[aria-haspopup="listbox"], [data-slot="select-trigger"], [id^="reka-select-trigger-"]';
        const openPanelSelector = '[id^="reka-select-content-"][data-state="open"], [role="listbox"][data-state="open"], [id^="reka-select-content-"]:visible, [role="listbox"]:visible';

        cy.get(dialogSelector).filter(':visible').last().should('be.visible').then(($dialog) => {
            const $dialogEl = Cypress.$($dialog);
            const fieldLabels = ['排序方式', '屬性', '有效期限', '最大使用數量', '身份角色選項'];
            const $labelEl = this.findDialogFieldLabel($dialogEl, label);

            expect($labelEl.length, `label "${label}"`).to.be.greaterThan(0);

            const $trigger = this.findFieldControl($dialogEl, $labelEl, triggerSelector, fieldLabels);

            expect($trigger.length, `select trigger for label "${label}"`).to.be.greaterThan(0);
            cy.wrap($trigger.first()).click({ force: true });
        });

        cy.get(openPanelSelector).filter(':visible').last().should('be.visible').then(($panel) => {
            const normalizedTarget = this.normalizeComparableText(valueText);
            const $option = Cypress.$($panel)
                .find('[role="option"], [data-radix-collection-item], [data-value], li, button, div, span')
                .filter((_, el) => this.normalizeComparableText(Cypress.$(el).text()) === normalizedTarget)
                .first();

            expect($option.length, `option "${valueText}"`).to.be.greaterThan(0);
            cy.wrap($option).scrollIntoView().click({ force: true });
        });
    }

    NumberPageInviteManageMent(page){
        cy.get(`button[data-type="page"][value="${page}"]`).should('be.visible').click();
    }

    SelectDropdownInviteManage(page){
        const triggerSelector = '[role="combobox"], button[aria-haspopup="listbox"], [data-slot="select-trigger"], [id^="reka-select-trigger-"]';
        const openPanelSelector = '[id^="reka-select-content-"][data-state="open"], [role="listbox"][data-state="open"], [id^="reka-select-content-"]:visible, [role="listbox"]:visible';
        const pageText = String(page).trim();

        cy.contains('span:visible', '每頁顯示').parent().find(triggerSelector).first().should('be.visible').click({ force: true });
        cy.get(openPanelSelector).filter(':visible').last().should('be.visible').within(() => {
            cy.contains(new RegExp(`^\\s*${this.escapeRegExp(pageText)}\\s*$`)).should('be.visible').click({ force: true });
        });
    }

    clickIniteLinkShareButton(detail1, detail2, detail3){
        const dialogSelector = 'div[role="dialog"][data-state="open"]';
        cy.contains('button:visible', '產生邀請連結').should('be.visible').click();
        cy.get(dialogSelector).should('be.visible').within(() => {
            cy.contains('h2:visible', '產生邀請連結').should('be.visible');
        });
        // 有效期限: 1天、7天、30天；永不 / 最大使用數量: 1次、5次、10次、20次、沒有限制  / 身分角色選項: 管理者、局處、機構、操作人員、家長
        this.selectFilterDropdown('有效期限', detail1);
        this.setDialogInputValue('最大使用數量', detail2);
        this.selectFilterDropdown('身份角色選項', detail3);

        cy.contains('button', ' 產生 ').should('exist').click();
    }

    clickCopyInviteLinkButton(){
        cy.get('div[role="dialog"][data-state="open"]').last().within(() => {
            cy.contains('button:visible', /^\s*複製連結\s*$/)
                .should('be.visible')
                .click({ force: true });
        });
    }
}

export default Invitelist;
