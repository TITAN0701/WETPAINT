class RegisterAccount {

    constructor(){
        this.pageURL = '/register';
    }

    goToRegisterPage(){
        cy.visit(this.pageURL);
    }

    clickRegisterNameinput(name){
        cy.get('input[placeholder="請輸入全名"]').should('be.visible').clear().type(name);
    }

    clickRegisterPasswordinput(password, confirmPassword){
        cy.get('#password').should('be.visible').clear().type(password, { log: false });
        cy.get('#confirmPassword').should('be.visible').clear().type(confirmPassword, { log: false })
    }

    clickRegisterConfirmPasswordinput(confirmPassword){
        cy.get('#confirmPassword').should('be.visible').clear().type(confirmPassword, { log: false });
    }

    clickRegisterGenderinput(gender){
        cy.get(`input[type="radio"][value="${gender}"]`).should('be.visible').check();
    }

    clickRegisterEmailinput(email){
        cy.get('input[placeholder="example@email.com"]').should('be.visible').clear().type(email);
    }

    clickRegisterPhoneinput(phone){
        cy.get('input[placeholder="0900-000-000"]').should('be.visible').clear().type(phone);
    }

    clickRegisterVerificationCodeInput(Option){
        cy.get(`input[type="radio"][value="${Option}"]`).should('be.visible').check();
        return cy.contains('button', '取得驗證碼').should('exist').click();
    }

    InputtypeRegisterVerificationCode(code){
        return cy.get('input[placeholder="XXXXXXXX"]').should('be.visible').clear().type(String(code));
    }

    clickAndCheckRegisterButton(){
        cy.contains('button', ' 服務條款 ').should('be.visible').click();
    }

    clickAgressCheckButton(){
        cy.contains('p', ' 8. 服務之停止、中斷').scrollIntoView().should('be.exist');
        cy.get('#termsCheck').should('exist').check({ force: true });
        cy.contains('button', ' 我同意 ').should('be.visible').click();
    }

    clickConfirmRegisterButton(){
        cy.contains('button', '確認送出').click();
    }


}

export default RegisterAccount;
