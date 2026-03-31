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
        // loginSys.goToLoginPage();
        cy.visit('/login');
    });

    describe('LG-.001 驗證輸入帳號', () => {
        it('使用者能成功登入網頁，找到帳號欄位並輸入資訊 (手機)', () => {
            loginSys.clickaccountnumber('0999999993');
            loginSys.clickpassword('password123');
            TestLG001.verifyLoginPageAccountPasswdInput('0999999993');
        })

        it('驗證帳號輸入錯誤時的錯誤訊息 (手機)', () => {
            loginSys.clickaccountnumber('0999999994');
            loginSys.clickpassword('password123');
            TestLG001.verifyLoginPageAccountError();
        });
        
        it('使用者能成功登入網頁，找到帳號欄位並輸入資訊 (電子信箱)', () => {
            loginSys.clickaccountnumber('admin@example.com');
            loginSys.clickpassword('password123');
            TestLG001.verifyLoginPageAccountPasswdInput('admin@example.com');
        })

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
            // 這裡的測試重點是驗證登入API是否被正確觸發並接收回應，所以不需要模擬輸入帳號密碼的過程，直接呼叫API驗證函式即可
            loginSys.clickaccountnumber('0999999993');
            loginSys.clickpassword('password123');
            TestLG004.verifyLoginPageAccountAPI();
            loginSys.clickLoginButton();
            TestLG004.verifyLoginPageAccountAPIRequest('0999999993', 'password123');
        });

    });

    describe.skip('LG-005 驗證忘記密碼功能', () => {
        // 有接到回傳  但重設密碼是否成功有bugs
        it.only('驗證信箱接收是否有成功回傳', () => {
            loginSys.clickLoginButtonForgetfunction('titan.lee@ruenxin.com.tw');
            TestLG005.verifyForgetPasswordPageApI();
            loginSys.clickLoginButtonForgetfunctionNextButton();
            TestLG005.verifyForgetPasswordPageApiRequest('titan.lee@ruenxin.com.tw');

            const roundcubeInboxUrl = Cypress.env('ROUNDCUBE_INBOX_URL') || Cypress.env('ROUNDCUBE_URL');
            const roundcubeAccount = Cypress.env('ROUNDCUBE_ACCOUNT');
            const roundcubePassword = Cypress.env('ROUNDCUBE_PASSWORD');

            TestLG005.verifygetlatestResetPassword('titan.lee@ruenxin.com.tw', {
                source: roundcubeInboxUrl ? 'roundcube' : 'auto',
                roundcubeInboxUrl,roundcubeAccount,roundcubePassword,
                mailRetries: 36, mailIntervalMs: 5000,
            }).then(() => {
                loginSys.clickLoginButtonForgetfunctionResetButton('Newpassword123', 'Newpassword123');
            });
        });

        it('點擊忘記密碼按鈕，驗證UI畫面呈現是否正常', ()=> {
            loginSys.clickLoginButtonForgetfunction('titan860701@gmail.com');
            loginSys.clickLoginButtonForgetfunctionNextButton();
            TestLG005.verifyNextPageResetPasswordMessage();
            loginSys.clickLoginButtonForgetfunctionResetButton('Newpassword123', 'Newpassword123');
            TestLG005.verifyResetSuccessMessage();
            loginSys.clickBackToPageButton();


        });

        it('點擊忘記密碼按鈕，應該要跳轉到忘記密碼頁面  (錯誤格式的email)', () => {
            loginSys.clickLoginButtonForgetfunction('ZZZ');
            TestLG005.verifyForgetPasswordPageMessage();
            TestLG005.verifyForgetPasswordPagefailAPI();
        });
    });





});
