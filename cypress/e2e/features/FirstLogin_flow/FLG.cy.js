import LoginSys from '../../page-objects/Login_flow/LoginWetpaint';
import FLGsys from '../../page-objects/FirstLogin_flow/firstlogin';
import Regsys from '../../page-objects/Register_Account/RegisterAccount';
import FirstPage from '../../page-objects/firstpage_manage/firstpagemanage';

import * as TestFLG001 from './FLG-001';
import * as TestFLG002 from './FLG-002';
import * as TestFLG003 from './FLG-003';

describe('First Login flow', () => {
    const flgsys = new FLGsys();
    const loginSys = new LoginSys();
    const regsys = new Regsys();
    const firstPage = new FirstPage();

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.visit('/login');
    });

    describe.skip('帳號註冊流程', () => {
        it('先註冊一個新帳號，後續才能繼續測試首次登入的測試流程', () => {
            loginSys.clickRegisterButton();
            regsys.clickRegisterNameinput('FlgTest1');
            regsys.clickRegisterPasswordinput('TestPassword123', 'TestPassword123');
            regsys.clickRegisterGenderinput('female');
            regsys.clickRegisterEmailinput('p9geepmczk@pxdmail.net');
            regsys.InputtypeRegisterVerificationCode('11111111');
            regsys.clickRegisterPhoneinput('0955545010');
            regsys.clickAndCheckRegisterButton();
            regsys.clickAgressCheckButton();
            regsys.clickConfirmRegisterButton();
        });
    });

    describe.skip('FLG-001 首次登入引導頁', () => {
        it('登入後顯示首次登入導引', () => {
            loginSys.clickaccountnumber('p9geepmczk@pxdmail.net');
            loginSys.clickpassword('TestPassword123');
            TestFLG001.verifyRequestFirstPagAPI();
            loginSys.clickLoginButton();
            TestFLG001.verifyGetReposnsePageAPI();
            TestFLG001.verifyFirstLoginMessage();
        });
    });

    describe('FLG-002 成功建立使用者資訊', () => {
        it('成功建立：使用者身分、孩童分析選項、孩童專屬檔案', () => {
            const roleName = '家長';
            const domainName = '動作發展';
            const runId = Date.now().toString().slice(-6);

            const formData = {
                childName: `E2Test${runId}`,
                childBorncity: '臺北市',
                childBornstate: '大安區',
                childselfcode: `A${Date.now().toString().slice(-9)}`,
                childYeartime: '2024-01-15',
                childGender: '女',
                over37Week: '是',
                childweight: '≥2500g',
                peopletype: '否',
                sameHomeResidence: true,
            };
            //要先創建一個新帳號才能進去做測試
            loginSys.clickaccountnumber('parent@example.com');
            loginSys.clickpassword('password123');
            TestFLG002.setupCreateUserInfoInterceptors();
            loginSys.clickLoginButton();

            flgsys.completeOnboardingFromCurrentStep({
                roleName,
                domainName,
                formData,
                confirmType: 'yes',
                completeType: 'no',
            });

            TestFLG002.verifyCreateUserInfoSuccess({
                roleName,
                domainName,
                childName: formData.childName,
                childselfcode: formData.childselfcode,
            });
        });
    });

    describe.skip('FLG-003 檢查孩童年齡判斷', () => {
        it('用 API 出生日期比對孩童列表年齡', () => {
            const account = Cypress.env('FLG003_ACCOUNT') || '0999999993';
            const password = Cypress.env('FLG003_PASSWORD') || 'password123';

            loginSys.clickaccountnumber(account);
            loginSys.clickpassword(password);
            TestFLG003.setupChildListAgeApiIntercepts();
            loginSys.clickLoginButton();
            //用現在日期計算系統給的年齡並且判斷
            firstPage.clickChildtable();
            TestFLG003.verifyAnyChildAgeMatchesBirthDateFromApi();
        });
    });
});
