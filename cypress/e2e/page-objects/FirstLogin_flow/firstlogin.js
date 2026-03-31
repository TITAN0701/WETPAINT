
class firstlogin{
    constructor() {
        this.pageURL = '/login';
    }

    goToLoginPage() {
        cy.visit(this.pageURL);
    }

    clickFirstPageMessageAndButton(option){
        if(option === 'pass'){
            cy.contains('button', '開始使用，輕鬆掌握孩子的發展狀況 ').closest('div.items-center').find('svg').should('be.visible').click();
        }
        
    }

    clickSecondPageMessageAndButton(rolename, option){
        // 家長、老師、祖父母、兄弟姊妹、社工、其他
        cy.contains('div', rolename).closest('div.cursor-pointer').find('svg').should('be.visible').click();

        if(option === 'next'){
            cy.contains('button', /^\s*下一步\s*$/).should('be.visible').click();
        }

        if(option === 'back'){
            cy.contains('button', /^\s*返回\s*$/).should('be.visible').click();
        }
    }
    clickAnyPageButton(option){
        if(option === 'next'){
            cy.contains('button', /^\s*下一步\s*$/).should('be.visible').click();
        }

        if(option === 'back'){
            cy.contains('button', /^\s*返回\s*$/).should('be.visible').click();
        }
    }

    clickThirdPageMessageAndButton(rolename, option){
        const coreTitleRegex = /認識\s*WETPAINT\s*的核心功能/;
        cy.contains('h2:visible', coreTitleRegex).should('be.visible');

        const pickCoreCard = (name) => {
            const role = String(name).trim();
            const roleToAlt = {
                '動作發展': '動作發展',
                '認知發展': '認知發展',
                '語言發展': '語言發展',
                '社交發展': '社會情緒',
                '社會情緒': '社會情緒',
            };
            const targetAlt = roleToAlt[role];

            if (!targetAlt) {
                throw new Error(`第三頁不支援的核心功能: ${role}`);
            }

            cy.get(`img[alt="${targetAlt}"]:visible`, { timeout: 10000 })
                .first()
                .scrollIntoView()
                .click({ force: true });
        };

        pickCoreCard(rolename);

        if(option === 'next'){
            cy.contains('button', /^\s*下一步\s*$/).should('be.visible').click();
        }

        if(option === 'back'){
            cy.contains('button', /^\s*返回\s*$/).should('be.visible').click();
        }
    }

