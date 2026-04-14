import LoginSys from '../../page-objects/Login_flow/LoginWetpaint';
import * as TestLG001 from './LG-001';
import * as TestLG002 from './LG-002';
import * as TestLG003 from './LG-003';
import * as TestLG004 from './LG-004';
import * as TestLG005 from './LG-005';

describe('Login flow', () => {
    const loginSys = new LoginSys();

    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.visit('/login');
    });

    describe('LG-.001 驗證輸入帳號', () => {
        it('使用者能成功登入網頁，找到帳號欄位並輸入資訊 (手機)', () => {
            loginSys.clickaccountnumber('0999999993');
            loginSys.clickpassword('password123');
            TestLG001.verifyLoginPageAccountPasswdInput('0999999993');
        });

        it('驗證帳號輸入錯誤時的錯誤訊息 (手機)', () => {
            loginSys.clickaccountnumber('0999999994');
            loginSys.clickpassword('password123');
            TestLG001.verifyLoginPageAccountError();
        });

        it('使用者能成功登入網頁，找到帳號欄位並輸入資訊 (電子信箱)', () => {
            loginSys.clickaccountnumber('admin@example.com');
            loginSys.clickpassword('password123');
            TestLG001.verifyLoginPageAccountPasswdInput('admin@example.com');
        });

        it('驗證帳號輸入錯誤時的錯誤訊息 (電子信箱)', () => {
            loginSys.clickaccountnumber('admin@example.co');
            loginSys.clickpassword('password123');
            TestLG001.verifyLoginPageAccountError();
        });
    });

    describe('LG-002 驗證輸入密碼', () => {
        it('使用者能成功登入網頁，找到密碼欄位並輸入資訊 (電子信箱)', () => {
            loginSys.clickaccountnumber('admin@example.com');
            loginSys.clickpassword('password123');
            TestLG002.verifyPasswdInputFunction('password123');
        });

        it('驗證密碼輸入錯誤時的錯誤訊息 (電子信箱)', () => {
            loginSys.clickaccountnumber('admin@example.com');
            loginSys.clickpassword('wrongpassword');
            TestLG002.verifyLoginPageAccountError();
        });

        it('使用者能成功登入網頁，找到密碼欄位並輸入資訊 (手機)', () => {
            loginSys.clickaccountnumber('0999999993');
            loginSys.clickpassword('password123');
            TestLG002.verifyPasswdInputFunction('password123');
        });

        it('驗證密碼輸入錯誤時的錯誤訊息 (手機)', () => {
            loginSys.clickaccountnumber('0999999993');
            loginSys.clickpassword('wrongpassword');
            TestLG002.verifyLoginPageAccountError();
        });
    });

    describe('LG-003 驗證密碼預覽功能', () => {
        it('點擊預覽要能成功看到被隱藏的密碼', () => {
            loginSys.clickpassword('password123');
            loginSys.clickPreviewButton();
            TestLG003.verifyPasswdPreviewFunction();
            TestLG003.verifyPasswdPreviewClickOk('password123');
        });

        it('檢查密碼輸入時的狀態為隱藏', () => {
            loginSys.clickpassword('password123');
            loginSys.clickPreviewButton();
            TestLG003.verifyPasswdPreviewFunction();
            loginSys.clickPreviewButton();
            TestLG003.verifyPasswdPreviewClickIsDisable();
        });
    });

    describe('LG-004 驗證登入成功登入帳號', () => {
        it('點擊登入按鈕，登入成功要能接收api回傳', () => {
            loginSys.clickaccountnumber('0999999993');
            loginSys.clickpassword('password123');
            TestLG004.verifyLoginPageAccountAPI();
            loginSys.clickLoginButton();
            TestLG004.verifyLoginPageAccountAPIRequest('0999999993', 'password123');
        });
    });

    describe.skip('LG-005 驗證忘記密碼功能 (success)', () => {
        let forgotPasswordAccount;

        before(() => {
            return TestLG005.prepareForgotPasswordAccount({ forceCreate: false }).then((account) => {
                forgotPasswordAccount = account;
            });
        });

        it('驗證信箱接收是否有成功回傳', () => {
            TestLG004.verifyLoginPageAccountAPI();
            loginSys.clickaccountnumber(forgotPasswordAccount.loginId);
            loginSys.clickpassword(forgotPasswordAccount.password);
            loginSys.clickLoginButton();
            TestLG004.verifyLoginPageAccountAPIRequest(
                forgotPasswordAccount.loginId,
                forgotPasswordAccount.password
            );

            cy.clearCookies();
            cy.clearLocalStorage();
            cy.window().then((win) => {
                win.sessionStorage.clear();
            });
            cy.visit('/login');
            cy.location('pathname').should('include', '/login');

            return TestLG005.runForgotPasswordSuccessFlow(
                loginSys,
                () => TestLG004.verifyLoginPageAccountAPI(),
                forgotPasswordAccount
            );
        });
    });

    describe.only('LG-005 驗證忘記密碼功能 (invalid-email)', () => {
        it('點擊忘記密碼按鈕，應該要跳轉到忘記密碼頁面 (錯誤格式的email)', () => {
            TestLG005.runForgotPasswordInvalidEmailFlow(loginSys);
        });
    });
});
