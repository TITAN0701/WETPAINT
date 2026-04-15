// 引入自訂命令
import 'allure-cypress';
import './commands.js';
import './user_account.js';
import './common.js';
import 'cypress-mailslurp';
import 'cypress-test-email'

// 防止未捕獲的應用程式錯誤使測試失敗
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
