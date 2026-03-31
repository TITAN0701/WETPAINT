import LoginSys from '../../page-objects/Login_flow/LoginWetpaint';
import RGAccount from '../../page-objects/Register_Account/RegisterAccount';
import * as TestRG001 from './RG-001';
import * as TestRG002 from './RG-002';
import * as TestRG003 from './RG-003';
import * as TestRG004 from './RG-004';
import * as TestRG005 from './RG-005';
import * as TestRG006 from './RG-006';
import * as TestRG007 from './RG-007';
import * as TestRG008 from './RG-008';


describe('Register flow', () => {
    const rgaccount = new RGAccount();
    const loginSys = new LoginSys();

    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('/login'); 
    })

    describe('RG-001 點擊創立帳號功能', () => {
        it('點擊進入創立帳號頁面.', () => {
            loginSys.clickRegisterButton();
            TestRG001.verifyClickRegisterMessage();
            TestRG001.verifyGetRegisterPageElements();
        });

    });

    describe('RG-002 驗證填寫姓名、密碼', () => {
        it(' 輸入姓名、密碼，檢查字串', () => {
            loginSys.clickRegisterButton();
            rgaccount.clickRegisterNameinput('Test User');
            TestRG002.verifyRegisterNameInput('Test User');

            rgaccount.clickRegisterPasswordinput('TestPassword123', 'TestPassword123');
            TestRG002.verifyRegisterPasswordInput('TestPassword123', 'TestPassword123');
        }); 
    });

    describe('RG-003 找到性別欄位點擊選項，選擇男、女性', () => {
        it('驗證點擊男性、女性功能', () => {
            loginSys.clickRegisterButton();
            rgaccount.clickRegisterGenderinput('female');
            TestRG003.verifyGenderOptionsChecked('female');

            rgaccount.clickRegisterGenderinput('male');
            TestRG003.verifyGenderOptionsChecked('male');
        });
    });

    describe('RG-004 於註冊頁面找到Email欄位，並輸入Email資訊', () => {
        it('驗證Email欄位、輸入文字', () => {
            loginSys.clickRegisterButton();
            rgaccount.clickRegisterEmailinput('p9geepmczk@pxdmail.net');
            TestRG004.verifyEmailInput('p9geepmczk@pxdmail.net');
            
        }) 
    })

    describe('RG-005 於註冊頁面找到手機欄位，並輸入手機號碼資訊', () => {
        it('驗證手機欄位、輸入文字', () => {
            loginSys.clickRegisterButton();
            rgaccount.clickRegisterPhoneinput('0988213551');
            TestRG005.verifyPhoneInputMessage('0988213551');

        })
    })
    // 409 bugs (後端修改中)
    describe.skip('RG-006 使用者需要註冊信箱接收訊息，並回填資訊到輸入欄中', () => {
        it('驗證驗證碼回傳、輸入文字', () => {
            loginSys.clickRegisterButton();
            rgaccount.clickRegisterNameinput('Test8');
            rgaccount.clickRegisterPasswordinput('TestPassword123', 'TestPassword123');
            rgaccount.clickRegisterGenderinput('female');
            rgaccount.clickRegisterEmailinput('crxwkf0l2s@pxdmail.net');
            rgaccount.clickRegisterPhoneinput('0988213551');

            TestRG006.verifysetupsendotpAPI();
            rgaccount.clickRegisterVerificationCodeInput('email');
            TestRG006.verifyGetEmailotpAPI({ expectedStatusCode: 200 });

            TestRG006.verifygetoptFormProxiedEmail('crxwkf0l2s@pxdmail.net').then((otp) => {
            rgaccount.InputtypeRegisterVerificationCode(otp);
            })
        })
    });

    describe('RG-007 使用者在註冊頁面中找到服務條款字樣', () => {
        it('點擊抓取字串按同意', () => {
            loginSys.clickRegisterButton();
            rgaccount.clickAndCheckRegisterButton();
            TestRG007.verifycheckItemStatus('no');
            TestRG007.verifycheckItemContentMessage();
            rgaccount.clickAgressCheckButton();
            TestRG007.verifycheckItemStatus('yes');
        })
    })

    describe('RG-008 檢查是否可以正確登入帳號，並檢查錯誤密碼' , (  ) => {
        it('新建帳號可以正確登入頁面', () => {
            //創建帳號、填寫名字、密碼、信箱、手機
            loginSys.clickRegisterButton();
            rgaccount.clickRegisterNameinput('Tester4');
            rgaccount.clickRegisterPasswordinput('TestPassword123', 'TestPassword123');
            rgaccount.clickRegisterGenderinput('male');
            rgaccount.clickRegisterEmailinput('crxwkf0l2s@pxdmail.net');
            rgaccount.clickRegisterPhoneinput('0988214551');

            //填寫驗證碼、閱讀條款、確認送出
            rgaccount.InputtypeRegisterVerificationCode('11111111');
            rgaccount.clickAndCheckRegisterButton();
            rgaccount.clickAgressCheckButton();
            rgaccount.clickConfirmRegisterButton();

        })

        it('少次數使用錯誤密碼驗證錯誤次數和出現的錯誤內容', () => {

            TestRG008.verifyGetAccountLoginErrorAPI();
            
            loginSys.clickaccountnumber('0988214550');
            loginSys.clickpassword('TestPassword123');
            loginSys.clickLoginButton();
            TestRG008.verifyAccountLoginErrorMessage('401');

        })

        it('多次數使用錯誤密碼驗證錯誤次數和出現的錯誤內容', () => {
            TestRG008.verifyGetAccountLoginErrorAPI();
            Cypress._.times(7, () => {
                loginSys.clickaccountnumber('0988214550');
                loginSys.clickpassword('TestPassword123');
                loginSys.clickLoginButton();
            })
            //抓 devtool 預覽回傳內容，檢查多次錯誤密碼後的回傳狀態，確認已被鎖住
            loginSys.clickaccountnumber('0988214551');
            loginSys.clickpassword('TestPassword123');
            TestRG008.verifyAccountLoginErrorMessage('403');
            //需等待10分鐘
            cy.wait(6000);
        })

    })

});



