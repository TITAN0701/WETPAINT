import FrontDeskPage from './frontdeskpage';

const FAQ_TITLES = {
    ResearchDescription: '我的孩子可以加入研究案嗎?',
    AssessmentDescription: '我的孩子參加研究，會如何進行評估施測呢? 會有侵入性治療嗎?',
    ReportDescription: '完成檢測後，可以看到評估報告嗎?',
    LocationDescription: '如果我想參加，施測地點在哪裡? 整個研究過程會花多少時間?',
    OtherDescription: '如果我還有其他問題想問?',
    phonenumber: '聯絡我們',
};

class faqpagelist extends FrontDeskPage {
    constructor() {
        super();
        this.currentFormMode = 'contention';
    }

    goToChildListPage() {
        this.clickFaqButton();
        this.verifyfaqpageListLoaded();
    }

    verifyfaqpageListLoaded() {
        cy.contains('div:visible, h1:visible, h2:visible, span:visible', '常見問題').should('exist');
        cy.contains('button:visible, a:visible', FAQ_TITLES.phonenumber).should('exist');
        cy.contains('button:visible, span:visible', FAQ_TITLES.ResearchDescription).should('exist');
        cy.contains('button:visible, span:visible', FAQ_TITLES.AssessmentDescription).should('exist');
        cy.contains('button:visible, span:visible', FAQ_TITLES.ReportDescription).should('exist');
        cy.contains('button:visible, span:visible', FAQ_TITLES.LocationDescription).should('exist');
        cy.contains('button:visible, span:visible', FAQ_TITLES.OtherDescription).should('exist');
    }

    getTabTitle(type) {
        return FAQ_TITLES[type];
    }

    getMessageButton(type) {
        if (type === 'point1') {
            return cy.contains('button:visible', this.getTabTitle('ResearchDescription'));
        }

        if (type === 'point2') {
            return cy.contains('button:visible', this.getTabTitle('AssessmentDescription'));
        }

        if (type === 'phonecall') {
            return cy.contains('button:visible', this.getTabTitle('phonenumber'));
        }
    }

    clickMessageFirstButton(type) {
        this.getMessageButton(type).click();
    }
}

export default faqpagelist;
