
function verifyDashboardPageLoaded(){
    cy.contains('div:visible', '儀表板').should('be.visible');
}


export{
    verifyDashboardPageLoaded,
}
