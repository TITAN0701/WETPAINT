
function verifyPhoneInputMessage(phonenumber){
    cy.get('input[type="tel"]').should('have.value', phonenumber);
}

export{
    verifyPhoneInputMessage
}