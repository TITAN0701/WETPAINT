
function verifyGenderOptionsChecked(gender) {
    cy.get(`input[type="radio"][value="${gender}"]`).should('exist').check({force: true}).should('be.checked');

}

export { 
    verifyGenderOptionsChecked 
};