    clickFourPageMessageAndButton(formDataOrChildName, ...legacyArgs){
        const formData =
            typeof formDataOrChildName === 'object' && formDataOrChildName !== null && !Array.isArray(formDataOrChildName)
                ? formDataOrChildName
                : {
                    childName: formDataOrChildName,
                    childBorncity: legacyArgs[0],
                    childBornstate: legacyArgs[1],
                    childselfcode: legacyArgs[2],
                    childcity: legacyArgs[3],
                    childstate: legacyArgs[4],
                    childYeartime: legacyArgs[5],
                    childGender: legacyArgs[6],
                    Over37weak: legacyArgs[7],
                    dudate: legacyArgs[8],
                    childweight: legacyArgs[9],
                    peopletype: legacyArgs[10],
                    type: legacyArgs[11],
                    sameHomeResidence: legacyArgs[12],
                };

        const {
            childName,
            childBorncity,
            childBornstate,
            childselfcode,
            childcity,
            childstate,
            childYeartime,
            childGender,
            childweight,
            peopletype,
            sameHomeResidence,
        } = formData;
        const over37Week = formData.over37Week ?? formData.Over37weak;
        const dueDate = formData.dueDate ?? formData.dudate;
        const indigenousType = formData.indigenousType ?? formData.type;
        const pickResidencePair = (labelText, cityValue, stateValue) => {
            const section = () => cy.contains('label', labelText).closest('div.text-sm');
            const getCombobox = (index) => {
                return section()
                    .find('button[role="combobox"]')
                    .eq(index)
                    .should('be.visible');
            };

            const openCombobox = (index) => {
                return getCombobox(index)
                    .click({ force: true })
                    .should('have.attr', 'aria-expanded', 'true')
                    .then(($btn) => $btn.attr('aria-controls'));
            };

            const fallbackSelectByValue = (index, target) => {
                return section()
                    .find('select[name="homeResidence"]')
                    .eq(index)
                    .find('option')
                    .then(($opts) => {
                        const matched = [...$opts].find((opt) => {
                            const text = (opt.textContent || '').trim();
                            const value = String(opt.value || '').trim();
                            const normalizeText = (txt) => String(txt || '')
                                .replace(/\s+/g, '')
                                .replace(/臺/g, '台')
                                .trim();
                            const targetN = normalizeText(target);
                            return (
                                normalizeText(text) === targetN
                                || normalizeText(text).includes(targetN)
                                || normalizeText(value) === targetN
                                || normalizeText(value).includes(targetN)
                            );
                        });
                        expect(matched, `option: ${target}`).to.exist;
                        return section()
                            .find('select[name="homeResidence"]')
                            .eq(index)
                            .select(matched.value, { force: true });
                    });
            };

            const chooseOpenedOption = (panelId, value, index) => {
                const target = String(value).trim();
                const normalizeText = (txt) => String(txt || '')
                    .replace(/\s+/g, '')
                    .replace(/臺/g, '台')
                    .trim();
                const normalizedTarget = normalizeText(target);
                const targetRegex = new RegExp(`^\\s*${Cypress._.escapeRegExp(target)}\\s*$`);
                const panelChain = panelId
                    ? cy.get(`[id="${panelId}"]`, { timeout: 10000, withinSubject: null })
                    : cy.get(
                        '[id^="reka-select-content-"][data-state="open"], [role="listbox"][data-state="open"], [role="listbox"]:visible',
                        { timeout: 10000, withinSubject: null }
                    ).filter(':visible').last();

                const clickExactOptionInPanel = ($panel) => {
                    const toClickable = (el) => {
                        if (!el) return null;
                        if (el.matches?.('[role="option"], [data-radix-collection-item], [data-value], option')) {
                            return el;
                        }
                        return el.closest?.('[role="option"], [data-radix-collection-item], [data-value], li, button, div') || el;
                    };

                    const getClickable = (el) => {
                        return toClickable(el);
                    };

                    const findExactOption = () => {
                        const $root = Cypress.$($panel);
                        const $options = $root
                            .find('[role="option"], [data-radix-collection-item], [data-value], option');
                        const $leafNodes = $root
                            .find('span, div, li')
                            .filter((_, el) => Cypress.$(el).children().length === 0);

                        const exactStructured = [...$options].find((el) => {
                            const text = (el.textContent || '').trim();
                            const dataValue = String(el.getAttribute?.('data-value') || '').trim();
                            const valueAttr = String(el.value || '').trim();
                            return (
                                targetRegex.test(text)
                                || normalizeText(text) === normalizedTarget
                                || normalizeText(dataValue) === normalizedTarget
                                || normalizeText(valueAttr) === normalizedTarget
                            );
                        });

                        if (exactStructured) return getClickable(exactStructured);

                        const exactLeaf = [...$leafNodes].find((el) =>
                            normalizeText(el.textContent || '') === normalizedTarget
                        );

                        return getClickable(exactLeaf);
                    };

                    const panelEl = $panel[0];
                    const step = Math.max(80, Math.floor((panelEl?.clientHeight || 200) * 0.75));
                    const maxAttempts = 24;

                    const getScrollContainers = () => {
                        if (!panelEl) return [];
                        const all = [panelEl, ...panelEl.querySelectorAll('*')];
                        return all.filter((el) => {
                            const canScroll = el.scrollHeight > el.clientHeight + 2;
                            if (!canScroll) return false;
                            const style = window.getComputedStyle(el);
                            return /(auto|scroll)/.test(style.overflowY || '');
                        });
                    };

                    const scrollSearch = (attempt = 0) => {
                        const found = findExactOption();
                        if (found) {
                            return cy.wrap(found).scrollIntoView().click({ force: true }).then(() => true);
                        }

                        if (!panelEl || attempt >= maxAttempts) {
                            return cy.wrap(null, { log: false });
                        }

                        const containers = getScrollContainers();
                        if (containers.length === 0) {
                            return cy.wrap(null, { log: false });
                        }

                        let anyMoved = false;
                        containers.forEach((el) => {
                            const maxTop = Math.max(0, el.scrollHeight - el.clientHeight);
                            const nextTop = Math.min(maxTop, el.scrollTop + step);
                            if (nextTop > el.scrollTop) anyMoved = true;
                            el.scrollTop = nextTop;
                            el.dispatchEvent(new Event('scroll', { bubbles: true }));
                        });

                        return cy.wait(80, { log: false }).then(() => {
                            if (!anyMoved) {
                                return null;
                            }
                            return scrollSearch(attempt + 1);
                        });
                    };

                    const containers = getScrollContainers();
                    containers.forEach((el) => {
                        el.scrollTop = 0;
                        el.dispatchEvent(new Event('scroll', { bubbles: true }));
                    });

                    const immediate = findExactOption();
                    if (immediate) {
                        return cy.wrap(immediate).scrollIntoView().click({ force: true }).then(() => true);
                    }

                    return cy.wait(80, { log: false }).then(() => scrollSearch());
                };

                return panelChain.should('exist').then(($panel) =>
                        clickExactOptionInPanel($panel).then((result) => ({ result, $panel }))
                    ).then(({ result, $panel }) => {
                        if (result) return result;
                        const preview = [...Cypress.$($panel).find('[role="option"], [data-radix-collection-item], [data-value], li, span')]
                            .map((el) => (el.textContent || '').trim())
                            .filter(Boolean)
                            .slice(0, 15)
                            .join(' | ');
                        Cypress.log({
                            name: 'district-find-fallback',
                            message: `target=${target}; options=${preview}`,
                        });
                        return fallbackSelectByValue(index, target);
                    })
                    .then(() => {
                        return section().find('select[name="homeResidence"]').eq(index).find('option:selected').invoke('text').then((selectedLabel) => {
                                const selectedN = normalizeText(selectedLabel);
                                if (selectedN.includes(normalizedTarget)) {
                                    return;
                                }

                                return getCombobox(index).invoke('text').then((comboText) => {
                                        expect(
                                            normalizeText(comboText),
                                            `combobox[${index}] selected text`
                                        ).to.include(normalizedTarget);
                                    });
                            });
                    });
            };

            return openCombobox(0).then((panelId) => chooseOpenedOption(panelId, cityValue, 0)).then(() => {
                    section().find('select[name="homeResidence"]').eq(1)
                        .find('option').should(($opts) => {
                            expect($opts.length, 'district options loaded').to.be.greaterThan(1);
                        });
                }).then(() => {
                    getCombobox(1).should(($btn) => {
                        expect($btn.is(':disabled'), 'district combobox disabled').to.eq(false);
                        expect($btn.attr('aria-disabled') === 'true', 'district combobox aria-disabled').to.eq(false);
                    });
                }).then(() => openCombobox(1)).then((panelId) => chooseOpenedOption(panelId, stateValue, 1));
        };

        cy.contains('label', '孩童姓名').closest('div.items-center').should('be.visible');
        cy.get('input[placeholder="請輸入孩童全名"]').should('be.visible').clear().type(childName);

        pickResidencePair('孩童戶籍地', childBorncity, childBornstate);

        cy.contains('label', '孩童身分證字號 (首字需大寫)').closest('div.items-center').should('be.visible');
        cy.get('input[placeholder="F123456789"]').should('be.visible').clear().type(childselfcode);

        cy.contains('label', '孩童居住地').closest('div.text-sm').within(() => {
            const sameAddress = sameHomeResidence === true || ['true', 'yes', '1', '同戶籍地'].includes(
                String(sameHomeResidence).toLowerCase().trim()
            );

            if (sameAddress) {
                cy.get('input[type="checkbox"]').first().check({ force: true }).should('be.checked');
            }
        });

        const sameAddress = sameHomeResidence === true || ['true', 'yes', '1', '同戶籍地'].includes(
            String(sameHomeResidence).toLowerCase().trim()
        );
        if (!sameAddress) {
            pickResidencePair('孩童居住地', childcity, childstate);
        }

        cy.contains('label', '孩童出生年/月/日').closest('div.text-sm')
        .find('p[id$="-description"]').should('contain.text', '2個月以下/6歲以上無法進行測試');
        expect(String(childYeartime ?? '').trim(), 'childYeartime').to.not.equal('');
        cy.contains('label', '孩童出生年/月/日').closest('div.text-sm')
            .find('input[type="date"]').first().should('be.visible').click({ force: true }).clear({ force: true }).type(String(childYeartime), { force: true });

        cy.contains('label', '孩童性別').closest('div.text-sm').within(() => {
            const gender = String(childGender ?? '').trim().toLowerCase();
            let targetValue = '';

            switch (gender) {
                case 'male':
                case 'm':
                case '男':
                    targetValue = 'Male';
                    break;
                case 'female':
                case 'f':
                case '女':
                    targetValue = 'Female';
                    break;
                default:
                    throw new Error(`childGender 不支援: ${childGender}`);
            }

            cy.get('[role="radiogroup"]')
                .first()
                .find(`button[role="radio"][value="${targetValue}"], button[role="radio"][id$="-${targetValue}"]`)
                .first()
                .click({ force: true })
                .should('have.attr', 'aria-checked', 'true');

        });

        cy.contains('div', '出生週數是否超過37(含)週?').closest('div.items-start').within(() => {
            const over37Raw = String(over37Week).toLowerCase().trim();
            const yesValues = ['yes', 'true', '1', '是'];
            const noValues = ['no', 'false', '0', '否', '否，預產期', '否, 預產期'];
            const isDueDateFlow = noValues.includes(over37Raw)
                || over37Week === false
                || (!yesValues.includes(over37Raw) && Boolean(over37Raw));

            if (isDueDateFlow) {
                cy.contains('label', /否[,，]?\s*預產期/).click();
                cy.get('input[name="dueDate"]').should('be.visible');
                if (dueDate) {
                    cy.get('input[name="dueDate"]').clear().type(dueDate);
                }
            } else {
                cy.contains('label', '是').click();
            }
        });

        cy.contains('label', '孩童出生體重').closest('div.text-sm').within(() => {
            if (childweight === '<2500g') {
                cy.contains('label', '<2500g').click();
            }

            if (childweight === '≥2500g') {
                cy.contains('label', '≥2500g').click();
            }
        });

        cy.contains('label', '是否為原住民?').closest('div.items-start').within(() => {
            const peopleRaw = String(peopletype).toLowerCase().trim();
            const isIndigenous = peopletype === true
                || ['yes', 'true', '1', '是', '是，原住民族別'].includes(peopleRaw)
                || (peopleRaw !== '' && !['no', 'false', '0', '否'].includes(peopleRaw));

            if (isIndigenous) {
                cy.contains('label', '是，原住民族別').should('be.visible');
                if (indigenousType) {
                    cy.get('select[name="indigenousTribe"]').eq(0).select(indigenousType, { force: true });
                }
            } else {
                cy.contains('label', '否').click();
            }
        });
    }

