function verifyPasswdPreviewFunction() {
    //確認預覽按鈕存在
    cy.get('#password').closest('div.relative').find('button').should('exist');
    cy.get('#password').closest('div.relative').find('button svg').should('exist');
}

function verifyPasswdPreviewClickOk(password) {
    //確認密碼欄位的type變為text，且能看到輸入的密碼
    cy.get('#password').should('have.attr', 'type', 'text');
    cy.get('#password').should('have.value', password);
}

function verifyPasswdPreviewClickIsDisable() {
    //確認密碼欄位的type變回password，且看不到輸入的密碼
    cy.get('#password').should('have.attr', 'type', 'password');
}

export { 
    verifyPasswdPreviewFunction,
    verifyPasswdPreviewClickOk,
    verifyPasswdPreviewClickIsDisable
}