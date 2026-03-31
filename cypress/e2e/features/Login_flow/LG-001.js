
function verifyLoginPageAccountPasswdInput(content){
    // 確認密碼欄位存在且具有正確的placeholder
    cy.get('#username').should('be.visible').and('have.attr', 'placeholder', '請輸入手機號碼或電子郵件');
    cy.get('#username').should('have.value', content).and('have.attr', 'type', 'text');
}

function verifyLoginPageAccountError(){
    cy.contains('button', '登入').click();
    cy.contains('div', '帳號或密碼錯誤').should('be.visible');
}

export { 
    verifyLoginPageAccountError,
    verifyLoginPageAccountPasswdInput
}
