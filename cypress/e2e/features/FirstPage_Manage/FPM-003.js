function assertCellValue(content, expected) {
    if (typeof expected === 'function') {
        expected(content);
        return;
    }

    if (expected instanceof RegExp) {
        expect(content).to.match(expected);
        return;
    }

    expect(content).to.eq(expected);
}

function ensureQuestionTableVisible(minColumns = 3) {
    cy.get('table:visible').should('exist');
    cy.get('table tbody tr:visible').its('length').should('be.gte', 1);
    cy.get('table thead th:visible').its('length').should('be.gte', minColumns);
}

function verifyCellByIndex(index, expected, minColumns = 3) {
    ensureQuestionTableVisible(minColumns);

    cy.get('table tbody tr:visible')
        .eq(0)
        .find('td')
        .eq(index)
        .invoke('text')
        .then((text) => {
            const content = text.trim();
            assertCellValue(content, expected);
        });
}

function verifyCheckQuestionfunction(index, description) {
    verifyCellByIndex(index, description, 5);
}

function verifyCheckImagePagefunction(index, description) {
    verifyCellByIndex(index, description, 3);
}

function veriifyCheckImagePageApply(index, description) {
    verifyCellByIndex(index, description, 3);
}

function verifyCheckAIQuestionPage(index, description) {
    verifyCellByIndex(index, description, 3);
}

function verifyCellIsNotEmpty(index, minColumns = 3) {
    verifyCellByIndex(index, (content) => {
        expect(content).to.be.a('string').and.not.be.empty;
    }, minColumns);
}

function verifyRowActionButtons(rowIndex = 0, minButtons = 1) {
    ensureQuestionTableVisible(3);

    cy.get('table tbody tr:visible')
        .eq(rowIndex)
        .find('td')
        .last()
        .find('button:visible')
        .its('length')
        .should('be.gte', minButtons);
}

export {
    verifyCheckQuestionfunction,
    verifyCheckImagePagefunction,
    veriifyCheckImagePageApply,
    verifyCheckAIQuestionPage,
    verifyCellIsNotEmpty,
    verifyRowActionButtons
};
