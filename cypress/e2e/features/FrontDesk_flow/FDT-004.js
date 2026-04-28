const FAQ_TITLE = '常見問題';
const CONTACT_BUTTON = '聯絡我們';

const faqItems = [
    {
        question: '我的孩子可以加入研究案嗎?',
        answerTexts: [
            '我們邀請「滿2個月-未滿6歲」的孩童，若您的孩子符合此年齡，非常歡迎您加入此研究唷!',
        ],
    },
    {
        question: '我的孩子參加研究，會如何進行評估施測呢? 會有侵入性治療嗎?',
        answerTexts: [
            '過程中將會使用ipad，利用我們開發的線上評估系統，會有像問卷的方式詢問家長關於小孩的發展問題，也會有題目讓小孩實際去做來評估孩子在『粗大動作、精細動作、語言理解、語言表達、認知及社會情緒』發展的狀況，還會錄製一段孩子『動作跟語音』的影片去訓練AI做分析，所以請您放心，不會有任何侵入性治療或是在孩子身上安裝設備唷!',
        ],
    },
    {
        question: '完成檢測後，可以看到評估報告嗎?',
        answerTexts: [
            '可以，在您孩子完成所有檢測後，馬上就能於平台上看到報告結果。若檢測報告顯示孩子異常的狀況，請您帶著您的孩子透過官方LINE提供的門診服務進行門診預約唷!',
        ],
    },
    {
        question: '如果我想參加，施測地點在哪裡? 整個研究過程會花多少時間?',
        answerTexts: [
            '施測時間共約『1小時』，地點依您目前所在地來安排，地點請參考以下:',
            '地點',
            '時間',
            '台北:馬偕兒童醫院',
            '週一至週五',
            '09:00-11:00 / 13:00-15:00',
            '新竹:新竹市立馬偕兒童醫院',
            '週三、週四',
            '13:30-15:00',
            '週六',
            '09:00-11:00',
            '苗栗:各鄉鎮衛生所',
            '非固定時間，請於LINE上詢問',
        ],
    },
    {
        question: '如果我還有其他問題想問?',
        answerTexts: [
            '若有其他問題想問，可以直接於LINE上做提問，會有專人為您解答。',
        ],
    },
];

function getFaqTriggers() {
    return cy.get('[id^="reka-accordion-trigger-"]:visible, button[aria-controls]:visible');
}

function getContactButton() {
    return cy.contains('button:visible, a:visible', CONTACT_BUTTON);
}

function verifyFQAMessage() {
    cy.location('pathname', { timeout: 10000 }).should('include', '/faqs');
    cy.contains('div:visible, h1:visible, h2:visible, span:visible', FAQ_TITLE).should('exist');
    getContactButton().should('be.visible');

    faqItems.forEach(({ question }) => {
        cy.contains('button:visible, span:visible', question).should('be.visible');
    });

    getFaqTriggers().its('length').should('be.gte', faqItems.length);
}

function verifyAccordionCanTrigger(index, questionText, answerTexts = []) {
    getFaqTriggers().eq(index).as('faqTrigger');

    cy.get('@faqTrigger')
        .should('be.visible')
        .and('contain.text', questionText)
        .then(($trigger) => {
            const contentId = $trigger.attr('aria-controls');
            const $content = contentId ? Cypress.$(`#${contentId}`) : Cypress.$();
            const isOpen = $trigger.attr('aria-expanded') === 'true'
                || $trigger.attr('data-state') === 'open'
                || $content.attr('data-state') === 'open'
                || $content.is(':visible');

            if (!isOpen) {
                cy.wrap($trigger).click({ force: true });
            }
        });

    answerTexts.forEach((text) => {
        cy.contains(String(text), { timeout: 10000 })
            .scrollIntoView()
            .should('be.visible');
    });
}

function verifyAllFaqAccordions() {
    faqItems.forEach(({ question, answerTexts }, index) => {
        verifyAccordionCanTrigger(index, question, answerTexts);
    });
}

function verifyContactButtonCanTrigger() {
    getContactButton()
        .should('be.visible')
        .and(($button) => {
            expect($button.is(':disabled'), 'contact button disabled').to.eq(false);
        })
        .click({ force: true });
}

export {
    verifyFQAMessage,
    verifyAccordionCanTrigger,
    verifyAllFaqAccordions,
    verifyContactButtonCanTrigger,
};