    clickConfirmButton(type){
        cy.contains('h3', '請確認資訊填寫正確').should('be.visible');
        cy.contains('p', '送出之後無法編輯/刪除資訊').should('be.visible');

        if(type === 'back'){
            cy.contains('button', /^\s*返回確認\s*$/).should('be.visible').click();
        }
        if (type === 'yes'){
            cy.contains('button', /^\s*確認送出\s*$/).click();
        }
    }

    clickCompleteButton(type){
        switch(type){
            case 'pass':
                cy.contains('button', '開始使用 WETPAINT ').should('be.visible').click();
                break;
            case 'no':
                // Keep user on completion page, do not click "開始使用 WETPAINT"
                cy.contains('button',  /^\s*返回確認\s*$/).should('be.visible');
                break;
            case 'back':
                cy.contains('button', /^\s*返回\s*$/).should('be.visible').click();
                break;
            default:
                throw new Error(`clickCompleteButton 不支援: ${type}`);
        }
    }

    getCurrentOnboardingStep(retries = 10, intervalMs = 500){
        return cy.location('pathname', { timeout: 10000 }).then((pathname) => {
            // Prefer URL-based step detection. Example: /onboarding/step2
            const stepMatch = pathname.match(/\/onboarding\/step(\d+)/i);
            if (stepMatch?.[1]) {
                return Number(stepMatch[1]);
            }

            return cy.get('body', { timeout: 10000 }).then(($body) => {
                const text = $body.text();

                let stepFromDom = 0;

                if (
                    $body.find('input[placeholder="請輸入孩童全名"]').length > 0
                    || text.includes('孩童姓名')
                ) {
                    stepFromDom = 4;
                }

                if (
                    stepFromDom === 0 &&
                    (
                        $body.find('img[src*="動作發展"]').length > 0
                        || text.includes('認識 WETPAINT 的核心功能')
                    )
                ) {
                    stepFromDom = 3;
                }

                if (stepFromDom === 0 && (text.includes('請選擇您的使用者身份') || text.includes('使用者身份'))) {
                    stepFromDom = 2;
                }

                if (
                    stepFromDom === 0 &&
                    (
                        text.includes('歡迎使用')
                        || text.includes('開始使用，輕鬆掌握孩子的發展狀況')
                    )
                ) {
                    stepFromDom = 1;
                }

                if (stepFromDom > 0) {
                    return stepFromDom;
                }

                if (retries <= 0) {
                    return 0;
                }

                return cy.wait(intervalMs, { log: false }).then(() =>
                    this.getCurrentOnboardingStep(retries - 1, intervalMs)
                );
            });
        });
    }

