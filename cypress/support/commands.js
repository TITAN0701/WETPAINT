import loginPageObject from '../e2e/page-objects/common/login';
import loginIOSPageObject from '../e2e/page-objects/common/loginIOS';
import DashboardPageObject from '../e2e/page-objects/common/dashboard';

const loginPage = new loginPageObject();
const loginIOSPage = new loginIOSPageObject();
const dashboardPage = new DashboardPageObject();

function getBaseUrl() {
  return String(Cypress.config('baseUrl') || '').replace(/\/+$/, '');
}

function getLoginUrl() {
  return `${getBaseUrl()}/login`;
}

function getLoginApiUrl() {
  return `${getBaseUrl()}/cskapi/api/auth/login`;
}

function isAllowedPostLoginPath(pathname) {
  const normalizedPath = String(pathname || '').toLowerCase();
  const allowedPatterns = [
    /\/dashboard(?:\/|$)/,
    /\/admin\/dashboard(?:\/|$)/,
    /\/admin\/child-list(?:\/|$)/,
    /\/developmental(?:\/|$)/,
    /\/\d+\/developmental(?:\/|$)/,
    /\/\d+\/child(?:-|\/|$)/,
  ];

  return allowedPatterns.some((pattern) => pattern.test(normalizedPath));
}
//確認是否有打開Menu，沒有的話就打開
function ensureUserMenuOpen() {
  const openMenuSelector = '[role="dialog"][id^="reka-popover-content-"][data-state="open"]';

  return cy.get('body').then(($body) => {
    if ($body.find(openMenuSelector).length === 0) {
      cy.get('[id^="reka-popover-trigger-"][aria-haspopup="dialog"] img')
        .first()
        .should('be.visible')
        .click();
    }
  }).then(() => {
    return cy.get(openMenuSelector).as('userMenu').should('be.visible');
  });
}

Cypress.Commands.add('FirstPageLogin', () => {
  cy.visit('/login');
});

//設定手機login指令，確保登入API回應
Cypress.Commands.add('loginIOS', (account, password) => {
  cy.intercept('POST', '**/login**').as('login');
  cy.visit(getLoginUrl()).then(() => {
    loginIOSPage.Elementsarevisble();
  });
  cy.get('#username').clear().type(account);
  cy.get('#password').clear().type(password, { log: false });
  cy.contains('button', '登入').should('be.visible').and('not.be.disabled').click();

  cy.wait('@login').then(({ response }) => {
    const serverDate = response?.headers?.date;
    if (!serverDate) return;

    const date = new Date(serverDate);
    const formattedTime =
      `${date.getFullYear()}-` +
      `${String(date.getMonth() + 1).padStart(2, '0')}-` +
      `${String(date.getDate()).padStart(2, '0')} ` +
      `${String(date.getHours()).padStart(2, '0')}:` +
      `${String(date.getMinutes()).padStart(2, '0')}:` +
      `${String(date.getSeconds()).padStart(2, '0')}`;

    globalThis.lastLoginTime = formattedTime;
    cy.log(`最後登入時間(Header): ${formattedTime}`);
  });

  cy.location('pathname', { timeout: 10000 }).should((pathname) => {
    const isAllowed = isAllowedPostLoginPath(pathname);
    expect(isAllowed, `unexpected post-login path: ${pathname}`).to.eq(true);
  });

  cy.location('pathname').then((pathname) => {
    const isAdminPath = pathname.includes('/dashboard') || pathname.includes('/admin');
    if (!isAdminPath) {
      return;
    }

    dashboardPage.Elementsarevisble();

    if (account === 'admin@example.com') {
      dashboardPage.GetUserName().should(($el) => {
        expect($el.text().trim()).to.eq('管理者');
      });
    } else if (account === 'parent@example.com') {
      dashboardPage.GetUserName().should(($el) => {
        expect($el.text().trim()).to.eq('家長');
      });
    }
  });
  
});

