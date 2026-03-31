import FirstPageList from '../../page-objects/frontdesk_manage/firstpagelist';

const firstPageList = new FirstPageList();

function getDialogByMode(mode) {
    firstPageList.currentFormMode = mode;
    return firstPageList.getOpenDialog();
}

function normalizeText(value) {
    return String(value ?? '')
        .replace(/\s+/g, '')
        .replace(/臺/g, '台')
        .trim()
        .toLowerCase();
}

function assertTextIncludes(actual, expected, label) {
    expect(
        normalizeText(actual),
        `${label} should include ${expected}`
    ).to.include(normalizeText(expected));
}

function assertResidenceValue(labelText, index, expectedValue) {
    const triggerSelector = '[role="combobox"], button[aria-haspopup="listbox"], [data-slot="select-trigger"], [id^="reka-select-trigger-"]';

    if (!expectedValue) return;

    firstPageList.getResidenceSection(labelText).then(($section) => {
        const $visibleTriggers = Cypress.$($section).find(triggerSelector).filter(':visible');
        if ($visibleTriggers.length > index) {
            cy.wrap($visibleTriggers.eq(index))
                .invoke('text')
                .then((text) => assertTextIncludes(text, expectedValue, `${labelText}[${index}]`));
            return;
        }

        cy.wrap($section)
            .find('select')
            .eq(index)
            .find('option:selected')
            .invoke('text')
            .then((text) => assertTextIncludes(text, expectedValue, `${labelText}[${index}]`));
    });
}

function assertCheckedChoice(sectionLabel, expectedLabel) {
    const normalizedExpected = normalizeText(expectedLabel);

    firstPageList.getOpenDialog()
        .contains('label', sectionLabel)
        .closest('div.text-sm, div.items-start')
        .then(($section) => {
            const $labels = Cypress.$($section).find('label');
            const matchedLabel = [...$labels].find((label) =>
                normalizeText(label.textContent || '').includes(normalizedExpected)
            );

            expect(matchedLabel, `${sectionLabel} option ${expectedLabel}`).to.exist;

            const forId = matchedLabel.getAttribute('for');
            if (forId) {
                cy.get(`#${forId}`).should('be.checked');
                return;
            }

            const $nestedInput = Cypress.$(matchedLabel).find('input').first();
            if ($nestedInput.length > 0) {
                cy.wrap($nestedInput).should('be.checked');
                return;
            }

            const $radioButton = Cypress.$(matchedLabel)
                .closest('button[role="radio"], [role="radio"]')
                .first();

            if ($radioButton.length > 0) {
                cy.wrap($radioButton).should('have.attr', 'aria-checked', 'true');
            }
        });
}

function verifyCreateChildInfoIsRight(expected = {}) {
    getDialogByMode('edit');
    firstPageList.getIdField().should('be.disabled');
    getDialogByMode('edit').contains('button:visible', '儲存變更').should('be.visible');
    getDialogByMode('edit').contains('button:visible', '取消').should('be.visible');

    if (expected.childName) {
        firstPageList.findInDialog('input[placeholder="請輸入孩童全名"]')
            .first()
            .should('have.value', String(expected.childName));
    }

    if (expected.childselfcode) {
        firstPageList.getIdField().should('have.value', String(expected.childselfcode));
    }

    if (expected.childBorncity) {
        assertResidenceValue('孩童戶籍地', 0, expected.childBorncity);
    }

    if (expected.childBornstate) {
        assertResidenceValue('孩童戶籍地', 1, expected.childBornstate);
    }

    if (expected.childYeartime) {
        firstPageList.findInDialog('input[type="date"], input[placeholder="年 / 月 / 日"]')
            .first()
            .should('have.value', String(expected.childYeartime));
    }

    if (expected.childGender) {
        const gender = String(expected.childGender).trim().toLowerCase();
        const targetValue = ['male', 'm', '男'].includes(gender) ? 'Male' : 'Female';

        firstPageList.getFieldSection('孩童性別').within(() => {
            cy.get('[role="radiogroup"]')
                .first()
                .find(`button[role="radio"][value="${targetValue}"], button[role="radio"][id$="-${targetValue}"]`)
                .first()
                .should('have.attr', 'aria-checked', 'true');
        });
    }

    if (expected.sameHomeResidence !== undefined) {
        const shouldBeChecked = expected.sameHomeResidence === true
            || ['true', 'yes', '1', '同戶籍地'].includes(String(expected.sameHomeResidence).toLowerCase().trim());

        firstPageList.getResidenceSection('孩童居住地').within(() => {
            cy.get('input[type="checkbox"]')
                .first()
                .should(shouldBeChecked ? 'be.checked' : 'not.be.checked');
        });

        if (!shouldBeChecked) {
            if (expected.childcity) {
                assertResidenceValue('孩童居住地', 0, expected.childcity);
            }

            if (expected.childstate) {
                assertResidenceValue('孩童居住地', 1, expected.childstate);
            }
        }
    }

    if (expected.over37Week !== undefined) {
        const over37Raw = String(expected.over37Week).toLowerCase().trim();
        const isDueDateFlow = ['no', 'false', '0', '否', '否，預產期', '否, 預產期'].includes(over37Raw)
            || expected.over37Week === false;

        assertCheckedChoice('出生週數是否超過37(含)週?', isDueDateFlow ? '否' : '是');

        if (isDueDateFlow && expected.dueDate) {
            firstPageList.findInDialog('input[name="dueDate"]')
                .first()
                .should('have.value', String(expected.dueDate));
        }
    }

    if (expected.childweight) {
        assertCheckedChoice('孩童出生體重', expected.childweight);
    }

    if (expected.peopletype !== undefined) {
        const peopleRaw = String(expected.peopletype).toLowerCase().trim();
        const isIndigenous = expected.peopletype === true
            || ['yes', 'true', '1', '是', '是，原住民族別'].includes(peopleRaw);

        assertCheckedChoice('是否為原住民?', isIndigenous ? '是' : '否');
    }
}

export {
    verifyCreateChildInfoIsRight,
};
