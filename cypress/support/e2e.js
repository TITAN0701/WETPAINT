import 'allure-cypress';
import { attachmentPath, ContentType } from 'allure-cypress';
import './commands.js';
import './user_account.js';
import 'cypress-mailslurp';
import 'cypress-test-email';

afterEach(function () {
  const runnable = this.currentTest;
  if (!runnable) {
    return;
  }

  const screenshotMode = String(Cypress.env('REPORT_ATTACH_SCREENSHOTS') || 'failed').trim().toLowerCase();
  const shouldCapture =
    screenshotMode === 'all'
    || (screenshotMode !== 'none' && runnable.state === 'failed');

  if (!shouldCapture) {
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
    onAfterScreenshot(_el, details) {
      attachmentPath(screenshotName, details.path, {
        contentType: ContentType.PNG,
      });
    },
  });
});

Cypress.on('uncaught:exception', () => {
  return false;
});
