# Test Reports

Generated Cypress report files are written to:

- `reports/latest/report.html` for the Mochawesome HTML report

Run the suite with:

```bash
npm run test:report
```

The generated HTML report is self-contained for normal sharing use:

- open `reports/latest/report.html` directly in a browser
- upload the file to a shared drive
- publish the `reports/latest` folder on any static file host

If you want to keep historical copies, duplicate the `reports/latest` contents into a dated folder under `reports/archive/`.

## GitHub Pages

This repo also includes a GitHub Actions workflow at:

`.github/workflows/cypress-report-pages.yml`

It runs a manually selected Cypress spec, generates the Mochawesome HTML report, and publishes `reports/latest` to GitHub Pages.

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
3. The site root redirects to `report.html`

If the run captured screenshots or videos, download the `cypress-debug-<run_number>` artifact from the same workflow run.
