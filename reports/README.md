# Test Reports

Generated Cypress report files are written to:

- `reports/latest/index.html` for the landing page
- `reports/latest/report.html` for the Mochawesome HTML report

Run the suite with:

```bash
npm run test:report
```

The generated HTML report is self-contained for normal sharing use:

- open `reports/latest/index.html` directly in a browser
- upload the file to a shared drive
- publish the `reports/latest` folder on any static file host

If you want to keep historical copies, duplicate the `reports/latest` contents into a dated folder under `reports/archive/`.

## GitHub Pages

This repo also includes a GitHub Actions workflow at:

`.github/workflows/cypress-report-pages.yml`

It runs a manually selected Cypress spec, publishes `reports/latest` to GitHub Pages, and gives you a shareable URL.
The GitHub Pages homepage shows the latest run status, spec path, run time, commit, and links to both the workflow run and the HTML report.

Before it works, enable GitHub Pages in the repository settings:

1. Go to `Settings -> Pages`
2. In `Build and deployment`, set `Source` to `GitHub Actions`
3. Open the `Actions` tab and run `Cypress Report Pages`
4. Enter the spec path you want to run, for example:

```text
cypress/e2e/features/common/login.cy.js
```

or:

```text
cypress/e2e/features/FirstPage_Manage/FPM.cy.js
```

If Cypress fails before the HTML report is generated, the workflow still publishes a fallback status page so the GitHub Pages URL remains readable.
