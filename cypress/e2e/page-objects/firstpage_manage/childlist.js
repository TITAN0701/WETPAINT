import firstpagemanage from './firstpagemanage';

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAssertionText(value) {
    return String(value).match(/\d+/)?.[0] || String(value).trim();
}

function normalizeSelectionValues(value) {
    if (Array.isArray(value)) {
        return value.map((item) => getAssertionText(item)).filter(Boolean);
    }

    return String(value)
        .split(',')
        .map((item) => getAssertionText(item))
        .filter(Boolean);
}

class childlist extends firstpagemanage {
    constructor() {
        super();
        this.filterDialogTitle = '篩選器';
        this.dialogSelector = 'div[role="dialog"][data-state="open"]';
        this.openSelectSelector = '[id^="reka-select-content-"][data-state="open"], [id^="reka-select-content-"]:visible';
    }

    goToChildListPage() {
        this.clickChildtable();
        this.verifyChildListPageLoaded();
    }

    verifyChildListPageLoaded() {
        cy.contains('div:visible,h1:visible,h2:visible,span:visible', '孩童列表').should('be.visible');
        cy.contains('button:visible', this.filterDialogTitle).should('be.visible');
    }

    verifyChildListColumns(expectedColumns = []) {
        cy.get('table thead th:visible').then(($headers) => {
            expect($headers.length, 'visible table headers').to.be.greaterThan(0);
        });

        expectedColumns.forEach((column) => {
            cy.contains('th:visible,div:visible,span:visible,p:visible', column).should('exist');
        });
    }

    openFilterDialog() {
        cy.contains('button:visible', this.filterDialogTitle)
            .should('be.visible')
            .click({ force: true });
        this.getFilterDialog().should('be.visible');
    }

    getFilterDialog() {
        return cy.get(this.dialogSelector).filter(':visible').last();
    }

    closeSelectPanelIfNeeded() {
        return cy.get('body').then(($body) => {
            if ($body.find(this.openSelectSelector).length === 0) {
                return null;
            }

            cy.get('body').type('{esc}', { force: true });
            return this.getFilterDialog().click(10, 10, { force: true });
        }).then(() => {
            cy.get('body').should(($body) => {
                expect($body.find(this.openSelectSelector).length).to.eq(0);
            });
        });
    }

    selectFilterOptionByIndex(index, value, options = {}) {
        if (value === undefined || value === null || value === '') {
            return;
        }

        const { keepOpen = false } = options;
        const expectedValues = normalizeSelectionValues(value);

        this.getFilterDialog()
            .find('button[role="combobox"]:visible')
            .eq(index)
            .should('be.visible')
            .click({ force: true });

        cy.wrap(expectedValues).each((expectedValue) => {
            cy.get(this.openSelectSelector)
                .filter(':visible')
                .last()
                .should('be.visible')
                .then(($panel) => {
                    const selector = '[role="option"], [data-radix-collection-item], [data-value], li, button, div, span';
                    const exactPattern = new RegExp(`^${escapeRegExp(expectedValue)}$`);
                    const numericPattern = expectedValue.match(/\d+/)
                        ? new RegExp(`^${escapeRegExp(expectedValue.match(/\d+/)[0])}$`)
                        : null;
                    const resolveClickable = ($candidate) => {
                        const $clickable = $candidate.closest('[role="option"], [data-radix-collection-item], [data-value], li, button');
                        return $clickable.length > 0 ? $clickable : $candidate;
                    };

                    const $exactMatch = Cypress.$($panel)
                        .find(selector)
                        .filter((_, el) => exactPattern.test(String(el.innerText || '').trim()))
                        .first();

                    if ($exactMatch.length > 0) {
                        cy.wrap(resolveClickable($exactMatch))
                            .scrollIntoView()
                            .click({ force: true });
                        return;
                    }

                    if (numericPattern) {
                        const $numericMatch = Cypress.$($panel)
                            .find(selector)
                            .filter((_, el) => numericPattern.test(String(el.innerText || '').trim()))
                            .first();

                        if ($numericMatch.length > 0) {
                            cy.wrap(resolveClickable($numericMatch))
                                .scrollIntoView()
                                .click({ force: true });
                            return;
                        }
                    }

                    cy.wrap($panel)
                        .contains(selector, expectedValue)
                        .then(($candidate) => {
                            cy.wrap(resolveClickable($candidate))
                                .scrollIntoView()
                                .click({ force: true });
                        });
                });
        }).then(() => {
            if (!keepOpen) {
                return null;
            }

            return this.closeSelectPanelIfNeeded();
        }).then(() => {
            this.getFilterDialog()
                .find('button[role="combobox"]:visible')
                .eq(index)
                .find('[data-slot="value"]')
                .invoke('text')
                .then((text) => {
                    expectedValues.forEach((expectedValue) => {
                        expect(text, `combobox ${index} selected value`).to.include(expectedValue);
                    });
                });
        });
    }

