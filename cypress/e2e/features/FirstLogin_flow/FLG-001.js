function verifyFirstLoginMessage() {
    cy.contains('h2', /歡迎使用\s*WETPAINT/).should('be.visible');
    cy.contains('button', /開始使用/).should('be.visible');
}

function verifyRequestFirstPagAPI() {
    cy.intercept('GET', '**/api/onboarding*').as('GetFirstPageAPI');
}

function verifySecondPageMessage() {
    cy.contains('h2:visible', /請選擇您的使用者身份|使用者身份/).should('exist');
    cy.contains('button:visible', /下一步/).should('exist');
}

function verifyThirdPageMessage() {
    cy.contains('h2:visible', /認識\s*WETPAINT\s*的核心功能/).should('be.visible');
    cy.get('img[alt="動作發展"]:visible').should('exist');
    cy.get('img[alt="認知發展"]:visible').should('exist');
    cy.get('img[alt="語言發展"]:visible').should('exist');
    cy.get('img[alt="社會情緒"]:visible').should('exist');
}

function verifyFourPageMessage() {
    cy.contains('h2:visible', /孩童.*基本資料|請填寫孩童/).should('be.visible');
    cy.get('input[placeholder="請輸入孩童全名"]:visible').should('exist');
}

function verifyCompletedPageMessage() {
    cy.contains('button:visible', /開始使用\s*WETPAINT/).should('exist');
}

function verifyGetReposnsePageAPI() {
    cy.wait('@GetFirstPageAPI').then(({ response }) => {
        expect(response.body.msg).to.include('OK');
        expect(response.body.code).to.eq(200);
        expect(response.body.success).to.eq(true);
    });
}

function verifyDirectHomePageMessage() {
    cy.location('pathname', { timeout: 10000 }).should((pathname) => {
        const normalizedPath = String(pathname || '').toLowerCase();
        const isAllowed =
            /\/dashboard(?:\/|$)/.test(normalizedPath)
            || /\/admin\/dashboard(?:\/|$)/.test(normalizedPath)
            || /\/admin\/child-list(?:\/|$)/.test(normalizedPath)
            || /\/developmental(?:\/|$)/.test(normalizedPath)
            || /\/\d+\/developmental(?:\/|$)/.test(normalizedPath);

        expect(isAllowed, `unexpected direct-home path: ${pathname}`).to.eq(true);
    });

    cy.get('body', { timeout: 10000 }).should(($body) => {
        const hasHomeSignals =
            $body.find('nav a[href*="/developmental"]').length > 0
            || $body.find('nav a[href="/admin/dashboard"]').length > 0
            || $body.find('nav a[href="/admin/child-list"]').length > 0
            || $body.find('div.group.cursor-pointer').length > 0
            || $body.find('button').filter((_, el) => /新增檔案|開始檢測|最新檢測結果/.test(el.innerText || '')).length > 0;

        expect(hasHomeSignals, 'expected direct-home page signals').to.eq(true);
    });
}

function verifyFirstLoginLandingState(firstLoginPage) {
    return firstLoginPage.getCurrentOnboardingStep().then((step) => {
        switch (step) {
            case 1:
                verifyFirstLoginMessage();
                break;
            case 2:
                verifySecondPageMessage();
                break;
            case 3:
                verifyThirdPageMessage();
                break;
            case 4:
                verifyFourPageMessage();
                break;
            case 5:
                verifyDirectHomePageMessage();
                break;
            default:
                throw new Error(`無法判斷首次登入落點頁面，step=${step}`);
        }

        return cy.wrap(step, { log: false });
    });
}

export {
    verifyFirstLoginMessage,
    verifyFirstLoginLandingState,
    verifySecondPageMessage,
    verifyThirdPageMessage,
    verifyFourPageMessage,
    verifyCompletedPageMessage,
    verifyDirectHomePageMessage,
    verifyRequestFirstPagAPI,
    verifyGetReposnsePageAPI,
};
