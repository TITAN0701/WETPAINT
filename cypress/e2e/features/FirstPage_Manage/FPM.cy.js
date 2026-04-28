import childListPage from '../../page-objects/firstpage_manage/childlist'
import questionListPage from '../../page-objects/firstpage_manage/questionlist'
import Invitelist from '../../page-objects/firstpage_manage/Invitelist'
import FirstPage from '../../page-objects/firstpage_manage/firstpagemanage';
import * as TestFPM001 from './FPM-001'
import * as TestFPM002 from './FPM-002'
import * as TestFPM003 from './FPM-003'
import * as TestFPM004 from './FPM-004'
import * as TestFPM005 from './FPM-005'

const hasNumericQuery = (value, key) => {
    expect(value, `${key} query`).to.match(/^\d+$/);
};

const hasBooleanQuery = (value, key) => {
    expect(value, `${key} query`).to.match(/^(true|false)$/);
};

const hasNonEmptyQuery = (value, key) => {
    expect(value, `${key} query`).to.be.a('string').and.not.be.empty;
};

const ifQueryPresent = (assertion) => (value, key) => {
    if (value === null || value === undefined || value === '') {
        return;
    }

    assertion(value, key);
};

const matchesSelectedNumber = (selectedValue) => (value, key) => {
    const matchedNumber = String(selectedValue).match(/\d+/)?.[0];
    expect(matchedNumber, `${key} selected number`).to.exist;
    expect(value, `${key} query`).to.eq(matchedNumber);
};

const matchesSelectedDate = (selectedDate) => (value, key) => {
    expect(value, `${key} query`).to.be.a('string').and.include(`${selectedDate}T`);
};

