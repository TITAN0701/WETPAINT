import * as TestLOG001 from './LOG_001';

describe('Login登入頁面', () => {
  beforeEach(()=>{
    cy.viewport(1920, 1080)
    cy.login(globalThis.administrator_1.account,globalThis.administrator_1.password)
    cy.verifyHeaderAndMenu();

  });

  it('AD登入測試',()=>{
    TestLOG001.Login() 
  })

});

