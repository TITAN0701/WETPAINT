
function verifyClickRegisterMessage(){
    cy.location('pathname').should('eq', '/register');
    cy.contains('h2', '創立帳號').should('be.visible');
    cy.get('img[src*="register_bottom"]').should('be.visible');
}

function verifyGetRegisterPageElements(){
    cy.contains('h2', '創立帳號').should('be.visible');
    cy.contains('label', '填寫人姓名').should('be.visible');
    cy.get('input[placeholder="請輸入全名"]').should('be.visible');
    cy.contains('label', '密碼 ').should('be.visible');
    cy.contains('span', '請輸入 8 碼以上含大小寫英文').should('be.visible');
    cy.get('#password').closest('div.relative').find('button').should('be.visible');
    cy.contains('label', '確認密碼').should('be.visible');
    cy.get('#confirmPassword').closest('div.relative').find('button').should('be.visible');
    cy.contains('label', '性別').parent().find('input[type="radio"]').should('have.length', 2);
    cy.contains('label', '男性').should('be.visible');
    cy.contains('label', '女性').should('be.visible');
    cy.contains('label', 'Email').should('be.visible');
    cy.get('input[placeholder="example@email.com"]').should('be.visible');
    cy.contains('label','手機號碼').should('be.visible');
    cy.get('input[placeholder="0900-000-000"]').should('be.visible');
    cy.contains('label', '填寫驗證碼 (擇一方式)').should('be.visible');
    cy.get('input[type="radio"][value="email"]').should('be.visible');
    cy.get('input[type="radio"][value="sms"]').should('be.visible');
    cy.get('input[placeholder="XXXXXXXX"]').siblings('button').contains( '取得驗證碼').should('be.visible');

    cy.contains('label', ' 請閱讀 ').should('be.visible');
    cy.contains('button', ' 服務條款 ').should('be.visible');
}



export{
    verifyClickRegisterMessage,
    verifyGetRegisterPageElements
}