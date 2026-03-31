
function verifyAccountLoginErrorMessage(type){
    switch (type) {
        case '401':
            cy.contains('div', '帳號或密碼錯誤').should('be.visible');
            cy.wait('@loginerrorapi').then(({ response }) => {
                expect(response.body.msg).to.eq('帳號或密碼錯誤');
                expect(response.body.code).to.eq(401);
                expect(response.body.success).to.eq(false);
            });
            break;

        case '403':
            cy.contains('div', '帳號或密碼錯誤').should('be.visible');
            cy.wait('@loginerrorapi').then(({ response }) => {
                expect(response.body.msg).to.include('嘗試登入次數過多');
                expect(response.body.code).to.eq(403);
                expect(response.body.success).to.eq(false);
            });
            break;

        default:
            throw new Error(`Unsupported error type: ${type}`);
    }
}

function verifyGetAccountLoginErrorAPI(){
    cy.intercept('POST', '**/login').as('loginerrorapi');
}


export{
    verifyAccountLoginErrorMessage,
    verifyGetAccountLoginErrorAPI
}
