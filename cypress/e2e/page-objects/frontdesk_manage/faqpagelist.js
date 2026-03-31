import FrontDeskPage from './frontdeskpage';

class faqpagelist extends FrontDeskPage{
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
        cy.contains('button:visible, span:visible', ' 聯絡我們 ').should('exist');
        cy.contains('button:visible, span:visible', '我的孩子可以加入研究案嗎?').should('exist');
        cy.contains('button:visible, span:visible', '我的孩子參加研究，會如何進行評估施測呢? 會有侵入性治療嗎?').should('exist');
        cy.contains('button:visible, span:visible', '我的孩子參加研究，會如何進行評估施測呢? 會有侵入性治療嗎?').should('exist');
    }

    getTabTitle(type){
        const titles ={
            ResearchDescription: '我的孩子可以加入研究案嗎?',
            OtherDescription: '我的孩子參加研究，會如何進行評估施測呢? 會有侵入性治療嗎?',
            phonenumber: ' 聯絡我們 ',
        };
        return titles[type];
    }

    getMessageButton(type){
        if(type === 'point1'){
            return cy.contains('button:visible', this.getTabTitle('ResearchDescription'));
        }

        if(type === 'point2'){
            return cy.contains('button:visible', this.getTabTitle('OtherDescription'));
        }

        if(type === 'phonecall'){
            return cy.contains('button:visible', this.getTabTitle('phonenumber'));
        }
    }

    clickMessageFirstButton(type){
        this.getMessageButton(type).click();
    }

}

export default faqpagelist;
