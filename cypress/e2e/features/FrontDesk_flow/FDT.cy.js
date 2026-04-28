import FirstPage from '../../page-objects/firstpage_manage/firstpagemanage';
import FirstPageList from '../../page-objects/frontdesk_manage/firstpagelist';
import MobileFirstPageList from '../../page-objects/frontdesk_manage/firstpagelist_mobile';
import FaqPageList from '../../page-objects/frontdesk_manage/faqpagelist';
import AboutUsList from '../../page-objects/frontdesk_manage/aboutuslist';
import * as TestFDT001 from './FDT-001';
import * as TestFDT002 from './FDT-002';
import * as TestFDT003 from './FDT-003';
import * as TestFDT004 from './FDT-004';
import * as TestFDT005 from './FDT-005';
import {
    buildFDT003ChildData,
    ensureFrontDeskChild,
    sharedChildData,
} from './FDT_helpers';

describe('FrontDesk Flow - 管理者權限', () => {
    const adminPage = new FirstPage();
    const firstPageList = new FirstPageList();
    const faqPageList = new FaqPageList();
    const aboutUsList = new AboutUsList();

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.login(globalThis.administrator_1.account, globalThis.administrator_1.password);
    });

    it('FDT-001 前往前台頁面', () => {
        adminPage.clickOtherPageItem('前往前台');
        TestFDT001.verifyFrontdesklogin();
    });

    it('FDT-002 前往前台後開啟新增檔案視窗', () => {
        ensureFrontDeskChild(adminPage, firstPageList);
        // firstPageList.fillKidsAddFileForm({
        //     childName: '王小明',
        //     childBorncity: '臺北市',
        //     childBornstate: '中正區',
        //     childselfcode: 'A197142732',
        //     childcity: '臺北市',
        //     childstate: '中正區',
        //     childYeartime: '2024-01-01',
        //     childGender: '女',
        //     over37Week: '否',
        //     dueDate: '2024-01-31',
        //     childweight: '<2500g',
        //     peopletype: '否',
        //     sameHomeResidence: true,
        // });
    });

    it('FDT-002 點擊孩童檔案後，要能成功切換發展檢測頁面', () => {
        ensureFrontDeskChild(adminPage, firstPageList).then((childData) => {
            firstPageList.clickChildfileButton(childData.childName);
            firstPageList.getdevelopmentPanel().click();
            TestFDT002.verifyDevelopmentTabLoaded();
        });
    });

    it('FDT-002 點擊孩童檔案後，要能成功切換檢測紀錄頁面', () => {
        adminPage.clickOtherPageItem('前往前台');
        TestFDT001.verifyFrontdesklogin();

        firstPageList.getrecordPanel().click();
        TestFDT002.verifyRecordTabLoaded(3);
        firstPageList.clickrecordButton(0);
        firstPageList.clickrecordButton(1);
        firstPageList.clickrecordButton(2);
    });

    it('FDT-002 點擊孩童檔案後，要能成功切換發展結果與建議頁面', () => {
        adminPage.clickOtherPageItem('前往前台');
        TestFDT001.verifyFrontdesklogin();

        firstPageList.clickadviceButton();
        TestFDT002.verifyAdviceTabLoaded();
        TestFDT002.verifyAdviceResultButtonLoaded();
        TestFDT002.verifyAdviceHistoryButtonLoaded();
        firstPageList.clickadviceResultButton();
        TestFDT002.verifyAdviceSeekMapButtonLoaded();
        // bugs  查看就醫地圖
        // firstPageList.clickSeeKMapButton();
        // 點擊歷史紀錄
        // firstPageList.clickhistoryButton();
    });

    it('FDT-002 點擊孩童檔案後，要能成功切換孩童資料頁面，點擊功能', () => {
        adminPage.clickOtherPageItem('前往前台');
        TestFDT001.verifyFrontdesklogin();

        firstPageList.clickChildfileButton('甲文林');
        firstPageList.clickProfileButton();
        TestFDT002.verifyProfileTabLoaded();
        TestFDT002.verifyProfileText('甲文林');
    });

    it('FDT-003 新增一位孩童資料後，孩童資料內容要與設定值一致', () => {

        adminPage.clickOtherPageItem('前往前台');
        TestFDT001.verifyFrontdesklogin();

        const childData = buildFDT003ChildData();
        // 這邊要先新增資料
        firstPageList.openKidsAddFileDialog();
        TestFDT002.verifyAddFileDialogOpened();
        firstPageList.fillKidsAddFileForm(childData);
        firstPageList.clickCreateFileButton();

        firstPageList.clickChildfileButton(childData.childName);
        firstPageList.clickProfileButton();
        TestFDT002.verifyProfileTabLoaded();
        firstPageList.openEditChildFileDialog();
        TestFDT003.verifyCreateChildInfoIsRight(childData.childName);
        firstPageList.clickEditCancelFileButton();
    });

    it.only('FDT-004 於頁面中找到FAQs的項目並點擊，檢視特定字串', () => {
        adminPage.clickOtherPageItem('前往前台');
        TestFDT001.verifyFrontdesklogin();

        faqPageList.clickFaqButton();
        TestFDT004.verifyFQAMessage();
        TestFDT004.verifyAllFaqAccordions();

        //bugs 
        TestFDT004.verifyContactButtonCanTrigger();
    });

    it('FDT-005 於頁面中找到關於我們的項目並點擊，檢視特定字串', () => {
        adminPage.clickOtherPageItem('前往前台');
        TestFDT001.verifyFrontdesklogin();

        aboutUsList.goToAboutUsPage();
        TestFDT005.verifyAboutFrontPageLoaded();
        TestFDT005.verifyAboutFrontPageCoreBlocks();
        TestFDT005.verifyAboutTeamSectionsCanSwitch();
        TestFDT005.verifyNoEditActionOnFrontPage();
    });
});

