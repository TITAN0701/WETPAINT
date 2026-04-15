

function verifyFirstLoginMessage(){
    cy.contains('h2', /歡迎使用\s*WETPAINT\s*兒童發展智慧偵測平台/).should('be.visible');
    cy.contains('p', '我們很高興能陪伴您一同記錄孩子的成長旅程。').should('be.visible');
    cy.contains('button', '開始使用，輕鬆掌握孩子的發展狀況').should('be.visible');
}

function verifyRequestFirstPagAPI(){
    cy.intercept('GET', '**/api/onboarding*').as('GetFirstPageAPI');
}

function verifySecondPageMessage(){
    cy.contains('h2:visible', '請選擇您的使用者身份').should('exist');
    cy.contains('p:visible', '請選擇最符合您目前使用目的的角色，我們將依此提供最佳操作體驗').should('exist');
    cy.contains('span:visible', '老師').should('exist');
    cy.contains('span:visible', '祖父母').should('exist');
    cy.contains('span:visible', '兄弟姊妹').should('exist');
    cy.contains('span:visible', '社工').should('exist');
    cy.contains('span:visible', '其他').should('exist');
}

function verifyThirdPageMessage(){
    cy.get('img[src*="動作發展"]').closest('div.items-center').should('be.visible');
    cy.get('img[src*="語言發展"]').closest('div.items-center').should('be.visible');
    cy.get('img[src*="社交發展"]').closest('div.items-center').should('be.visible');
    cy.get('img[src*="認知發展"]').closest('div.items-center').should('be.visible');

}

function verifyFourPageMessage(){
    cy.contains('h2', '來為您的孩子建立專屬檔案吧！').should('be.visible');

}
function verifyCompletedPageMessage(){
    cy.contains('h2:visible', '一切準備就緒！').should('exist');
    cy.contains('p:visible', ' 探索WETPAINT，為您孩子的成長旅程揭開序幕。 ').should('exist');
}

function verifyGetReposnsePageAPI(){
    cy.wait('@GetFirstPageAPI').then(({ response }) => {
        expect(response.body.msg).to.include('OK');
        expect(response.body.code).to.eq(200);
        expect(response.body.success).to.eq(true);
    })
}


export{
    verifyFirstLoginMessage,
    verifySecondPageMessage,
    verifyThirdPageMessage,
    verifyFourPageMessage,
    verifyCompletedPageMessage,
    verifyRequestFirstPagAPI,
    verifyGetReposnsePageAPI
}
