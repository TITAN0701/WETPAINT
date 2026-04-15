import 'allure-cypress';
import './commands.js';
import './user_account.js';
import './common.js';
import 'cypress-mailslurp';
import 'cypress-test-email';

afterEach(function () {
  const runnable = this.currentTest;
  if (!runnable) {
    return;
  }

  const titlePath = typeof runnable.titlePath === 'function' ? runnable.titlePath() : [runnable.title];
  const screenshotName = titlePath
    .filter(Boolean)
    .join(' -- ')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .slice(0, 220);

  cy.screenshot(screenshotName, {
    capture: 'viewport',
    overwrite: true,
  });
});

Cypress.on('uncaught:exception', () => {
  return false;
});
