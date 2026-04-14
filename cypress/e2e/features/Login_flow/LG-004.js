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
        expect(response.body).to.be.an('object');

        const tokenFromRoot = response.body?.token;
        const tokenFromData = response.body?.data?.token;
        const token = tokenFromData || tokenFromRoot || null;

        if (token !== null) {
            expect(token).to.be.a('string').and.not.be.empty;
        }
    });
}



export { 
    verifyLoginPageAccountAPI,
    verifyLoginPageAccountAPIRequest
}