describe('FrontDesk Flow - 管理者權限，開始檢測流程  (模擬電腦網頁)', () => {
    const adminPage = new FirstPage();
    const firstPageList = new FirstPageList();

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.login(globalThis.administrator_1.account, globalThis.administrator_1.password);
        adminPage.clickOtherPageItem('前往前台');
    });

    it('FDT-006 AI題組: 直向影片錄製步態拍攝分析 ', () => {
        const questionCount = 37;
        const defaultQuestionAnswer = 'yes';
        const flowActions = [
            { tutorial: 'skip', question: { answer: defaultQuestionAnswer } },
        ];

        firstPageList.clickChildfileButton('okay醬');
        firstPageList.runPendingTestModeFlows(flowActions);
        firstPageList.answerChoiceQuestions(questionCount, defaultQuestionAnswer, 'skip');
    });

    // it('FDT-006 AI題組: 橫向拍攝側面步行動作', () => {

    // })

    // it('FDT-006 AI題組: 嬰幼兒仰躺肢體動作影片拍攝', () => {

    // })

    // it('FDT-006 AI題組: 斜角拍攝孩童握筆動作', () => {

    // })

    // it('FDT-006 AI題組: 拍攝孩童仿畫照片', () => {

    // })

    // it('FDT-006 AI題組: 錄製語音表達與情緒對應素材', () => {

    // })

});