describe('First Page Management', () => {
    const firstpage = new FirstPage();
    const childlist = new childListPage();
    const questionlist = new questionListPage();
    const invitelist = new Invitelist();
    let filterScenarios;

    before(() => {
        cy.fixture('first_page_manage/fpm002_filters').then((data) => {
            filterScenarios = data;
        });
    });

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
            TestFPM002.setupChildListApiIntercept();
            firstpage.clickChildtable();
            TestFPM002.verifychildlistMessage();
            TestFPM002.verifyChildListApiResponse({
                requiredQueryKeys: ['PageIndex', 'PageSize'],
                expectHasData: true,
            });
        })

        it('使用者登入頁面後找到孩童列表，並檢查篩選器功能（有資料：地區）', () => {
            const withDataFilters = filterScenarios.withData;

            firstpage.clickChildtable();
            TestFPM002.setupChildListApiIntercept('GetFilteredChildListAPI');
            childlist.clickFilterButton(withDataFilters);
            childlist.clickfilterConfirm('yes');
            TestFPM002.verifyChildListApiResponse({
                alias: 'GetFilteredChildListAPI',
                requiredQueryKeys: ['PageIndex', 'PageSize'],
                expectHasData: true,
            }).then(({ items }) => {
                TestFPM002.verifyFilterChips([withDataFilters.city, withDataFilters.district]);
                TestFPM002.verifyChildListFirstRowMatchesItem(items[0], {
                    expectedTexts: [withDataFilters.city, withDataFilters.district],
                });
            });
        })

        it('使用者登入頁面後找到孩童列表，並檢查篩選器功能（空資料：完整條件）', () => {
            const noDataFilters = filterScenarios.noData;

            firstpage.clickChildtable();
            TestFPM002.setupChildListApiIntercept('GetEmptyFilteredChildListAPI');
            childlist.clickFilterButton(noDataFilters);
            childlist.clickfilterConfirm('yes');
            TestFPM002.verifyChildListApiResponse({
                alias: 'GetEmptyFilteredChildListAPI',
                requiredQueryKeys: [
                    'PageIndex',
                    'PageSize',
                ],
                query: {
                    AgeMonths: ifQueryPresent(matchesSelectedNumber(noDataFilters.ageMonths)),
                    IsPremature: ifQueryPresent(hasBooleanQuery),
                    CityCode: ifQueryPresent(hasNumericQuery),
                    DistCode: ifQueryPresent(hasNumericQuery),
                    QuizDateFrom: ifQueryPresent(matchesSelectedDate(noDataFilters.quizDateFrom)),
                    QuizDateTo: ifQueryPresent(matchesSelectedDate(noDataFilters.quizDateTo)),
                    AssessmentResult: ifQueryPresent(hasNonEmptyQuery),
                    QuizStatus: ifQueryPresent(hasNonEmptyQuery),
                },
            }).then(({ items }) => {
                if (items.length === 0) {
                    TestFPM002.verifyNoDataState();
                } else {
                    expect(items.length, 'items length').to.be.greaterThan(0);
                }
            });
            TestFPM002.verifyFilterChips([
                noDataFilters.gender,
                noDataFilters.ageMonths.match(/\d+/)?.[0],
                noDataFilters.isPremature,
                noDataFilters.city,
                noDataFilters.district,
                noDataFilters.quizDateFrom,
                noDataFilters.quizDateTo,
                noDataFilters.assessmentResult,
                noDataFilters.quizStatus,
            ]);
        })

        it('使用者登入頁面後找到孩童列表，並檢查預覽功能', () => {
            firstpage.clickChildtable();
            childlist.clickFirstRowViewButton(1);
            TestFPM002.verifyRowViewButtonMessage();
            childlist.clickChildInfoButton();
            TestFPM002.verifychildInfoMessage('孩童姓名', '187');
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
            childlist.clickFirstRowViewButton(3);
            TestFPM002.verifyRequestUpdatePage();
            childlist.clickChildSuggestButton();

            childlist.clickChildlistReturnButton();
            childlist.clickFirstRowViewButton(1);
            TestFPM002.verifyRequestUpdatePage();
            childlist.clickChildSuggestButton();
            
        })

        it('使用者登入頁面後找到孩童列表，並檢查刪除功能', () => {
            firstpage.clickChildtable();
            childlist.clickFirstRowDeleteButton('APAP', 'yes');
            childlist.clickBackendButton('前往前台');
            TestFPM002.verifyDeleteChildInfo(null, null, null, 'not.exist');
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
            TestFPM003.verifyCellIsNotEmpty(0, 5);
            TestFPM003.verifyCellIsNotEmpty(1, 5);
            TestFPM003.verifyCheckQuestionfunction(2, /^\d+\s*個月$/);
            TestFPM003.verifyCheckQuestionfunction(3,'是');
            questionlist.clickDeletefitlerDetail();

            questionlist.clickCheckQuestionfilter('粗大動作', '是', '9');
            questionlist.clickfilterConfirmButton('yes');
            TestFPM003.verifyCellIsNotEmpty(0, 5);
            TestFPM003.verifyCellIsNotEmpty(1, 5);
            TestFPM003.verifyCheckQuestionfunction(2, /^\d+\s*個月$/);
            TestFPM003.verifyCheckQuestionfunction(3,'是');
            questionlist.clickDeletefitlerDetail();

            questionlist.clickCheckQuestionfilter('粗大動作', '是', '12');
            questionlist.clickfilterConfirmButton('yes');
            TestFPM003.verifyCellIsNotEmpty(0, 5);
            TestFPM003.verifyCellIsNotEmpty(1, 5);
            TestFPM003.verifyCheckQuestionfunction(2, /^\d+\s*個月$/);
            TestFPM003.verifyCheckQuestionfunction(3,'是');
            questionlist.clickDeletefitlerDetail();
        })

        it('於頁面點擊 圖卡辨識，並檢查特定文字', () => {
            firstpage.clickQuestionButton();
            questionlist.clickQuestionPageSelect('圖卡辨識');
            TestFPM003.verifyCellIsNotEmpty(0, 3);
            TestFPM003.verifyCheckImagePagefunction(1, /^\d+(?:\s*[-,]\s*\d+)?(?:\s*歲)?$/);
            TestFPM003.verifyRowActionButtons(0, 2);

        })

        it('於頁面點擊 圖卡配對，並檢查特定文字', () => {
            firstpage.clickQuestionButton();
            questionlist.clickQuestionPageSelect('圖卡配對');
            TestFPM003.verifyCellIsNotEmpty(0, 4);
            TestFPM003.verifyCellIsNotEmpty(1, 4);
            TestFPM003.veriifyCheckImagePageApply(2, /^\d+(?:\s*[-,]\s*\d+)?(?:\s*(?:歲|個月))$/);
            TestFPM003.verifyRowActionButtons(0, 2);
        })

        it('於頁面點擊 AI題組，並檢查特定文字', () => {
            firstpage.clickQuestionButton();
            questionlist.clickQuestionPageSelect('AI題組');
            TestFPM003.verifyCellIsNotEmpty(0, 4);
            TestFPM003.verifyCheckAIQuestionPage(1, /^\d+(?:\s*[-,]\s*\d+)?(?:\s*(?:歲|個月))$/);
            TestFPM003.verifyRowActionButtons(0, 2);
        })
    })

    describe('FPM-004 檢查邀請管理', () => {
        it('使用者登入頁面後找到邀請管理，並點數字分頁功能', () => {
            firstpage.clickInviteButton();
            invitelist.verifyInvitePageLoaded();
            TestFPM004.verifyInviteTableStructure();
            TestFPM004.verifyInviteFirstRowActionButtons(3);
        });

        it.skip('使用者登入頁面後找到邀請管理，並且使用產生邀請連結的功能', () => {
            firstpage.clickInviteButton();
            TestFPM004.verifyInviteManagementShareLink();
            invitelist.clickIniteLinkShareButton('1 天', '1 次', '家長');
            TestFPM004.verifyInviteCopyNotTriggeredYet();
            invitelist.clickCopyInviteLinkButton();
            TestFPM004.verifyInviteManageGetlink();
        });

        it('使用者登入頁面後找到邀請管理，並點下拉選單分頁功能', () => {
            firstpage.clickInviteButton();
            invitelist.SelectDropdownInviteManage(10);
            TestFPM004.verifyInvitePageSizeValue(10);
            TestFPM004.verifyInviteRowCountAtMost(10);
            invitelist.SelectDropdownInviteManage(20);
            TestFPM004.verifyInvitePageSizeValue(20);
            TestFPM004.verifyInviteRowCountAtMost(20);
            invitelist.SelectDropdownInviteManage(100);
            TestFPM004.verifyInvitePageSizeValue(100);
        });


        it('於邀請管理頁面中，點擊篩選器，並檢查底下的表格字串', () => {
            firstpage.clickInviteButton();
            invitelist.clickFilterButton('由新到舊', '前台註冊');
            invitelist.clickfilterConfirm('yes');
            invitelist.searchRandomKnownAccountCode('inviteSearchCode');
            TestFPM004.verifyInviteSearchResultMatchesAlias('inviteSearchCode');
            TestFPM004.verifyInviteFirstRowActionButtons(3);
        })

    })
    describe.only('FPM-005 檢查關於我們', () => {
        it('使用者登入頁面後找到關於我們，並點擊進入該頁面', () => {
            firstpage.clickAboutWeButton();
            TestFPM005.verifyAboutPageLoaded();
            TestFPM005.verifyAboutPageCoreBlocks();
        })

        it('使用者可開啟關於我們編輯視窗，驗證所有文字並關閉', () => {
            firstpage.clickAboutWeButton();
            TestFPM005.verifyAboutEditDialogCanOpenAndClose();
        })
    })

})