    setDateRange(fromDate, toDate) {
        if (!fromDate || !toDate) {
            return;
        }

        const parseDate = (value) => {
            const [year, month, day] = String(value).split('-');
            return { year, month, day };
        };

        const from = parseDate(fromDate);
        const to = parseDate(toDate);

        this.getFilterDialog()
            .find('[role="spinbutton"][data-slot="segment"]:visible')
            .then(($segments) => {
                expect($segments.length, 'date range segments length').to.be.gte(6);

                [
                    from.month,
                    from.day,
                    from.year,
                    to.month,
                    to.day,
                    to.year,
                ].forEach((segmentValue, index) => {
                    cy.wrap($segments.eq(index))
                        .click({ force: true })
                        .type(`{selectall}${segmentValue}`, { force: true });
                });
            });
    }

    clickFilterButton(optionsOrCity, state, result) {
        const options = typeof optionsOrCity === 'object' && optionsOrCity !== null
            ? optionsOrCity
            : {
                city: optionsOrCity,
                district: state,
                assessmentResult: result,
            };

        this.openFilterDialog();
        this.selectFilterOptionByIndex(0, options.gender);
        this.selectFilterOptionByIndex(1, options.ageMonths, { keepOpen: true });
        this.selectFilterOptionByIndex(2, options.isPremature);
        this.selectFilterOptionByIndex(3, options.city);
        this.selectFilterOptionByIndex(4, options.district);
        this.selectFilterOptionByIndex(5, options.assessmentResult);
        this.selectFilterOptionByIndex(6, options.quizStatus);
        this.setDateRange(options.quizDateFrom, options.quizDateTo);
    }

    clickfilterConfirm(outtype) {
        switch (outtype) {
            case 'yes':
                cy.contains('button:visible', '套用').click({ force: true });
                break;
            case 'no':
                cy.contains('button:visible', '取消').click({ force: true });
                break;
            default:
                break;
        }
    }

    clickFirstRowViewButton(index) {
        cy.get('table tbody tr:visible')
            .eq(index)
            .find('td')
            .last()
            .within(() => {
                cy.get('button:visible').first().as('viewButton');

                cy.get('@viewButton')
                    .find('svg:visible, [data-slot="leadingIcon"]:visible')
                    .first()
                    .then(($icon) => {
                        if ($icon.length > 0) {
                            cy.wrap($icon).click({ force: true });
                            return;
                        }

                        cy.get('@viewButton').click({ force: true });
                    });
            });
    }

    clickCheckResultButton(index) {
        cy.get('button:visible, a:visible, [role="button"]:visible, span:visible')
            .filter((_, el) => /檢測結果|結果列表/i.test(el.innerText || ''))
            .eq(index)
            .should('be.visible')
            .then(($target) => {
                const $clickable = $target.closest('button,a,[role="button"]');

                if ($clickable.length > 0) {
                    cy.wrap($clickable).click({ force: true });
                    return;
                }

                cy.wrap($target).click({ force: true });
            });
    }

    clickChildlistReturnButton() {
        cy.contains('button:visible,span:visible,a:visible', /返回|孩童列表/i)
            .first()
            .click({ force: true });
    }

    clickChildInfoButton() {
        cy.contains('button:visible', /^孩童資料$/, { timeout: 10000 })
            .should('be.visible')
            .click({ force: true });
    }

    clickChildSuggestButton() {
        cy.contains('button:visible', /檢測建議|建議/).should('exist').click({ force: true });
    }

    rememberDeleteRowInfo(rowChain, alias = 'deletedChildInfo') {
        return rowChain
            .should('be.visible')
            .find('td')
            .first()
            .then(($cell) => {
                const texts = Cypress.$($cell)
                    .find('div')
                    .map((_, el) => String(el.innerText || '').trim())
                    .get()
                    .filter(Boolean);

                const info = {
                    name: texts[0] || null,
                    caseCode: texts[1] || null,
                    rowText: texts.join(' | '),
                };

                return cy.wrap(info, { log: false })
                    .as(alias)
                    .then(() => {
                        cy.log(`Deleted child remembered: ${info.rowText}`);
                    })
                    .then(() => info);
            });
    }

    clickFirstRowDeleteButton(target, type, alias = 'deletedChildInfo') {
        const rowAlias = 'targetDeleteRow';

        if (typeof target === 'number') {
            cy.get('table tbody tr:visible').eq(target).as(rowAlias);
        } else if (target) {
            const targetName = String(target).trim();
            cy.contains(
                'table tbody tr:visible td:first-child div:first-child',
                new RegExp(`^${escapeRegExp(targetName)}$`)
            )
                .closest('tr')
                .as(rowAlias);
        } else {
            cy.get('table tbody tr:visible').first().as(rowAlias);
        }

        this.rememberDeleteRowInfo(cy.get(`@${rowAlias}`), alias);
        cy.get(`@${rowAlias}`)
            .find('td')
            .last()
            .find('button:visible')
            .last()
            .click({ force: true });

        switch (type) {
            case 'yes':
                cy.contains('button:visible', /刪除|確認/).click({ force: true });
                break;
            case 'no':
                cy.contains('button:visible', '取消').click({ force: true });
                break;
            default:
                break;
        }

        return cy.get(`@${alias}`);
    }

    clickBackendButton(downlist) {
        this.clickOtherPageItem(downlist);
    }
}

export default childlist;
