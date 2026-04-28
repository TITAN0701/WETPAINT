# [IA] Cypress E2E 自動化測試說明

## 前置條件

在運行測試之前，請確保環境已安裝：

- Node.js
- npm

## 安裝

```bash
npm install
```

## 如何運行測試

### GUI

打開 Cypress GUI，可在瀏覽器中選擇並執行測試：

```bash
npm run cy:open
```

### CLI

執行全部測試：

```bash
npm run cy:run
```

使用 Chrome 執行：

```bash
npm run cy:run:chrome
```

執行指定 spec：

```bash
npx cypress run --spec cypress/e2e/features/FrontDesk_flow/FDT.cy.js
```

產生報表：

```bash
npm run report
```

## 專案資料夾結構

目前專案主要結構如下：

```text
cypress/
├── e2e/
│   ├── features/                         <- 測試案例主體
│   │   ├── FrontDesk_flow/               <- 前台流程
│   │   ├── FirstPage_Manage/             <- 後台首頁管理
│   │   ├── Login_flow/                   <- 登入流程
│   │   ├── Register_Account/             <- 註冊流程
│   │   ├── FirstLogin_flow/              <- 首次登入流程
│   │   └── common/                       <- 共用測試流程
│   └── page-objects/                     <- 頁面操作封裝
│       ├── frontdesk_manage/
│       ├── firstpage_manage/
│       ├── Login_flow/
│       ├── Register_Account/
│       └── common/
├── fixtures/                             <- 測試資料
├── support/
│   ├── commands.js                       <- 共用 Cypress 指令
│   ├── e2e.js
│   └── user_account.js                   <- 測試帳號
├── screenshots/                          <- 測試失敗截圖，屬於產物
└── downloads/

reports/                                 <- Allure 報表資料
scripts/                                 <- 報表相關腳本
cypress.config.js                        <- Cypress 設定
```

## 測試約定與模式

### Page Object Model

- 頁面操作請優先寫在 `cypress/e2e/page-objects/`。
- 測試案例檔只負責流程與驗證，不建議堆大量 `cy.get()`。
- 如果頁面按鈕、欄位或導覽邏輯改變，優先修改 page object。

### Features 測試檔

- `.cy.js`：測試流程入口，例如 `FDT.cy.js`、`FPM.cy.js`。
- `FDT-004.js`、`FDT-005.js` 這類檔案：單一案例的檢查邏輯。
- `FDT_helpers.js`：同流程共用資料或 helper。

## 通常需要修改的地方

- 測試流程改變：修改對應 `.cy.js`。
- 頁面文字或驗證規則改變：修改對應案例檔，例如 `FDT-004.js`、`FDT-005.js`。
- 頁面操作方式改變：修改 `cypress/e2e/page-objects/`。
- 測試帳號改變：修改 `cypress/support/user_account.js`。
- 測試資料改變：修改 `cypress/fixtures/`。
- baseUrl、報表設定改變：修改 `cypress.config.js`。
- npm 套件改變：修改 `package.json`，並讓 `package-lock.json` 跟著更新。

## 通常不需修改的地方

- `node_modules/`
- `.git/`
- `cypress/screenshots/`
- `reports/.generated/`
- `package-lock.json`，除非有安裝、移除或更新 npm 套件。

## 新增測試方式

1. 在對應功能資料夾新增案例檔，例如：
   - `cypress/e2e/features/FrontDesk_flow/FDT-006.js`
   - `cypress/e2e/features/FirstPage_Manage/FPM-006.js`

2. 在對應 `.cy.js` 匯入並呼叫：

```js
import * as TestFDT006 from './FDT-006';
```

3. 如需新增頁面操作，放到 `page-objects/`。

4. 如需新增固定測試資料，放到 `fixtures/`。

## 帳號使用原則

測試帳號統一放在 `cypress/support/user_account.js`。

- 管理者：`globalThis.administrator_1`
- 家長：`globalThis.administrator_2`

不要在測試案例中重複寫死帳號密碼，請引用 `globalThis` 裡的帳號。

## FAQ / 關於我們文字檢查

- 前台 FAQ：`cypress/e2e/features/FrontDesk_flow/FDT-004.js`
- 前台關於我們：`cypress/e2e/features/FrontDesk_flow/FDT-005.js`
- 後台關於我們：`cypress/e2e/features/FirstPage_Manage/FPM-005.js`

文字檢查請以目前系統畫面或 DOM 內容為準。若畫面有換行、表格欄位或 `span` 拆字，可以分段檢查，但內容需完整覆蓋。

## 開發注意事項

- 提交前移除不需要的 `it.only` / `describe.only`。
- 中文標點需和系統畫面一致，例如 `，`、`。`、`.`、`『』`。
- 修改後至少執行語法檢查：

```bash
node -c cypress/e2e/features/FrontDesk_flow/FDT-004.js
```

必要時再執行指定 spec：

```bash
npx cypress run --spec cypress/e2e/features/FrontDesk_flow/FDT.cy.js
```

## Testcase Number 命名規則

測試案例以功能代碼開頭，例如：

- `FDT`：FrontDesk Flow
- `FPM`：First Page Management
- `LG`：Login Flow
- `RG`：Register Account
- `FLG`：First Login Flow

編號使用 3 位數，例如 `FDT-001`、`FDT-004`。

## 補充

如需產出或查看目前版本的測試報表，請參考 `reports/README.md`。
