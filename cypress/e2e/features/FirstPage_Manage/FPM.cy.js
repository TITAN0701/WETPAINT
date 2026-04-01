import childListPage from '../../page-objects/firstpage_manage/childlist'
import questionListPage from '../../page-objects/firstpage_manage/questionlist'
import Invitelist from '../../page-objects/firstpage_manage/Invitelist'
import FirstPage from '../../page-objects/firstpage_manage/firstpagemanage';
import * as TestFPM001 from './FPM-001'
import * as TestFPM002 from './FPM-002'
import * as TestFPM003 from './FPM-003'
import * as TestFPM004 from './FPM-004'
import * as TestFPM005 from './FPM-005'



describe('First Page Management', () => {
    const firstpage = new FirstPage();
    const childlist = new childListPage();
    const questionlist = new questionListPage();
    const invitelist = new Invitelist();

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.login(globalThis.administrator_1.account,globalThis.administrator_1.password);
    })

    describe('FPM-001 點擊儀表板，檢查首頁字串', () => {
        it('點擊邀請管理後，回到儀表板', () => {
            firstpage.clickInviteButton();
            firstpage.clickDashboardButton();
            TestFPM001.verifyDashboardPageLoaded();
        });
    })

    describe('FPM-002 點擊孩童列表，檢查孩童列表字串', () => {
        it('使用者登入頁面後找到孩童列表，並點擊進入該頁面', () => {
            firstpage.clickChildtable();
            TestFPM002.verifychildlistMessage();
        })

        it('使用者登入頁面後找到孩童列表，並檢查篩選器功能', () => {
            firstpage.clickChildtable();
            childlist.clickFilterButton('臺北市', '南港區', '發展正常');
            TestFPM002.verifychildlistfilterMessage('臺北市', '南港區', '發展正常');
            childlist.clickfilterConfirm('yes');
        })

        it('使用者登入頁面後找到孩童列表，並檢查預覽功能', () => {
            firstpage.clickChildtable();
            childlist.clickFirstRowViewButton(1);
            TestFPM002.verifyRowViewButtonMessage();
            childlist.clickChildInfoButton();
            // TestFPM002.verifychildInfoMessage('孩童姓名', '123');
            //bugs
            
            //bugs 孩童列表 > 檢測結果 --> 還沒處理，沒有任何資料
            childlist.clickChildSuggestButton();
            childlist.clickCheckResultButton(0);
            TestFPM002.verifyCheckResultButtonMessage();
        })

        it('使用者登入頁面後找到孩童列表，並檢查返回功能', () => {
            firstpage.clickChildtable();
            TestFPM002.verifyUpdatePage();
            childlist.clickFirstRowViewButton(2);
            TestFPM002.verifyRequestUpdatePage();
            childlist.clickChildlistReturnButton();

            TestFPM002.verifyUpdatePage();
            childlist.clickFirstRowViewButton(3);
            TestFPM002.verifyRequestUpdatePage();
            childlist.clickChildSuggestButton();
            childlist.clickCheckResultButton(1);
            childlist.clickChildlistReturnButton();
        })

        //bugs 前端後端不一致
        it('使用者登入頁面後找到孩童列表，並檢查刪除功能', () => {
            firstpage.clickChildtable();
            // childlist.clickFirstRowDeleteButton('anyany', 'yes');
            childlist.clickBackendButton('前往前台');
            TestFPM002.verifyDeleteChildInfo('A105200234', null, null, 'not.exist');
            // TestFPM002.verifyDeleteChildInfo('A105200234', 'anyay', '出生日期：2026/01/27');
        })
    })
    describe('FPM-003 檢查題目管理', () => {
        it('使用者登入頁面後找到題目管理，並點擊進入該頁面', () => {
            firstpage.clickQuestionButton();
        })

        it('於頁面點擊 觀察題組，並檢查特定文字', () => {
            firstpage.clickQuestionButton();
            questionlist.clickCheckQuestionfilter('粗大動作', '是', '4');
            questionlist.clickfilterConfirmButton('yes');
            TestFPM003.verifyCheckQuestionfunction(0,'孩子直立被抱著時，孩子的頭可以穩定直立 (仍會搖搖晃晃則不算是)');
            TestFPM003.verifyCheckQuestionfunction(1,'粗大動作');
            TestFPM003.verifyCheckQuestionfunction(2,'4 個月');
            questionlist.clickDeletefitlerDetail();

            questionlist.clickCheckQuestionfilter('粗大動作', '是', '6');
            questionlist.selectFilterDropdown('施測年齡（月）', 9);
            questionlist.clickfilterConfirmButton('yes');
            TestFPM003.verifyCheckQuestionfunction(0,'孩子無法自己坐穩數分鐘， 仍須雙手撐地面');
            TestFPM003.verifyCheckQuestionfunction(1,'粗大動作');
            TestFPM003.verifyCheckQuestionfunction(2,'9 個月');
            questionlist.clickDeletefitlerDetail();

            questionlist.clickCheckQuestionfilter('粗大動作', '是', '12');
            questionlist.clickfilterConfirmButton('yes');
            TestFPM003.verifyCheckQuestionfunction(0,'孩子可以自己放手站，至少五秒鐘以上');
            TestFPM003.verifyCheckQuestionfunction(1,'粗大動作');
            TestFPM003.verifyCheckQuestionfunction(2,'12 個月');
            questionlist.clickDeletefitlerDetail();
        })

        it('於頁面點擊 圖卡識別，並檢查特定文字', () => {
            firstpage.clickQuestionButton();
            questionlist.clickQuestionPageSelect('圖卡識別');
            TestFPM003.verifyCheckImagePagefunction(0, '辨識：小狗');
            TestFPM003.verifyCheckImagePagefunction(1, /^\d+(?:\s*[-,]\s*\d+)?(?:\s*歲)?$/);

        })

        it('於頁面點擊 圖卡配對，並檢查特定文字', () => {
            firstpage.clickQuestionButton();
            questionlist.clickQuestionPageSelect('圖卡配對');
            TestFPM003.veriifyCheckImagePageApply(0, '配對：形狀 A');
            TestFPM003.veriifyCheckImagePageApply(1, /^\d+(?:\s*[-,]\s*\d+)?(?:\s*歲)?$/);
        })

        it('於頁面點擊 AI題組，並檢查特定文字', () => {
            firstpage.clickQuestionButton();
            questionlist.clickQuestionPageSelect('AI題組');
            TestFPM003.verifyCheckAIQuestionPage(0, 'AI：發音評估');
            TestFPM003.verifyCheckAIQuestionPage(1, /^\d+(?:\s*[-,]\s*\d+)?(?:\s*歲)?$/);
        })
    })

    describe('FPM-004 檢查邀請管理', () => {
        it('使用者登入頁面後找到邀請管理，並點數字分頁功能', () => {
            firstpage.clickInviteButton();
            invitelist.NumberPageInviteManageMent(2);
            TestFPM004.verifyInviteManagementMessage('19', '李美華', '機構', '臺大醫院', 10);
            invitelist.NumberPageInviteManageMent(3);
            TestFPM004.verifyInviteManagementMessage('15', '劉建宏', '管理者', '臺大醫院', 10);
            invitelist.NumberPageInviteManageMent(1);
            TestFPM004.verifyInviteManagementMessage('20', '張大同', '管理者', '臺大醫院', 10);

        });

        it('使用者登入頁面後找到邀請管理，並且使用產生邀請連結的功能', () => {
            firstpage.clickInviteButton();
            TestFPM004.verifyInviteManagementShareLink();
            invitelist.clickIniteLinkShareButton('1 天', '1 次', '家長');
            TestFPM004.verifyInviteCopyNotTriggeredYet();
            invitelist.clickCopyInviteLinkButton();
            TestFPM004.verifyInviteManageGetlink();
        });

        //目前題數最多到25
        it('使用者登入頁面後找到邀請管理，並點下拉選單分頁功能', () => {
            firstpage.clickInviteButton();
            invitelist.SelectDropdownInviteManage(10);
            TestFPM004.verifyInviteManagementMessage('20', '張大同', '管理者', '臺大醫院', 10);
            invitelist.SelectDropdownInviteManage(20);
            TestFPM004.verifyInviteManagementMessage('20', '張大同', '管理者', '臺大醫院', 20);
            // invitelist.SelectDropdownInviteManage(50);
            // TestFPM004.verifyInviteManagementMessage('20', '張大同', '管理者', '臺大醫院', 50);
            // invitelist.SelectDropdownInviteManage(100);
            // invitelist.SelectDropdownInviteManage(5);
        });


        it('於邀請管理頁面中，點擊篩選器，並檢查底下的表格字串', () => {
            firstpage.clickInviteButton();
            invitelist.clickFilterButton('由新到舊', '機構');
            invitelist.clickfilterConfirm('yes');
            TestFPM004.verifyInviteManagementMessage('14', '黃雅婷', '機構', '臺大醫院', 6);

            invitelist.clickFilterButton('由舊到新', '機構');
            invitelist.clickfilterConfirm('yes');
            TestFPM004.verifyInviteManagementMessage('4', '林志成', '機構', '臺大醫院', 6);

            invitelist.clickFilterButton('由新到舊', '操作人員');
            invitelist.clickfilterConfirm('yes');
            TestFPM004.verifyInviteManagementMessage('13', '林志成', '操作員', '臺大醫院', 6);

            invitelist.clickFilterButton('由舊到新', '操作人員');
            invitelist.clickfilterConfirm('yes');
            TestFPM004.verifyInviteManagementMessage('28', '李美華', '操作員', '臺大醫院', 6);

            invitelist.clickFilterButton('由新到舊', '局處');
            invitelist.clickfilterConfirm('yes');
            TestFPM004.verifyInviteManagementMessage('2', '張大同', '衛生局', '臺大醫院', 6);

            invitelist.clickFilterButton('由舊到新', '局處');
            invitelist.clickfilterConfirm('yes');
            TestFPM004.verifyInviteManagementMessage('17', '鄭文傑', '衛生局', '臺大醫院', 6);

            invitelist.clickFilterButton('由新到舊', '管理者');
            invitelist.clickfilterConfirm('yes');
            TestFPM004.verifyInviteManagementMessage('10', '李美華', '管理者', '臺大醫院', 6);

            invitelist.clickFilterButton('由舊到新', '管理者');
            invitelist.clickfilterConfirm('yes');
            TestFPM004.verifyInviteManagementMessage('15', '劉建宏', '管理者', '臺大醫院', 6);

            invitelist.clickFilterButton('由新到舊', '家長');
            invitelist.clickfilterConfirm('yes');
            TestFPM004.verifyInviteManagementMessage('26', '鄭文傑', '家長', '臺大醫院', 6);


            invitelist.clickFilterButton('由舊到新', '家長');
            invitelist.clickfilterConfirm('yes');
            TestFPM004.verifyInviteManagementMessage('1', '李美華', '家長', '臺大醫院', 6);
        })

    })
    describe('FPM-005 檢查關於我們', () => {
        it('使用者登入頁面後找到關於我們，並點擊進入該頁面', () => {
            firstpage.clickAboutWeButton();
            TestFPM005.verifyAboutPageLoaded();
            TestFPM005.verifyAboutPageCoreBlocks();
        })

        it('使用者可開啟並關閉關於我們編輯視窗', () => {
            firstpage.clickAboutWeButton();
            TestFPM005.verifyAboutEditDialogCanOpenAndClose();
        })
    })

})

