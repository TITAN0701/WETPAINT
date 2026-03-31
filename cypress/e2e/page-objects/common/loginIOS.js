class loginIOSageObject{

   Elementsarevisble(){
    // 下列欄位登入區
    cy.contains('div', ' 兒童發展智慧偵測平台 ').should('be.visible');
    cy.get('div.box_shadow.bg-white:visible').first().within(()=>{  
        cy.contains('h2', '歡迎回來').should('be.visible');
        cy.contains('label[for="username"]', '帳號').should('be.visible');
        cy.get('#username').should('be.visible');
        cy.contains('label[for="password"]', '密碼').should('be.visible');
        cy.get('#password').should('be.visible');
        cy.get('#password').closest('div.relative').find('button').should('exist');
        cy.get('#password').closest('div.relative').find('button svg').should('exist');
        cy.get('button').contains('登入').should('be.visible');
      })
   }
}

export default loginIOSageObject;