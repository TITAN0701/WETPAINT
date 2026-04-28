const aboutAdminTexts = [
    '關於我們',
    '本站介紹',
    '認識團隊',
    '合作單位',
];

const aboutEditBaseTexts = [
    { selector: 'h2', text: '編輯關於我們' },
    { selector: 'button', text: '本站介紹' },
    { selector: 'button', text: '認識團隊' },
    { selector: 'button', text: '取消' },
    { selector: 'button', text: '確認' },
];

const aboutIntroEditTexts = [
    { selector: 'label, button, div', text: '本站介紹' },
    { selector: 'label', text: '特色區塊標題' },
    { selector: 'label', text: '特色項目' },
    { selector: 'label, div', text: '特色區塊圖片' },
    { selector: 'button', text: '新增項目' },
    { selector: 'label', text: '合作單位說明' },
    { selector: 'label', text: '合作單位 Logo（最少 1 張，最多 10 張）' },
    { selector: 'button', text: '新增合作單位' },
];

const aboutIntroEditValues = [
    {
        selector: 'textarea',
        value: '系統管理者，現有發展遲緩兒的發現，主要需靠專業醫療人員進行一連串的多面向評估與鑑定，臺灣雖已建立發展監測與篩檢作法，但不同場域間落實與宣導仍有進步空間，其主要原因包含城鄉特質及需求不同，偏鄉地區須建構更多早療資源和支持。透過跨專業及跨單位合作，發展具人工智能之兒童發展遲緩快速辨識系統，利用大數據及人工智慧辨識可預防的風險因素及早期表徵，進行早期篩檢、評估，與診治方法之建議，以提供完整的多面向功能評估，提升兒童重大疾病早期介入、早期治療的成效，共同提升兒童健康促進及相關產業發展。',
    },
    { selector: 'input', value: '黃金成長期，不錯過每一個早期徵兆' },
    { selector: 'input', value: '及早發現、及早治療，一起把握孩子的黃金發展期' },
    { selector: 'input', value: '線上系統，輕鬆使用，提供遠距醫療評估偏鄉就醫不便兒童' },
    { selector: 'input', value: 'AI智慧分析，全面偵測孩子的發展狀況' },
    { selector: 'input', value: '與家長合作，早期發現遲緩，提供專業的初步評估' },
    {
        selector: 'textarea',
        value: '本網站為政府科技發展年度綱要計畫補助款支持，衛生福利部指導，由國家衛生研究院、台灣基督長老教會馬偕醫療財團法人馬偕醫院、國立臺北科技大學共同執行。',
    },
    { selector: 'input', value: 'wetpaintnhri@gmail.com' },
];

const aboutIntroEditPlaceholders = [
    { selector: 'textarea', placeholder: '輸入本站介紹說明...' },
    { selector: 'input', placeholder: '特色區塊標題' },
    { selector: 'input', placeholder: '請輸入特色項目' },
    { selector: 'textarea', placeholder: '合作單位說明...' },
    { selector: 'input', placeholder: '請輸入合作單位名稱' },
    { selector: 'input', placeholder: 'https://...' },
    { selector: 'input', placeholder: '聯絡信箱' },
];

const aboutIntroEditTitleAttributes = [
    '拖曳排序',
    '刪除',
];

const aboutTeamEditTexts = [
    { selector: 'label', text: '部門管理' },
    { selector: 'button', text: '新增部門' },
    { selector: 'label', text: '基本資訊' },
    { selector: 'label', text: 'Tab 名稱' },
    { selector: 'label', text: '完整名稱' },
    { selector: 'label', text: '職責說明' },
    { selector: 'label', text: '核心成員' },
    { selector: 'label', text: '姓名' },
    { selector: 'label', text: '職稱' },
    { selector: 'label', text: '組織' },
    { selector: 'label', text: '部門' },
    { selector: 'button', text: '新增核心成員' },
    { selector: 'label', text: '團隊成員' },
    { selector: 'label', text: '職責' },
    { selector: 'button', text: '新增團隊成員' },
];

const aboutTeamEditVisibleTexts = [
    '國衛院-群健所',
    '國衛院-醫療所',
    '馬偕兒童早療中心',
    '北科大-資工所',
    '北科大-互動所',
];

const aboutTeamEditValues = [
    { selector: 'input', value: '國衛院-群健所' },
    { selector: 'input', value: '國家衛生研究院群體健康科學研究所' },
    { selector: 'textarea', value: '計畫資源協調與統整、驗證WETPAINT平台信效度' },
    { selector: 'input', value: '邱弘毅' },
    { selector: 'input', value: '所長' },
    { selector: 'input', value: '國家衛生研究院' },
    { selector: 'input', value: '群體健康科學研究所' },
    { selector: 'input', value: '蕭宇涵' },
    { selector: 'input', value: '博士後研究員' },
    { selector: 'input', value: '陳郁安' },
    { selector: 'input', value: '科技管理師' },
    { selector: 'input', value: '游晴雅' },
    { selector: 'input', value: '研究助理' },
    { selector: 'textarea', value: '台智雲雲端/資訊安全顧問' },
    { selector: 'input', value: '陳宥諼' },
    { selector: 'input', value: '研究助理(主)' },
    { selector: 'textarea', value: '專案管理、資源統籌、計畫推動、IRB相關事務、OTP簡訊窗口、Email信箱管理、平台商標申請等相關事宜' },
];