describe('FrontDesk Flow - 家長權限', () => {
    const firstPageList = new FirstPageList();
    const faqPageList = new FaqPageList();
    const aboutUsList = new AboutUsList();

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.login(globalThis.administrator_2.account, globalThis.administrator_2.password);
    });

    it('FDT-001 家長登入前台頁面', () => {
        TestFDT001.verifyFrontdesklogin();
    });

    it('FDT-002 前往前台後開啟新增檔案視窗，成功新增一名孩童檔案', () =>{
        firstPageList.openKidsAddFileDialog();
        TestFDT002.verifyAddFileDialogOpened();
        firstPageList.fillKidsAddFileForm(sharedChildData);
        firstPageList.clickCreateFileButton();
    });

    it('FDT-002 點擊孩童檔案後，要能成功切換發展檢測頁面', () => {
        firstPageList.clickdevelopmentButton('start');
        TestFDT002.verifyDevelopmentTabLoaded();
    });

    it('FDT-002 點擊孩童檔案後，要能成功切換檢測紀錄頁面', () => {
        firstPageList.getrecordPanel().click();
        TestFDT002.verifyRecordTabLoaded(3);
        firstPageList.clickrecordButton(0);
        firstPageList.clickrecordButton(1);
        firstPageList.clickrecordButton(2);
    });

    it('FDT-002 點擊孩童檔案後，要能成功切換發展結果與建議頁面', () => {
        firstPageList.clickadviceButton();
        TestFDT002.verifyAdviceTabLoaded();
        TestFDT002.verifyAdviceResultButtonLoaded();
        TestFDT002.verifyAdviceHistoryButtonLoaded();
        firstPageList.clickadviceResultButton();
        TestFDT002.verifyAdviceSeekMapButtonLoaded();
        // bugs  查看就醫地圖
        // firstPageList.clickSeeKMapButton();
        // 點擊歷史紀錄
        // firstPageList.clickhistoryButton();
    });

    it('FDT-002 點擊孩童檔案後，要能成功切換孩童資料頁面，點擊功能', () => {
        firstPageList.clickChildfileButton('小王');
        firstPageList.clickProfileButton();
        TestFDT002.verifyProfileTabLoaded();
        TestFDT002.verifyProfileText('小王');
    });

    it('FDT-003 新增一位孩童資料後，孩童資料內容要與設定值一致', () => {
        const childData = buildFDT003ChildData();
        // 這邊要先新增資料
        firstPageList.openKidsAddFileDialog();
        TestFDT002.verifyAddFileDialogOpened();
        firstPageList.fillKidsAddFileForm(childData);
        firstPageList.clickCreateFileButton();

        firstPageList.clickChildfileButton('陳小派');
        firstPageList.clickProfileButton();
        TestFDT002.verifyProfileTabLoaded();
        firstPageList.openEditChildFileDialog();
        TestFDT003.verifyCreateChildInfoIsRight('陳小派');
        firstPageList.clickEditCancelFileButton();
    });

    it('FDT-004 於頁面中找到FAQs的項目並點擊，檢視特定字串', () => {
        faqPageList.clickFaqButton();
        TestFDT004.verifyFQAMessage();
        TestFDT004.verifyAllFaqAccordions();

        //bugs 
        TestFDT004.verifyContactButtonCanTrigger();
    });

    it('FDT-005 於頁面中找到關於我們的項目並點擊，檢視特定字串', () => {
        aboutUsList.goToAboutUsPage();
        TestFDT005.verifyAboutFrontPageLoaded();
        TestFDT005.verifyAboutFrontPageCoreBlocks();
        TestFDT005.verifyAboutTeamSectionsCanSwitch();
        TestFDT005.verifyNoEditActionOnFrontPage();
    });

});


describe('FrontDesk Flow - 家長權限，開始檢測流程  (模擬手機)', () => {
    const firstPageList = new MobileFirstPageList();
    const faqPageList = new FaqPageList();
    const aboutUsList = new AboutUsList();

    beforeEach(() => {
        // iphone 12 pro 畫面大小 landscape:橫向, portrait:直向
        // cy.viewport('iphone-xr', 'landscape');
        cy.viewport('iphone-x', 'portrait');
        cy.loginIOS(globalThis.administrator_2.account, globalThis.administrator_2.password);
    });

    // 模擬手機的測試
    it('FDT-006 AI題組: 直向影片錄製步態拍攝分析', () => {
        const questionCount = 37;
        const defaultQuestionAnswer = 'yes';
        const flowActions = [
            { tutorial: 'skip', question: { answer: defaultQuestionAnswer } },
        ];

        //手機擺直向
        firstPageList.clickPhoneChildfileButton('陳小派');
        firstPageList.runMobilePendingTestModeFlows(flowActions);
        firstPageList.runMobileChoiceQuestions(questionCount, defaultQuestionAnswer, 'skip');

    })

    // it('FDT-006 AI題組: 橫向拍攝側面步行動作', () => {

    // })

    // it('FDT-006 AI題組: 嬰幼兒仰躺肢體動作影片拍攝', () => {

    // })

    // it('FDT-006 AI題組: 斜角拍攝孩童握筆動作', () => {

    // })

    // it('FDT-006 AI題組: 拍攝孩童仿畫照片', () => {

    // })

    // it('FDT-006 AI題組: 錄製語音表達與情緒對應素材', () => {

    // })

});
