function verifyLoginPageAccountAPI(){
    cy.intercept('POST', '*/*/auth/login**').as('loginApi');
}

function verifyLoginPageAccountAPIRequest(account, password){
    cy.wait('@loginApi').then(({ request, response }) => {
        expect(request.method).to.eq('POST');
        expect(request.url).to.include('/auth/login');
        expect(request.body).to.have.property('account', account);
        expect(request.body).to.have.property('password', password);
        expect(response.statusCode).to.eq(200);

        expect(response.statusCode).to.eq(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('token');
    });
}



export { 
    verifyLoginPageAccountAPI,
    verifyLoginPageAccountAPIRequest
}