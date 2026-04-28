const aboutIntroTexts = [
    '本站',
    '介紹',
    `現有發展遲緩兒的發現，主要需靠專業醫療人員進行一連串的多面向評估與鑑定，臺灣雖已建立發展監測與篩檢作法，但不同場域間落實與宣導仍有進步空間，其主要原因包含城鄉特質及需求不同，偏鄉地區須建構更多早療資源和支持.
透過跨專業及跨單位合作，發展具人工智能之兒童發展遲緩快速辨識系統，利用大數據及人工智慧辨識可預防的風險因素及早期表徵，進行早期篩檢、評估，與診治方法之建議，以提供完整的多面向功能評估，提升兒童重大疾病早期介入、早期治療的成效，共同提升兒童健康促進及相關產業發展。`,
    '黃金成長期，不錯過每一個早期徵兆',
    '及早發現、及早治療，一起把握孩子的黃金發展期',
    '線上系統，輕鬆使用，提供遠距醫療評估偏鄉就醫不便兒童',
    'AI智慧分析，全面偵測孩子的發展狀況',
    '與家長合作，早期發現遲緩，提供專業的初步評估',
    '合作單位',
    '本網站為政府科技發展年度綱要計畫補助款支持',
    '衛生福利部指導',
    '由國家衛生研究院、台灣基督長老教會馬偕醫療財團法人馬偕醫院、國立臺北科技大學共同執行',
];

const teamSections = [
    {
        tab: '國衛院-群健所',
        heading: '國家衛生研究院群體健康科學研究所',
        description: '計畫資源協調與統整、驗證WETPAINT平台信效度',
        coreMembers: [
            '邱弘毅 所長',
            '蕭宇涵 博士後研究員',
            '陳郁安 科技管理師',
        ],
        members: [
            ['游晴雅', '研究助理'],
            ['陳亮瑜', '研究助理'],
            ['陳宥諼', '研究助理（主）'],
            ['施鈺玟', '研究助理'],
            ['何思涵', '研究助理'],
            ['黃俊曄', '研究助理'],
        ],
        responsibilities: [
            '台智雲雲端/資訊安全顧問',
            '專案管理、資源統籌、計畫推動、IRB相關事務、OTP簡訊窗口、Email信箱管理、平台商標申請等相關事宜',
        ],
    },
    {
        tab: '馬偕兒童早療中心',
        heading: '馬偕紀念醫院兒童發展暨早期療育評估中心',
        description: 'AI Training專業指導、成效評估、收案',
        coreMembers: [
            '陳慧如 主任醫師',
            '柯信如 主治醫師',
            '林佳柔 主治醫師',
        ],
        members: [
            ['馬光雅', '研究助理'],
            ['張庭瑜', '研究助理'],
            ['曾彥寧', '研究助理'],
        ],
        responsibilities: [
            '協助收案相關事宜',
        ],
    },
    {
        tab: '國衛院-醫療所',
        heading: '國家衛生研究院生醫工程與奈米醫學研究所',
        description: 'AI 語音模組(包含語言詞彙辨識、語句描述辨識)、情緒模組(包含情緒辨識、專注力辨識)開發',
        coreMembers: [
            '吳嘉文 所長',
            '廖倫德 副所長',
            '陳聖夫 協同研究員',
        ],
        members: [
            ['吳俊翰', '科技管理師'],
            ['范藝齡', '研究生(博士班)'],
            ['林顥圃', '研究生(博士班)'],
            ['蔡怡儂', '研究助理'],
            ['陳美茜', '研究助理'],
            ['曾文伶', '研究助理'],
        ],
        responsibilities: [
            '計畫管理',
            '情緒、專注力訓練及分析',
            '語音模組訓練及分析',
            '聯繫窗口',
            '協助收案相關事宜',
        ],
    },
    {
        tab: '北科大-資工所',
        heading: '國立臺北科技大學資訊工程系(所)',
        description: 'AI粗大動作辨識模組(包含大肢體動作、走路步態)、精細動作辨識模組(包含手握筆姿勢、手繪圖)開發',
        coreMembers: [
            '白敦文 教授',
        ],
        members: [
            ['陳勝舢', '研究助理 (博士班)'],
            ['黃乃軒', '研究助理 (碩士級)'],
            ['何柏憲', '研究助理 (碩士班)'],
            ['蔡嘉銨', '研究助理 (碩士班)'],
            ['黃品宥', '研究助理 (碩士班)'],
            ['古雲鄉', '研究助理 (碩士班)'],
            ['楊尹彰', '研究助理 (碩士級)'],
            ['游宗霖', '研究助理 (碩士班)'],
        ],
        responsibilities: [
            '協助計劃執行與行政管理工作',
            '手繪圖型辨識追蹤AI模型開發',
            '走路步態自動辨識AI分析模型開發',
            '大肢體動作自動辨識AI分析模型開發',
        ],
    },
    {
        tab: '北科大-互動所',
        heading: '國立臺北科技大學互動設計系(所)',
        description: 'WETPAINT平台使用者經驗設計、介面設計、互動設計',
        coreMembers: [
            '王聖銘 副教授',
        ],
        members: [
            ['江沁樺', '研究助理 (碩士班)'],
            ['Jastine Joy', '研究助理 (碩士班)'],
            ['張景翔', '研究助理 (碩士班)'],
            ['王禾琪', '研究助理 (碩士班)'],
        ],
        responsibilities: [
            'WETPAINT平台使用者經驗分析與介面設計',
            'WETPAINT平台前端程式開發',
        ],
    },
];

