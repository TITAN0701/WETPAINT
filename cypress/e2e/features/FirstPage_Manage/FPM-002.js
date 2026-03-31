
function verifychildlistMessage(){
    cy.contains('div:visible','孩童列表').should('exist');
    cy.get('div.overflow-auto').should('be.visible').within(() => {
        cy.contains('th:visible', '孩童姓名').should('be.visible');
        cy.contains('th:visible', '身分證字號').should('be.visible');
        cy.contains('th:visible', '性別').should('be.visible');
        cy.contains('span:visible', '年齡').should('be.visible');
        cy.contains('th:visible', '地區').should('be.visible');
        cy.contains('th:visible', '上次測驗日期').should('be.visible');
        cy.contains('th:visible', '結果').should('be.visible');
        cy.contains('th:visible', '動作').should('be.visible');

    })
}

function verifychildInfoMessage(title, result){
   cy.contains('div.mb-2.text-sm.text-gray-500', title).should('be.visible').next('div').invoke('text')
   .then((txt) =>{
    const content = txt.trim();
    expect(content).to.include(String(result));

   })
}


function verifychildlistfilterMessage(city, state, result){
    cy.contains('h2:visible', '篩選器').should('be.visible');
    cy.contains('label:visible', '孩童居住地').should('be.visible');
    cy.contains('span:visible', city).should('be.visible');
    cy.contains('span:visible', state).should('be.visible');
    cy.contains('span:visible', result).should('be.visible');
}

function verifyRowViewButtonMessage(){
    cy.contains('div', '歷史紀錄').should('be.visible');
    cy.contains('div', '檢測歷史紀錄').should('be.visible');

    cy.contains('th:visible', '測驗日期').closest('div.overflow-auto').scrollIntoView().should('exist');
    cy.contains('th:visible', '生理(矯正)年齡').closest('div.overflow-auto').scrollIntoView().should('exist');
    cy.contains('th:visible', '粗大動作').closest('div.overflow-auto').scrollIntoView().should('exist');
    cy.contains('th:visible', '精細動作').closest('div.overflow-auto').scrollIntoView().should('exist');
    cy.contains('th:visible', '社會情緒').closest('div.overflow-auto').scrollIntoView().should('exist');
    cy.contains('th:visible', '語言理解').closest('div.overflow-auto').scrollIntoView().should('exist');
    cy.contains('th:visible', '語言表達').closest('div.overflow-auto').scrollIntoView().should('exist');
    cy.contains('th:visible', '認知').closest('div.overflow-auto').scrollIntoView().should('exist');
    cy.contains('th:visible', '建議事項').closest('div.overflow-auto').scrollIntoView().should('exist');

}

function verifyCheckResultButtonMessage(){
    cy.contains('div', '檢測結果').closest('div.items-center').should('exist');
    cy.contains('h2:visible', '最新檢測結果').closest('div.items-stretch').should('exist');
    cy.contains('h3:visible', '衛教建議').closest('div.items-stretch').should('exist');
    cy.contains('h3:visible', '諮詢醫療院所').closest('div.ring-default').should('exist');
}

function verifyUpdatePage(){
    cy.intercept('GET', '**/cskapi/api/child/*').as('GetChildAPI');
}

function verifyRequestUpdatePage(){
    cy.wait('@GetChildAPI').then(({ response }) => {
        expect(response.body.msg).to.include('OK');
        expect(response.body.code).to.eq(200);
        expect(response.body.success).to.eq(true);
    })
}

function verifyDeleteChildInfo(Addresscode, name, time, assertType = 'exist'){
    const codeText = String(Addresscode);

    if (assertType === 'not.exist') {
        cy.contains('body', codeText, { matchCase: false }).should('not.exist');
        return;
    }

    // 先確認頁面上有該身分證字號，再回溯到卡片容器做細項驗證
    cy.contains('body', codeText, { matchCase: false, timeout: 10000 }).should('exist')
        .closest('div.group.cursor-pointer, div[class*=\"cursor-pointer\"]')
        .should('exist').scrollIntoView().within(() => {
            cy.contains(codeText, { matchCase: false }).should('exist');
            if (name) {
                cy.contains(String(name)).should('exist');
            }
            if (time) {
                cy.contains(String(time)).should('exist');
            }
        });
}



export{
    verifychildlistMessage,
    verifychildInfoMessage,
    verifychildlistfilterMessage,
    verifyRowViewButtonMessage,
    verifyCheckResultButtonMessage,
    verifyUpdatePage,
    verifyRequestUpdatePage,
    verifyDeleteChildInfo
}
