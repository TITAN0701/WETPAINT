class loginPageObject{

   Elementsarevisble(){
      // 左側介紹區文案（避免用容易變動的圖片 class）
      cy.contains('p:visible', '兒童發展智慧偵測平台').should('exist');
      cy.contains('p:visible', '輕鬆掌握關鍵發展面向').should('exist');
      cy.contains('p:visible', '即時追蹤孩子在動作、認知、社交與語言能力').should('exist');
      cy.contains('p:visible', '的成長進度。').should('exist');
      
      // 右側登入區
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

export default loginPageObject;
