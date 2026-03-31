

function  verifycheckItemContentMessage(){
    cy.contains('h3', '隱私權保護政策').invoke('text').then((text) => {
        expect(text.trim()).to.eq('隱私權保護政策');
    })
    cy.contains('p', ' 歡迎您使用本服務。本服務條款（以下簡稱「本條款」）適用於您使用本網站及相關服務之權利義務關係。 ').should('be.exist');
    cy.contains('p', ' 8. 服務之停止、中斷').scrollIntoView().should('be.exist');
    cy.contains('p', '本公司將依一般合理之技術及方式，維持系統及服務之正常運作。但於以下各項情況時，本公司有權可以停止、中斷提供本服務。 ').scrollIntoView().should('be.exist');
}

function verifycheckItemStatus(Otp){

    if(Otp === 'yes'){
        cy.get('#termsCheck').should('be.checked');
    }
    
    if(Otp === 'no'){
        cy.get('#termsCheck').should('not.be.checked');
    }
}


export{
    verifycheckItemContentMessage,
    verifycheckItemStatus
}