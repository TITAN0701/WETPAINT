import firstpagemanage from './firstpagemanage';

class Invitelist extends firstpagemanage {
    goToChildListPage() {
        this.clickInviteButton();
        this.verifyInvitePageLoaded();
    }

    verifyInvitePageLoaded() {
        cy.contains('button:visible', '連結紀錄').should('be.visible');
        cy.contains('button:visible', '產生邀請連結').should('be.visible');
        cy.get('input[placeholder="搜尋"]').should('be.visible');

        cy.contains('th:visible', '帳號編號').should('be.visible');
        cy.contains('th:visible', '帳號名稱').should('be.visible');
        cy.contains('th:visible', '角色').should('be.visible');
        cy.contains('th:visible', '來源').should('be.visible');
        cy.contains('th:visible', '動作').should('be.visible');
    }

    escapeRegExp(text) {
        return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    selectInlineDropdownByIndex(index, value) {
        const valueText = String(value).trim();
        const openPanelSelector = '[id^="reka-select-content-"][data-state="open"], [id^="reka-select-content-"]:visible, [role="listbox"]:visible';

        cy.get('main [role="combobox"]:visible')
            .eq(index)
            .should('be.visible')
            .click({ force: true });

        cy.get(openPanelSelector)
            .filter(':visible')
            .last()
            .contains(new RegExp(`^\\s*${this.escapeRegExp(valueText)}\\s*$`))
            .scrollIntoView()
            .click({ force: true });
    }

    clickFilterButton(sortOrder, source) {
        if (sortOrder) {
            this.selectInlineDropdownByIndex(0, sortOrder);
        }

        if (source) {
            this.selectInlineDropdownByIndex(1, source);
        }
    }

    clickfilterConfirm() {
        cy.wait(500);
    }

    searchInviteAccountCode(accountCode) {
        const codeText = String(accountCode).trim();

        cy.get('input[placeholder="搜尋"]')
            .should('be.visible')
            .click({ force: true })
            .should('be.focused')
            .clear({ force: true })
            .type(codeText, { force: true })
            .trigger('input')
            .trigger('change')
            .trigger('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13 })
            .trigger('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13 })
            .trigger('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13 });

        cy.wait(800);
    }

    searchRandomKnownAccountCode(alias = 'inviteSearchCode') {
        return cy.get('table tbody tr:visible').then(($rows) => {
            const codes = Cypress.$($rows)
                .map((_, row) => Cypress.$(row).find('td').eq(0).text().trim())
                .get()
                .filter(Boolean);

            expect(codes.length, 'visible invite account codes').to.be.greaterThan(0);

            const pickedCode = Cypress._.sample(codes);
            return cy.wrap(pickedCode, { log: false })
                .as(alias)
                .then(() => {
                    cy.log(`Invite search code: ${pickedCode}`);
                })
                .then(() => {
                    this.searchInviteAccountCode(pickedCode);
                })
                .then(() => pickedCode);
        });
    }

    NumberPageInviteManageMent(page) {
        cy.get(`button[data-type="page"][value="${page}"]`)
            .should('be.visible')
            .click({ force: true });
    }

    SelectDropdownInviteManage(page) {
        const valueText = String(page).trim();
        const openPanelSelector = '[id^="reka-select-content-"][data-state="open"], [id^="reka-select-content-"]:visible, [role="listbox"]:visible';

        cy.contains('span:visible', '每頁顯示')
            .parent()
            .find('[role="combobox"]:visible')
            .first()
            .should('be.visible')
            .click({ force: true });

        cy.get(openPanelSelector)
            .filter(':visible')
            .last()
            .contains(new RegExp(`^\\s*${this.escapeRegExp(valueText)}\\s*$`))
            .scrollIntoView()
            .click({ force: true });
    }

    clickIniteLinkShareButton(detail1, detail2, detail3) {
        const dialogSelector = 'div[role="dialog"][data-state="open"]';

        cy.contains('button:visible', '產生邀請連結').should('be.visible').click({ force: true });
        cy.get(dialogSelector).filter(':visible').last().within(() => {
            cy.contains('h2:visible', '產生邀請連結').should('be.visible');
        });

        if (detail1) {
            cy.get(dialogSelector).filter(':visible').last().find('[role="combobox"]:visible').eq(0).click({ force: true });
            cy.get('[id^="reka-select-content-"]:visible').last().contains(detail1).click({ force: true });
        }

        if (detail2) {
            cy.get(dialogSelector).filter(':visible').last().find('input:visible').first().clear({ force: true }).type(String(detail2).replace(/\D/g, ''), { force: true });
        }

        if (detail3) {
            cy.get(dialogSelector).filter(':visible').last().find('[role="combobox"]:visible').eq(1).click({ force: true });
            cy.get('[id^="reka-select-content-"]:visible').last().contains(detail3).click({ force: true });
        }

        cy.get(dialogSelector).filter(':visible').last().contains('button:visible', '產生').click({ force: true });
    }

    clickCopyInviteLinkButton() {
        cy.get('div[role="dialog"][data-state="open"]').last().within(() => {
            cy.contains('button:visible', /^\s*複製連結\s*$/).should('be.visible').click({ force: true });
        });
    }
}

export default Invitelist;
