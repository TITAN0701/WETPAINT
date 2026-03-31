
function verifyEmailInput(Email){
    cy.get('input[type="email"]').should('have.value', Email);
}

export {
    verifyEmailInput
}