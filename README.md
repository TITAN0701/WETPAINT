# [IA] Cypress E2E 自動化測試說明

## 前置條件

在運行測試之前，請確保你的環境已安裝：

- Node.js ([建議版本])
- npm 或 yarn

## 安裝

1.  導航到專案的根目錄。
2.  安裝專案依賴（包括 Cypress）：
    ```bash
    npm install
    ```
3.  下載cypres-xpath

```bash
npm install -D cypress-xpath
```

4. 安裝排版工具

```bash
npx husky-init; npx husky set .husky/pre-commit "npx lint-staged"; npx husky install
```

## 如何運行測試

### GUI

這會打開 Cypress GUI，你可以在瀏覽器中互動地選擇和運行測試檔案：

```bash
npx cypress open
```

### CLI

在終端機中運行 (無頭模式 Headless)
這會在終端機中運行所有測試，通常用於 CI/CD 環境：

```Bash
npx cypress run
```

運行特定的測試檔案或資料夾
你可以在 npx cypress run 命令後指定要運行的測試檔案或資料夾的路徑：

```Bash
npx cypress run --spec cypress/e2e/auth/login.cy.js
# 運行 auth 資料夾下的所有測試
npx cypress run --spec cypress/e2e/auth/
```

指定瀏覽器運行
可以在運行命令後使用 --browser 旗標指定瀏覽器 (例如 chrome, firefox, edge)：

```Bash
npx cypress run --browser chrome
```

## 專案資料夾結構

本測試專案的程式碼按照功能模組組織，結構如下：

```
cypress/
├── e2e/                                  <- 存放你的測試情境檔案 (使用頁面物件)
│   ├── feature/                          <- 各項功能測試
│   │   ├── portal/                    <- 對應 儀錶板
│   │   │   └── portal.cy.js
│   │   ├── product_info/                 <- 對應 產品詳請
│   │   │   └── PRO.cy.js
│   │   ├── organization_management/      <- 組織管理
│   │   │  └── OGM.cy.js
│   │   ├── people_management/            <- 人員設置
│   │   │  └── PPM.cy.js
│   │   ├── login_track/                  <- 登入軌跡
│   │   │  └── LGT.cy.js
│   │   ├── system_setting/               <- 對應 系統設置
│   │   │  └── SYS.cy.js
│   │   ├── account/                      <- 對應 帳戶
│   │   │  └── ACC.cy.js
│   │   ├── common/                       <- 一些跨模組或通用情境的測試，例如登入、導覽等
│   │   │  └── login-flow.cy.js
│   ├── page-objects/                         <- 存放頁面物件檔案，按功能分資料夾，結構與 e2e/features/ 類似
│       ├── dashboard/
│       │   └── DashboardPage.js
│       ├── ...
│       └── common/                           <- 存放跨頁面的通用頁面物件 (如側邊欄選單本身、頂欄、通用的彈出視窗等)
│           ├── Header.js
│           └── AlertDialog.js
│
├── support/
│   ├── commands.js                       <- 可以按功能將自訂命令拆分到子檔案中，再在 e2e.js 中匯入
│   ├── e2e.js
│   └── ...
└── cypress.config.js
```

## 測試約定與模式

本專案遵循以下測試約定：

1.  **頁面物件模型 (Page Object Model - POM):**
    - 每個主要頁面或功能區塊在 `cypress/page-objects/` 資料夾下有對應的 `.js` 頁面物件檔案。
    - 頁面命名對照前端頁面命名，便於查找。
    - 頁面物件封裝了頁面元素的選擇器和與這些元素互動的方法。
    - 測試檔案 (`cypress/e2e/` 下的 `.cy.js` 檔案) 應透過頁面物件的方法來與 UI 互動，而不是直接使用 `cy.get()` 等命令。
