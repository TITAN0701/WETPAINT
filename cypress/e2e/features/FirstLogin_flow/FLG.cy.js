import LoginSys from '../../page-objects/Login_flow/LoginWetpaint';
import FLGsys from '../../page-objects/FirstLogin_flow/firstlogin';
import Regsys from '../../page-objects/Register_Account/RegisterAccount';
import FirstPage from '../../page-objects/firstpage_manage/firstpagemanage';

import * as TestFLG001 from './FLG-001';
import * as TestFLG002 from './FLG-002';
import * as TestFLG003 from './FLG-003';
import * as TestRG006 from '../Register_Account/RG-006';
import { buildChildFormData } from '../FrontDesk_flow/FDT_helpers';

describe('First Login flow', () => {
    const flgsys = new FLGsys();
    const loginSys = new LoginSys();
    const regsys = new Regsys();
    const firstPage = new FirstPage();

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.visit('/login');
    });

    describe('註冊流程', () => {
        it('註冊新帳號', () => {
            const registerName = 'FlgTest12';
            const registerPassword = 'TestPassword123';
            const registerPhone = '0923957635';

            TestRG006.createRegisterInboxWithMailSlurp().then(({ inboxId, emailAddress }) => {
                loginSys.clickRegisterButton();
                regsys.clickRegisterNameinput(registerName);
                regsys.clickRegisterPasswordinput(registerPassword, registerPassword);
                regsys.clickRegisterGenderinput('female');
                regsys.clickRegisterEmailinput(emailAddress);
                regsys.clickRegisterPhoneinput(registerPhone);

                TestRG006.verifysetupsendotpAPI();
                regsys.clickRegisterVerificationCodeInput('email');
                TestRG006.verifyGetEmailotpAPI({ expectedStatusCode: 200 });

                TestRG006.verifyGetRegisterOtpFromMailSlurp(inboxId).then((otp) => {
                    regsys.InputtypeRegisterVerificationCode(otp);
                    regsys.clickAndCheckRegisterButton();
                    regsys.clickAgressCheckButton();
                    regsys.clickConfirmRegisterButton();

                    return TestRG006.saveLatestRegisterAccount({
                        email: emailAddress,
                        phone: registerPhone,
                        loginId: registerPhone,
                        password: registerPassword,
                        inboxId,
                        source: 'mailslurp',
                    });
                });
            });
        });
    });

    describe('FLG-001 首次登入帳號查看頁面訊息', () => {
        it('驗證新使用者登入後的頁面訊息', () => {
            TestRG006.loginWithLatestRegisterAccount({
                beforeLogin: () => {
                    TestFLG001.verifyRequestFirstPagAPI();
                },
            });

            TestFLG001.verifyGetReposnsePageAPI();
            TestFLG001.verifyFirstLoginLandingState(flgsys);
        });
    });

    describe('FLG-002 首次登入帳號並設定孩童資料', () => {
        it('設定孩童檔案', () => {
            const roleName = '家長';
            const domainName = '動作發展';
            const runId = Date.now().toString().slice(-6);

            const baseFormData = buildChildFormData();
            const formData = TestFLG002.buildOnboardingFormData(baseFormData, {
                runId,
            });

            TestRG006.loginWithLatestRegisterAccount({
                beforeLogin: () => {
                    TestFLG002.setupCreateUserInfoInterceptors();
                },
            });

            return flgsys.completeOnboardingFromCurrentStep({
                roleName,
                domainName,
                formData,
                confirmType: 'yes',
                completeType: 'no',
            }).then((result) => {
                if (result?.skipped) {
                    TestFLG002.verifyAlreadyOnHomePage();
                    return;
                }

                TestFLG002.verifyCreateUserInfoSuccess({
                    roleName,
                    domainName,
                    childName: formData.childName,
                    childselfcode: formData.childselfcode,
                });
            });
        });
    });

    describe('FLG-003 驗證孩童年齡與生日 API 一致', () => {
        it('驗證孩童列表年齡與 API 中的生日一致', () => {
            const account = Cypress.env('FLG003_ACCOUNT') || '0999999993';
            const password = Cypress.env('FLG003_PASSWORD') || 'password123';

            loginSys.clickaccountnumber(account);
            loginSys.clickpassword(password);
            TestFLG003.setupChildListAgeApiIntercepts();
            loginSys.clickLoginButton();

            firstPage.clickChildtable();
            TestFLG003.verifyAnyChildAgeMatchesBirthDateFromApi();
        });
    });
});