const aboutTeamEditPlaceholders = [
    { selector: 'input', placeholder: '如：國衛院-群健所' },
    { selector: 'input', placeholder: '如：國家衛生研究院群體健康科學研究所' },
    { selector: 'textarea', placeholder: '輸入部門職責說明...' },
    { selector: 'input', placeholder: '姓名' },
    { selector: 'input', placeholder: '職稱' },
    { selector: 'input', placeholder: '隸屬組織' },
    { selector: 'input', placeholder: '所屬部門' },
    { selector: 'textarea', placeholder: '職責說明' },
];

const dialogSelector = 'div[role="dialog"][data-state="open"]';

function verifyAboutPageLoaded() {
    cy.location('pathname', { timeout: 10000 }).should('include', '/admin/about');
    cy.get('main').should('be.visible');
    cy.get('main button:visible').its('length').should('be.greaterThan', 0);
}

function verifyAboutPageCoreBlocks() {
    cy.get('main').within(() => {
        aboutAdminTexts.forEach((text) => {
            cy.contains(text).should('be.visible');
        });
    });
}

function openAboutEditDialog() {
    cy.get('main').then(($main) => {
        const $buttons = $main.find('button:visible');
        expect($buttons.length, 'about page button count').to.be.greaterThan(0);

        const $editButton = Cypress.$($buttons)
            .filter((_, el) => /edit|編輯/i.test(Cypress.$(el).text()));

        if ($editButton.length > 0) {
            cy.wrap($editButton.first()).click({ force: true });
            return;
        }

        cy.wrap($buttons[0]).click({ force: true });
    });

    cy.get(dialogSelector, { timeout: 10000 }).should('be.visible');
}

function clickDialogTab(tabText) {
    cy.get(dialogSelector)
        .contains('button', new RegExp(`^\\s*${tabText}\\s*$`))
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
}

function verifyDialogTexts(items) {
    items.forEach(({ selector, text }) => {
        cy.get(dialogSelector)
            .contains(selector, text)
            .scrollIntoView()
            .should('be.visible');
    });
}

function verifyDialogVisibleTexts(texts) {
    texts.forEach((text) => {
        cy.get(dialogSelector)
            .contains(text)
            .scrollIntoView()
            .should('be.visible');
    });
}

function verifyDialogValues(items) {
    items.forEach(({ selector, value }) => {
        cy.get(dialogSelector)
            .find(selector)
            .filter((_, el) => Cypress.$(el).val() === value)
            .first()
            .should('exist')
            .scrollIntoView()
            .should('be.visible')
            .and('have.value', value);
    });
}

function verifyDialogPlaceholders(items) {
    items.forEach(({ selector, placeholder }) => {
        cy.get(dialogSelector)
            .find(`${selector}[placeholder="${placeholder}"]`)
            .first()
            .scrollIntoView()
            .should('exist');
    });
}

function verifyDialogTitleAttributes(titles) {
    titles.forEach((title) => {
        cy.get(dialogSelector)
            .find(`[title="${title}"]`)
            .its('length')
            .should('be.greaterThan', 0);
    });
}

function closeAboutEditDialog() {
    cy.get(dialogSelector).then(($dialog) => {
        const $closeButton = Cypress.$($dialog)
            .find('button:visible')
            .filter((_, el) => /取消|關閉|cancel|close|×|x/i.test(Cypress.$(el).text().trim()))
            .first();

        if ($closeButton.length > 0) {
            cy.wrap($closeButton).click({ force: true });
            return;
        }

        cy.wrap($dialog).find('button:visible').first().click({ force: true });
    });

    cy.get(dialogSelector).should('not.exist');
}

function verifyAboutEditDialogCanOpenAndClose() {
    openAboutEditDialog();
    verifyDialogTexts(aboutEditBaseTexts);

    clickDialogTab('本站介紹');
    verifyDialogTexts(aboutIntroEditTexts);
    verifyDialogValues(aboutIntroEditValues);
    verifyDialogPlaceholders(aboutIntroEditPlaceholders);
    verifyDialogTitleAttributes(aboutIntroEditTitleAttributes);

    clickDialogTab('認識團隊');
    verifyDialogTexts(aboutTeamEditTexts);
    verifyDialogVisibleTexts(aboutTeamEditVisibleTexts);
    verifyDialogValues(aboutTeamEditValues);
    verifyDialogPlaceholders(aboutTeamEditPlaceholders);

    closeAboutEditDialog();
}

export {
    verifyAboutPageLoaded,
    verifyAboutPageCoreBlocks,
    verifyAboutEditDialogCanOpenAndClose,
};
