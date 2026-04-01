function verifychildlistMessage() {
    cy.contains('div:visible,h1:visible,h2:visible,span:visible', '孩童列表').should('exist');
    cy.get('table:visible').should('exist');
    cy.get('table thead th:visible').its('length').should('be.gte', 5);
}

function verifychildInfoMessage(title, result) {
    cy.contains('div,label,span', title)
        .should('be.visible')
        .parent()
        .invoke('text')
        .then((txt) => {
            expect(txt.trim()).to.include(String(result));
        });
}

function verifychildlistfilterMessage(city, state, result) {
    cy.contains('h2:visible', '篩選器').should('be.visible');
    cy.contains('label:visible,span:visible,div:visible', '孩童居住地').should('exist');
    cy.contains('span:visible,div:visible,button:visible', city).should('be.visible');
    cy.contains('span:visible,div:visible,button:visible', state).should('be.visible');
    cy.contains('span:visible,div:visible,button:visible', result).should('be.visible');
}

function verifyRowViewButtonMessage() {
    cy.contains('div:visible,h1:visible,h2:visible,h3:visible,span:visible', '檢測歷史紀錄').should('exist');
    cy.contains('button:visible,span:visible', '孩童資料').should('be.visible');
    cy.contains('button:visible,span:visible', '發展結果與建議').should('be.visible');
    cy.get('table:visible').should('exist');
    cy.get('table thead th:visible').its('length').should('be.gte', 3);
}

function verifyCheckResultButtonMessage() {
    cy.contains('div:visible,h1:visible,h2:visible,span:visible', '檢測結果').should('exist');
    cy.contains('h2:visible', '最新檢測結果').should('exist');
    cy.contains('h3:visible', '衛教建議').should('exist');

    cy.get('body').then(($body) => {
        const hasConsultSection = $body.find('h3:contains("諮詢醫療院所")').length > 0;
        const hasSeekMapButton =
            $body.find('button:contains("查看就醫地圖"), a:contains("查看就醫地圖"), span:contains("查看就醫地圖")').length > 0;

        if (hasConsultSection) {
            cy.contains('h3:visible', '諮詢醫療院所').closest('div').should('exist');
            return;
        }

        if (hasSeekMapButton) {
            cy.contains('button:visible, a:visible, span:visible', '查看就醫地圖').should('be.visible');
            return;
        }

        cy.log('醫療院所/就醫地圖區塊未顯示，略過附加驗證');
    });
}

function verifyUpdatePage() {
    cy.intercept('GET', '**/cskapi/api/child/*').as('GetChildAPI');
}

function verifyRequestUpdatePage() {
    cy.wait('@GetChildAPI').then(({ response }) => {
        expect(response.body.msg).to.include('OK');
        expect(response.body.code).to.eq(200);
        expect(response.body.success).to.eq(true);
    });
}

function verifyDeleteChildInfo(Addresscode, name, time, assertType = 'exist') {
    const codeText = String(Addresscode);

    if (assertType === 'not.exist') {
        cy.contains('body', codeText, { matchCase: false }).should('not.exist');
        return;
    }

    cy.contains('body', codeText, { matchCase: false, timeout: 10000 })
        .should('exist')
        .closest('div.group.cursor-pointer, div[class*="cursor-pointer"]')
        .should('exist')
        .scrollIntoView()
        .within(() => {
            cy.contains(codeText, { matchCase: false }).should('exist');
            if (name) {
                cy.contains(String(name)).should('exist');
            }
            if (time) {
                cy.contains(String(time)).should('exist');
            }
        });
}

export {
    verifychildlistMessage,
    verifychildInfoMessage,
    verifychildlistfilterMessage,
    verifyRowViewButtonMessage,
    verifyCheckResultButtonMessage,
    verifyUpdatePage,
    verifyRequestUpdatePage,
    verifyDeleteChildInfo
};
