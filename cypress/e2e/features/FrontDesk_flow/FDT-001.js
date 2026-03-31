

function verifyFrontdesklogin(){
    cy.location('pathname', { timeout: 10000 }).should('include', '/developmental');
}


export{
    verifyFrontdesklogin
}