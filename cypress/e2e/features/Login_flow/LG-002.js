
function verifyPasswdInputFunction(content) {
    // 確認密碼欄位存在且具有正確的placeholder
    cy.get('#password').should('be.visible').and('have.attr', 'placeholder', '請輸入密碼');
    cy.get('#password').should('have.value', content).and('have.attr', 'type', 'password');
}

function verifyLoginPageAccountError(){
    cy.contains('button', '登入').click();
    cy.contains('div', '帳號或密碼錯誤').should('be.visible');
}


export { 
    verifyPasswdInputFunction,
    verifyLoginPageAccountError
}