function normalizeText(value) {
    return String(value)
        .replace(/[（]/g, '(')
        .replace(/[）]/g, ')')
        .replace(/\s+/g, ' ')
        .trim();
}

function verifyVisibleText(text, options = {}) {
    const expectedTexts = Array.isArray(text) ? text : [text];
    const rootSelector = options.root || 'body';
    const timeout = options.timeout;
    const getOptions = timeout ? { timeout } : {};
    const normalizedExpectedTexts = expectedTexts
        .flatMap((expectedText) => String(expectedText).split(/\r?\n/))
        .map(normalizeText)
        .filter(Boolean);

    cy.get(rootSelector, getOptions).then(($root) => {
        const root = $root[0];
        const scrollTarget = root === document.body || root === document.documentElement
            ? window
            : root;
        const maxScrollTop = root === document.body || root === document.documentElement
            ? Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight
            : root.scrollHeight - root.clientHeight;
        const step = Math.max(Math.floor(window.innerHeight * 0.75), 400);
        const scrollPositions = [];

        for (let position = 0; position <= maxScrollTop; position += step) {
            scrollPositions.push(position);
        }

        if (!scrollPositions.includes(maxScrollTop)) {
            scrollPositions.push(maxScrollTop);
        }

        let foundMatch;

        return cy.wrap(scrollPositions).each((position) => {
            if (foundMatch) {
                return;
            }

            cy.wrap(scrollTarget).scrollTo(0, position, { ensureScrollable: false });
            cy.wait(50, { log: false }).then(() => {
                const $visibleMatch = Cypress.$($root)
                    .find('*')
                    .filter((_, el) => {
                        const elementText = normalizeText(Cypress.$(el).text());
                        return normalizedExpectedTexts.some((expectedText) => elementText.includes(expectedText))
                            && Cypress.$(el).is(':visible');
                    })
                    .first();

                if ($visibleMatch.length > 0) {
                    foundMatch = $visibleMatch;
                }
            });
        }).then(() => {
            expect(foundMatch?.length || 0, `visible text one of: ${expectedTexts.join(' / ')}`).to.be.greaterThan(0);
            cy.wrap(foundMatch).scrollIntoView().should('be.visible');
        });
    });
}

function verifyAboutFrontPageLoaded() {
    cy.location('pathname', { timeout: 10000 }).should('include', '/about');
    cy.get('main').should('be.visible');
}

function verifyAboutFrontPageCoreBlocks() {
    aboutIntroTexts.forEach((text) => {
        verifyVisibleText(text, { root: 'main' });
    });
}

function verifyAboutTeamSectionsCanSwitch() {
    verifyVisibleText('認識團隊');

    teamSections.forEach(({ tab, heading, description, coreMembers, members, responsibilities }) => {
        cy.contains('button:visible', tab, { timeout: 10000 })
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

        verifyVisibleText(heading, { timeout: 10000 });
        verifyVisibleText(description);
        verifyVisibleText('團隊成員');

        coreMembers.forEach((member) => {
            verifyVisibleText(member);
        });

        members.flat().forEach((text) => {
            verifyVisibleText(text);
        });

        responsibilities.forEach((responsibility) => {
            verifyVisibleText(responsibility);
        });

        verifyVisibleText('聯絡我們');
        verifyVisibleText('wetpaintnhri@gmail.com');
    });
}

function verifyNoEditActionOnFrontPage() {
    cy.get('main').then(($main) => {
        const $actions = $main.find('button:visible, a:visible');
        const $editActions = Cypress.$($actions)
            .filter((_, el) => /edit|編輯/i.test(Cypress.$(el).text().trim()));

        expect($editActions.length, 'front about page should not expose edit actions').to.eq(0);
    });
}

export {
    verifyAboutFrontPageLoaded,
    verifyAboutFrontPageCoreBlocks,
    verifyAboutTeamSectionsCanSwitch,
    verifyNoEditActionOnFrontPage,
};
