import firstpagemanage from './firstpagemanage';


class aboutuslist extends firstpagemanage{
    goToChildListPage() {
        this.clickAboutWeButton();
        this.verifyAboutWeButtonListPageLoaded();
    }

    verifyAboutWeButtonListPageLoaded() {
        cy.contains('div:visible', '關於我們').should('be.visible');
        cy.contains('button:visible', '編輯').should('be.visible');
    }

    clickEditButton(introductype, confirmButton){
        cy.contains('button', '編輯').click();
        cy.contains('h2:visible', '編輯關於我們').closest('div.items-center').should('exist');
        switch(introductype){
            case '本站介紹':
                cy.contains('button:visible', ' 本站介紹 ').should('exist').click();
                cy.contains('label:visible', '本站介紹').should('be.visible');
                cy.contains('label:visible', '特色區塊標題').should('be.visible');
                cy.contains('label:visible', '特色項目').should('be.visible');
                cy.contains('label:visible', '特色區塊圖片').should('be.visible');
                cy.contains('button:visible', ' 新增項目 ').scrollTo('bottom').should('be.visible');
                
                cy.contains('label:visible', '合作單位說明').scrollTo('bottom').should('be.visible');
                cy.contains('label:visible', '合作單位 Logo（最少 1 張，最多 10 張）').scrollTo('bottom').should('be.visible');
                cy.contains('button:visible', ' 新增合作單位 ').scrollTo('bottom').should('be.visible');
                break;
            case '認識團隊':
                cy.contains('button:visible', ' 認識團隊 ').should('exist').click();
                cy.contains('label:visible', '部門管理').should('be.visible');
                cy.contains('button:visible', ' 新增部門 ').should('be.visible');

                cy.contains('label:visible', '基本資訊').should('be.visible');
                cy.contains('label:visible', '職責說明').should('be.visible');

                cy.contains('label:visible', '核心成員').should('be.visible');
                cy.contains('button:visible', ' 新增核心成員 ').scrollTo('bottom').should('be.visible');

                cy.contains('label:visible', '團隊成員').scrollTo('bottom').should('be.visible');
                cy.contains('button:visible', ' 新增團隊成員 ').scrollTo('bottom').should('be.visible');
                break;
        }

        if(confirmButton === 'yes'){
            cy.contains('button', ' 確認 ').click();
        }else{
            cy.contains('button', ' 取消 ').click();
        }
    }

}

export default aboutuslist;
