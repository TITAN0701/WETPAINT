
function verifyCheckQuestionfunction(index, description){
    const colums = ['標題描述', '面相', '施測年齡', '警示題', '動作'];
    colums.forEach((column) => {
        cy.contains('th:visible,div:visible,span:visible,p:visible', column).should('exist');
    });

    cy.get(' table tbody tr:visible').eq(0).find('td').eq(index).invoke('text')
    .then((text) => {
        const content = text.trim();
        expect(content).to.eq(description);
    })
}

function verifyCheckImagePagefunction(index, description){
    const colums = ['標題描述', '施測年齡', '動作'];
    colums.forEach((column) => {
        cy.contains('th:visible,div:visible,span:visible,p:visible', column).should('exist');
    });

    cy.get(' table tbody tr:visible').eq(0).find('td').eq(index).invoke('text')
    .then((text) => {
        const content = text.trim();
        expect(content).to.eq(description);
    })
}

function veriifyCheckImagePageApply(index, description){
    const colums = ['標題描述', '施測年齡', '動作'];
    colums.forEach((column) => {
        cy.contains('th:visible,div:visible,span:visible,p:visible', column).should('exist');
    });

    cy.get(' table tbody tr:visible').eq(0).find('td').eq(index).invoke('text')
    .then((text) => {
        const content = text.trim();
        expect(content).to.eq(description);
    })
}

function verifyCheckAIQuestionPage(index, description){
    const colums = ['標題描述', '施測年齡', '動作'];
    colums.forEach((column) => {
        cy.contains('th:visible,div:visible,span:visible,p:visible', column).should('exist');
    });

    cy.get(' table tbody tr:visible').eq(0).find('td').eq(index).invoke('text')
    .then((text) => {
        const content = text.trim();
        expect(content).to.eq(description);
    })
}




export{
    verifyCheckQuestionfunction,
    verifyCheckImagePagefunction,
    veriifyCheckImagePageApply,
    verifyCheckAIQuestionPage
}
