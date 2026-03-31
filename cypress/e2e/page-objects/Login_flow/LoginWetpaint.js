class LoginSys {
  constructor() {
    this.pageURL = '/login';
  }

  goToLoginPage() {
    cy.visit(this.pageURL);
  }

  clickaccountnumber(accountNumber) {
    cy.get('div.box_shadow.bg-white').should('exist');
    cy.get('#username').should('be.visible').clear().type(accountNumber);
  }

  clickpassword(password) {
    cy.get('div.box_shadow.bg-white').should('exist');
    cy.get('#password').should('be.visible').clear().type(password, { log: false });
  }

  clickPreviewButton() {
    cy.get('#password').closest('div.relative').find('button').should('exist').click();
  }

  clickLoginButton() {
    cy.contains('button', '登入').should('be.visible').click();
  }

  // 點擊忘記密碼，輸入帳號並點擊並點擊傳送重設連結
  clickLoginButtonForgetfunction(account) {
    cy.contains('button', ' 忘記密碼？ ').should('be.visible').click();
    cy.contains('p', ' 請輸入您的電子郵件地址，我們將向您發送一封重置密碼的郵件。 ').should('be.visible');
    cy.get('input#email, input[name="email"], input[placeholder="example@email.com"]').first().should('be.visible').clear().type(account);
  }

  clickLoginButtonForgetfunctionNextButton() {
    cy.contains('button', ' 傳送重設連結 ').click();
  }

  clickLoginButtonForgetfunctionResetButton(password, confirmPassword) {

    cy.contains('h2', '重設密碼').should('be.visible');
    cy.contains('label', '請輸入新密碼').should('be.visible');
    cy.get('#new-password').clear().type(password);
    cy.contains('label', '請再次輸入新密碼').should('be.visible');
    cy.get('#confirm-password').clear().type(confirmPassword);
    cy.contains('button', ' 變更密碼 ').click();
  }

  clickBackToPageButton(){
    cy.contains('button', ' 回登入頁面 ').click();
  }

  clickRegisterButton(){
    cy.contains('span', '還沒有帳號？').should('be.visible');
    cy.contains('button', '創立帳號').should('be.visible').click();  
  }

}

export default LoginSys;
