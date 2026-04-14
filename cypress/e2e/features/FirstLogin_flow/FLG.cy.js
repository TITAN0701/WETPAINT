import LoginSys from '../../page-objects/Login_flow/LoginWetpaint';
import FLGsys from '../../page-objects/FirstLogin_flow/firstlogin';
import Regsys from '../../page-objects/Register_Account/RegisterAccount';
import FirstPage from '../../page-objects/firstpage_manage/firstpagemanage';

import * as TestFLG001 from './FLG-001';
import * as TestFLG002 from './FLG-002';
import * as TestFLG003 from './FLG-003';
import * as TestRG006 from '../Register_Account/RG-006';
import { buildValidTaiwanId } from '../FrontDesk_flow/FDT_helpers';

describe('First Login flow', () => {
    const flgsys = new FLGsys();
    const loginSys = new LoginSys();
    const regsys = new Regsys();
    const firstPage = new FirstPage();

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.visit('/login');
    });

    describe('Registration setup', () => {
        it('註冊一個新帳號', () => {
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

    describe('FLG-001 首次登入新帳號驗證', () => {
        it('shows the first login guide after login', () => {
            TestRG006.loginWithLatestRegisterAccount({
                beforeLogin: () => {
                    TestFLG001.verifyRequestFirstPagAPI();
                },
            });

            TestFLG001.verifyGetReposnsePageAPI();
            TestFLG001.verifyFirstLoginMessage();
        });
    });

    describe('FLG-002 首次登入帳號並設定孩童資料', () => {
        it('creates user info from the onboarding flow', () => {
            const roleName = '家長';
            const domainName = '動作發展';
            const runId = Date.now().toString().slice(-6);

            const formData = {
                childName: `E2Test${runId}`,
                childBorncity: '臺北市',
                childBornstate: '大安區',
                childselfcode: buildValidTaiwanId('female', `${Date.now()}${runId}`),
                childYeartime: '2024-01-15',
                childGender: '女',
                over37Week: '是',
                childweight: '2500g',
                peopletype: '否',
                sameHomeResidence: true,
            };

            TestRG006.loginWithLatestRegisterAccount({
                beforeLogin: () => {
                    TestFLG002.setupCreateUserInfoInterceptors();
                },
            });

            flgsys.completeOnboardingFromCurrentStep({
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

    describe('FLG-003 進入管理帳號，檢視最新的帳號年齡是否一致', () => {
        it('verifies the child list age matches the birth date from API', () => {
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
