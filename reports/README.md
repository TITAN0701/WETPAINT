# Test Reports

Generated Cypress reports are written to:

`reports/latest/index.html`

Run the suite with:

```bash
npm run test:report
```

The generated HTML report is self-contained for normal sharing use:

- open `reports/latest/index.html` directly in a browser
- upload the file to a shared drive
- publish the `reports/latest` folder on any static file host

If you want to keep historical copies, duplicate `reports/latest/index.html` into a dated folder under `reports/archive/`.

## GitHub Pages

This repo also includes a GitHub Actions workflow at:

`.github/workflows/cypress-report-pages.yml`

It runs Cypress, publishes `reports/latest` to GitHub Pages, and gives you a shareable URL.

Before it works, enable GitHub Pages in the repository settings:

1. Go to `Settings -> Pages`
2. In `Build and deployment`, set `Source` to `GitHub Actions`
3. Push to `main` or `master`, or run the workflow manually from the `Actions` tab

If Cypress fails before the HTML report is generated, the workflow still publishes a fallback status page so the GitHub Pages URL remains readable.
