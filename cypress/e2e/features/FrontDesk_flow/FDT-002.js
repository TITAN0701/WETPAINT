import FirstPageList from '../../page-objects/frontdesk_manage/firstpagelist';

const firstPageList = new FirstPageList();

function getDialogByMode(mode) {
    firstPageList.currentFormMode = mode;
    return firstPageList.getOpenDialog();
}

function verifyAddFileDialogOpened() {
    getDialogByMode('create');
    firstPageList.getIdField().should('be.enabled');
    getDialogByMode('create').contains('button:visible', '建立檔案').should('be.visible');
    getDialogByMode('create').contains('button:visible', '取消').should('be.visible');
}

function verifyDevelopmentTabLoaded() {
    firstPageList.getdevelopmentPanel().should('be.visible');
    firstPageList.getDevelopmentEntryState().should((entryState) => {
        expect(['actionable', 'waiting']).to.include(entryState);
    });
}

function verifyRecordTabLoaded(minCount = 1) {
    firstPageList.getrecordPanel().should('be.visible');
    cy.get('div.group.relative.flex.w-full.flex-col')
        .its('length')
        .should('be.gte', minCount);
}

function verifyAdviceTabLoaded() {
    firstPageList.getadvicePanel().should('be.visible');
}

function verifyAdviceResultButtonLoaded() {
    firstPageList.getadviceResoultButton().should('be.visible');
}

function verifyAdviceHistoryButtonLoaded() {
    firstPageList.getadviceHistoryButton().should('be.visible');
}

function verifyAdviceSeekMapButtonLoaded() {
    firstPageList.getadviceSeekMapButton().should('be.visible');
}

function verifyProfileTabLoaded() {
    firstPageList.getprofilePanel().should('be.visible');
    firstPageList.getprofileEditPanel('Edit').should('be.visible');
}

function verifyProfileText(expected = {}) {
    const profileData = typeof expected === 'string'
        ? { childName: expected }
        : expected;

    if (profileData.childName) {
        cy.contains('body', String(profileData.childName), { timeout: 10000 }).should('exist');
    }

    if (profileData.childselfcode) {
        cy.contains('body', String(profileData.childselfcode), { timeout: 10000 }).should('exist');
    }

    if (profileData.childYeartime) {
        const formattedDate = String(profileData.childYeartime).replace(/-/g, '/');
        cy.contains('body', formattedDate, { timeout: 10000 }).should('exist');
    }
}

export {
    verifyAddFileDialogOpened,
    verifyDevelopmentTabLoaded,
    verifyRecordTabLoaded,
    verifyAdviceTabLoaded,
    verifyAdviceResultButtonLoaded,
    verifyAdviceHistoryButtonLoaded,
    verifyAdviceSeekMapButtonLoaded,
    verifyProfileTabLoaded,
    verifyProfileText,
};