2.  **元素定位:**
    - 若前端撰寫時可配合，則使用 `data-cy` 屬性來定位元素，例如 `[模組名稱]-[元素用途]` 或 `[元件名稱]-[元素用途]`，即可使用`cy.get('[data-cy="..."]')`的穩定方式選取元素。
    - 所有選擇器定義於POM的constructor中，並附上註解便於管理與調整。
3.  **自訂命令 (Custom Commands):**
    - 將常用的重複操作（如登入、填寫常見表單）封裝在 `cypress/support/commands.js` (或其子檔案) 中的自訂命令中。
    - 範例：`cy.login(username, password)`。

## 開發環境與程式碼規範

為了確保所有開發者都有一致的開發體驗與程式碼品質，本專案整合了 ESLint、Prettier 與 VS Code 相關設定。請遵循以下步驟來設定你的開發環境。

### 1. 安裝推薦的 VS Code 擴充套件

為了讓自動化工具順利運作，請在 VS Code 中安裝以下擴充套件：

1.  **ESLint**:
    - 擴充套件 ID: `dbaeumer.vscode-eslint`
    - 用途：即時檢查程式碼中的語法錯誤和風格問題。設定檔為 `.eslintrc.js`。

2.  **Prettier - Code formatter**:
    - 擴充套件 ID: `esbenp.prettier-vscode`
    - 用途：統一程式碼格式。設定檔為 `.prettierrc.js`。

### 2. VS Code 設定

本專案已包含推薦的 VS Code 設定檔 (`.vscode/settings.json`)，當你用 VS Code 開啟此專案時，應會自動套用。主要設定包括：

- **儲存時自動格式化 (Format on Save)**：當你儲存檔案時，Prettier 會自動格式化你的程式碼。
- **儲存時自動修復 (ESLint Fix on Save)**：ESLint 會自動修復它能處理的簡單問題。
- **預設格式化工具**：已將 Prettier 設定為 JavaScript、TypeScript 等檔案的預設格式化工具。
- **LF 行尾字元**：統一使用 `\n` (LF) 作為行尾字元，避免在 Windows 和 macOS/Linux 之間產生版本控制差異。

如果你的自動格式化沒有生效，請檢查你的 VS Code 使用者設定，確保它沒有覆蓋專案的設定。

### 3. 主要程式碼規範

我們的程式碼風格主要由 Prettier 和 ESLint 強制執行，重點如下：

- **程式碼寬度**：單行不超過 `100` 個字元。
- **引號**：使用單引號 (`'`) 而非雙引號 (`"`)。
- **分號**：句末必須加上分號 (`;`)。
- **結尾逗號**：在多行物件或陣列的最後一個元素後加上逗號 (`,`)。
- **箭頭函數括號**：箭頭函數的參數一律使用括號，例如 `(arg) => {}`。
- **全局變數**：
  - 已啟用 `browser`、`node` 和 `cypress/globals` 環境。
  - 可以直接在 `.cy.js` 檔案中使用 `cy`、`describe`、`it` 等 Cypress 提供的全局變數，不會觸發 `no-undef` 錯誤。

這些規則定義在 `.prettierrc.js` 和 `.eslintrc.js` 中，除非有特殊理由，否則不應修改。

### 4.Git 儲存庫

- 連結： [vigi-e2e](http://192.168.200.181:8087/rxp-platform/rxp-e2e)
- 庫命名策略： kebab-case
- 分支策略： 主分支 main, 開發分支 dev, 功能分支 feature/\*
- 提交規範： 參考 Conventional Commits 規範，必要含有 {type}: {subject} ，其他部分可省略，feature/\* 分支接受 minor edit，變基回主分支快進前須壓合

## Testcase Number命名規則

此專案 Testcases 編號一律使用 V開頭+測試情境或元件之英文縮寫
例如:
/featuers/common/login/login.cy.js 之testcase命名為VUP_XXX，源自於describe上的敘述VIGI-USERPERMISSION => VUP
每個編號數字都為3位，從001開始，編號順序無意義，方便追蹤用

## 補充

如需產出目前版本的測試報表，請參考 `reports/README.md`。