    completeOnboardingFromCurrentStep({
        roleName = '家長',
        domainName = '動作發展',
        formData = null,
        confirmType = 'yes',
        completeType = 'pass',
    } = {}){
        return this.getCurrentOnboardingStep().then((step) => {
            switch (step) {
                case 1:
                    this.clickFirstPageMessageAndButton('pass');
                    this.clickSecondPageMessageAndButton(roleName, 'next');
                    this.clickThirdPageMessageAndButton(domainName, 'next');
                    if (formData) {
                        this.clickFourPageMessageAndButton(formData);
                        this.clickAnyPageButton('next');
                        this.clickConfirmButton(confirmType);
                        this.clickCompleteButton(completeType);
                    }
                    break;
                case 2:
                    this.clickSecondPageMessageAndButton(roleName, 'next');
                    this.clickThirdPageMessageAndButton(domainName, 'next');
                    if (formData) {
                        this.clickFourPageMessageAndButton(formData);
                        this.clickAnyPageButton('next');
                        this.clickConfirmButton(confirmType);
                        this.clickCompleteButton(completeType);
                    }
                    break;
                case 3:
                    this.clickThirdPageMessageAndButton(domainName, 'next');
                    if (formData) {
                        this.clickFourPageMessageAndButton(formData);
                        this.clickAnyPageButton('next');
                        this.clickConfirmButton(confirmType);
                        this.clickCompleteButton(completeType);
                    }
                    break;
                case 4:
                    if (formData) {
                        this.clickFourPageMessageAndButton(formData);
                        this.clickAnyPageButton('next');
                        this.clickConfirmButton(confirmType);
                        this.clickCompleteButton(completeType);
                    }
                    break;
                default:
                    throw new Error(`無法判斷目前 onboarding 頁面，step=${step}`);
            }
        });

    }
}


export default firstlogin;
