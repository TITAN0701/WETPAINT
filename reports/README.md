# Test Reports

This repo now uses Allure for Cypress reporting.

Generated files are written to:

- `allure-results/` for raw Cypress result files
- `allure-report/` for the generated Allure HTML site

Run the suite with:

```bash
npm run test:report
npm run report:generate
```

Open the generated report locally with:

```bash
npm run report:open
```

Allure requires Java 8 or higher to generate or open the HTML report.

If you want to keep historical copies, duplicate the `allure-report` contents into a dated folder under `reports/archive/`.

## GitHub Pages

This repo also includes a GitHub Actions workflow at:

`.github/workflows/cypress-report-pages.yml`

It runs a manually selected Cypress spec, generates an Allure HTML report, and publishes `allure-report` to GitHub Pages.

To use it:

1. Open the `Actions` tab and run `Cypress Report`
2. Enter the spec path you want to run, for example:

```text
cypress/e2e/features/common/login.cy.js
```

or:

```text
cypress/e2e/features/FirstPage_Manage/FPM.cy.js
```

After the run completes:

1. Open that workflow run
2. Click the GitHub Pages deployment URL from the job summary or deployment section
3. The site root opens the generated Allure report

If the run captured screenshots, videos, or raw Allure results, download the `cypress-debug-<run_number>` artifact from the same workflow run.

## Update

Current local command has been simplified to:

```bash
npm run report -- --spec cypress/e2e/features/FirstLogin_flow/FLG.cy.js
```

Current generated paths are:

- `reports/.generated/allure-results`
- `reports/.generated/allure-report`