// 設定login指令，確保登入後驗證API回應和頁面元素，並根據不同帳號驗證Header顯示的使用者名稱
Cypress.Commands.add('login', (account, password) => {
  cy.intercept('POST', '**/login**').as('login');

  cy.visit(getLoginUrl()).then(() => {
    loginPage.Elementsarevisble();
  });

  cy.get('#username').clear().type(account);
  cy.get('#password').clear().type(password, { log: false });
  cy.contains('button', '登入').should('be.visible').and('not.be.disabled').click();

  cy.wait('@login').then(({ response }) => {
    const serverDate = response?.headers?.date;
    if (!serverDate) return;

    const date = new Date(serverDate);
    const formattedTime =
      `${date.getFullYear()}-` +
      `${String(date.getMonth() + 1).padStart(2, '0')}-` +
      `${String(date.getDate()).padStart(2, '0')} ` +
      `${String(date.getHours()).padStart(2, '0')}:` +
      `${String(date.getMinutes()).padStart(2, '0')}:` +
      `${String(date.getSeconds()).padStart(2, '0')}`;

    globalThis.lastLoginTime = formattedTime;
    cy.log(`最後登入時間(Header): ${formattedTime}`);
  });

  cy.location('pathname', { timeout: 10000 }).should((pathname) => {
    const isAllowed = isAllowedPostLoginPath(pathname);
    expect(isAllowed, `unexpected post-login path: ${pathname}`).to.eq(true);
  });

  cy.location('pathname').then((pathname) => {
    const isAdminPath = pathname.includes('/dashboard') || pathname.includes('/admin');
    if (!isAdminPath) {
      return;
    }

    dashboardPage.Elementsarevisble();

    if (account === 'admin@example.com') {
      dashboardPage.GetUserName().should(($el) => {
        expect($el.text().trim()).to.eq('管理者');
      });
    } else if (account === 'parent@example.com') {
      dashboardPage.GetUserName().should(($el) => {
        expect($el.text().trim()).to.eq('家長');
      });
    }
  });
});
// 設定logout指令，確保登出後清除所有相關的session和cookie，並驗證已經回到登入頁面
Cypress.Commands.add('logout', () => {
  ensureUserMenuOpen();
  cy.get('@userMenu').within(() => {
    cy.contains('登出').should('be.visible').click();
  });

  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
  cy.clearCookies();
  cy.url().should('include', '/login');
});
// 設定loginByAPI指令，直接透過API登入並將token存入sessionStorage，適用於需要快速登入的測試場景
Cypress.Commands.add('loginByAPI', (account, password) => {
  cy.request('POST', getLoginApiUrl(), {
    account,
    password,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.data).to.have.property('token');

    cy.window().then((win) => {
      win.sessionStorage.setItem('user', JSON.stringify(response.body.data));
      win.sessionStorage.setItem('expired', String(response.body.data.expired));
      win.sessionStorage.setItem('token', response.body.data.token);
    });
  });
});
// 驗證登入後的Header和Menu是否正確顯示
Cypress.Commands.add('verifyHeaderAndMenu', () => {
  cy.get('header').filter(':visible').first().as('topHeader');

  ensureUserMenuOpen();
  cy.get('@userMenu').within(() => {
    cy.contains('個人資料').should('be.visible');
    cy.contains('前往前台').should('be.visible');
    cy.contains('系統設定').should('be.visible');
    cy.contains('登出').should('be.visible');
  });

  cy.get('@topHeader').within(() => {
    cy.get('nav a[href="/admin/dashboard"]').contains('儀錶板').should('be.visible');
    cy.get('nav a[href="/admin/child-list"]').contains('孩童列表').should('be.visible');
    cy.get('nav a[href="/admin/question"]').contains('題目管理').should('be.visible');
    cy.get('nav a[href="/admin/invite"]').contains('邀請管理').should('be.visible');
    cy.get('nav a[href="/admin/about"]').contains('關於我們').should('be.visible');
  });
});
