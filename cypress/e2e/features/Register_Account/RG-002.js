
function verifyRegisterNameInput(TestName) {
    cy.get('input[placeholder="請輸入全名"]').should('have.value', TestName);
}

function verifyRegisterPasswordInput(TestPassword, TestconfirmPassword) {
    cy.get('#password').should('have.value', TestPassword);
    cy.get('#confirmPassword').should('have.value', TestconfirmPassword);
}

export{ 
    verifyRegisterNameInput,
    verifyRegisterPasswordInput
}