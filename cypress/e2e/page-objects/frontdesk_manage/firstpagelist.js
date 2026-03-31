import FrontDeskPage from './frontdeskpage';

import FirstPageListTestMode from './firstpagelist_testmode';

class FirstPageList extends FirstPageListTestMode {
    constructor() {
        super();
        this.currentFormMode = 'create';
    }

    getDialogTitle(mode = this.currentFormMode) {
        const titles = {
            create: '新增孩童檔案',
            edit: '編輯孩童檔案',
        };

        return titles[mode] ?? titles.create;
    }

    getOpenDialog() {
        return cy.contains('h2:visible', this.getDialogTitle(), { timeout: 10000 }).then(($title) => {
            const $dialog = $title.closest('[role="dialog"], [data-state="open"]');
            const $root = $dialog.length ? $dialog.first() : $title.parent().parent();
            return cy.wrap($root).should('be.visible');
        });
    }

    getprofileButtonlabel(type){
        const content = {
            Edit: ' 編輯檔案 ',
        };
        return content[type];
    }

    getadviceResultButtonlabel() {
        return '最新檢測結果';
    }

    getadviceHistoryButtonlabel() {
        return '歷史紀錄';
    }

    getadviceSeekMapButtonlabel() {
        return '查看就醫地圖';
    }
    getrecordDropdown(index){
        return cy.get('div.group.relative.flex.w-full.flex-col').eq(index);
    }

    getadviceResoultButton() {
        return cy.contains('h2:visible, div:visible, button:visible', this.getadviceResultButtonlabel());
    }

    getadviceHistoryButton() {
        return cy.contains('div:visible, button:visible', this.getadviceHistoryButtonlabel());
    }

    getadviceSeekMapButton() {
        return cy.contains('div:visible, button:visible', this.getadviceSeekMapButtonlabel());
    }
    getrecordPanel(){
        return this.getTabControl(this.getTabTitle('record'));
    }

    getadvicePanel(){
        return this.getTabControl(this.getTabTitle('advice'));
    }

    getprofilePanel(){
        return this.getTabControl(this.getTabTitle('profile'));
    }

    getprofileEditPanel(type){
        return cy.contains('button', this.getprofileButtonlabel(type));

    }
    
    getChildfileButton(name){
        return cy.contains('div.group.cursor-pointer', name);
    }

    //點擊孩童檔案下方方塊
    clickChildfileButton(name){
        this.getChildfileButton(name).click();
    }

    //檢測紀錄分頁中的下拉方塊
    clickrecordButton(index){
        this.getrecordPanel().click();
        this.getrecordDropdown(index).click();
    }

    //發展結果與建議頁面
    clickadviceButton(){
        this.getadvicePanel().click();
    }
    //點擊最新檢測結果按扭 -> Result
    clickadviceResultButton() {
        this.getadviceResoultButton().click();
    }

    //點擊歷史紀錄按扭 -> History
    clickhistoryButton() {
        this.getadviceHistoryButton().click();
    }

    //點擊查看就醫地圖 -> SeekMap
    clickSeeKMapButton() {
        this.getadviceSeekMapButton().click();
    }

    //點擊孩童資料
    clickProfileButton(){
        this.getprofilePanel().click();
    }

    //點擊編輯檔案 -> Edit
    clickEditProfileButton(type){
        this.currentFormMode = 'edit';
        this.getprofileEditPanel(type).click();
    }

    normalizeText(value) {
        return String(value ?? '').replace(/\s+/g, '').replace(/臺/g, '台').trim();
    }

    resolveFormData(formDataOrChildName, legacyArgs) {
        if (typeof formDataOrChildName === 'object' && formDataOrChildName !== null && !Array.isArray(formDataOrChildName)) {
            return formDataOrChildName;
        }

        return {
            childName: formDataOrChildName,
            childBorncity: legacyArgs[0],
            childBornstate: legacyArgs[1],
            childselfcode: legacyArgs[2],
            childcity: legacyArgs[3],
            childstate: legacyArgs[4],
            childYeartime: legacyArgs[5],
            childGender: legacyArgs[6],
            over37Week: legacyArgs[7],
            dueDate: legacyArgs[8],
            childweight: legacyArgs[9],
            peopletype: legacyArgs[10],
            indigenousType: legacyArgs[11],
            sameHomeResidence: legacyArgs[12],
        };
    }

    findInDialog(selector) {
        return this.getOpenDialog().find(selector);
    }

    getIdField() {
        return this.findInDialog('input[placeholder="F123456789"]').first();
    }

    typeInDialog(selector, value) {
        const text = String(value ?? '');

        this.findInDialog(selector).first().should('be.visible');
        this.findInDialog(selector).first().click({ force: true });
        this.findInDialog(selector).first().clear({ force: true });
        this.findInDialog(selector).first().type(text, { force: true });
    }

    setDateInDialog(value, selector = 'input[type="date"], input[placeholder="撟?/ ??/ ??]') {
        const text = String(value ?? '').trim();

        this.findInDialog('input[type="date"], input[placeholder="年 / 月 / 日"]').first().should('be.visible').then(($input) => {
                const input = $input[0];
                input.value = text;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('blur', { bubbles: true }));
            });
    }

    //孩童性別的範圍
    setDateFieldInDialog(selector, value) {
        const text = String(value ?? '').trim();
        this.findInDialog(selector).first().should('be.visible').then(($input) => {
                const input = $input[0];
                input.value = text;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('blur', { bubbles: true }));
            });
    }

    getFieldSection(labelText) {
        return this.getOpenDialog().contains('label', labelText).closest('div.text-sm');
    }
    
    getResidenceSection(labelText) {
        return this.getOpenDialog().contains('label', labelText).closest('div.text-sm');
    }

    goToChildListPage() {
        this.clickFirstPageButton();
        this.verifyFirstPageListPageLoaded();
    }

    verifyFirstPageListPageLoaded() {
        cy.contains('div:visible, h1:visible, h2:visible, span:visible', '孩童檔案').should('exist');
        cy.contains('button:visible, span:visible', '新增檔案').should('exist');
    }

    openKidsAddFileDialog() {
        this.currentFormMode = 'create';
        cy.contains('button:visible', '新增檔案').should('exist').click({ force: true });
        this.getOpenDialog();
    }

    openEditChildFileDialog() {
        this.currentFormMode = 'edit';
        this.clickEditProfileButton('Edit');
        this.getOpenDialog();
    }

    pickResidencePair(labelText, cityValue, stateValue) {
        const section = () => this.getResidenceSection(labelText);
        const triggerSelector = '[role="combobox"], button[aria-haspopup="listbox"], [data-slot="select-trigger"], [id^="reka-select-trigger-"]';
        const panelSelector = '[id^="reka-select-content-"][data-state="open"], [role="listbox"][data-state="open"], [id^="reka-select-content-"]:visible, [role="listbox"]:visible';

        const chooseOption = (panelId, value, index) => {
            const targetText = String(value ?? '').trim();
            const normalizedTarget = this.normalizeText(targetText);
            const panelChain = panelId
                ? cy.get(`#${panelId}`, { timeout: 10000 })
                : cy.get(panelSelector, { timeout: 10000 }).filter(':visible').last();

            return panelChain.should('be.visible').then(($panel) => {
                const $panelEl = Cypress.$($panel);
                const $target = $panelEl.find('[role="option"], [data-radix-collection-item], [data-value], li, button, div, span')
                    .filter((_, el) => this.normalizeText(Cypress.$(el).text()) === normalizedTarget).first();

                if ($target.length) {
                    return cy.wrap($target).scrollIntoView().click({ force: true });
                }

                return section().find('select').eq(index).select(targetText, { force: true });
            });
        };

        const openCombobox = (index) => {
            return section().find(triggerSelector).eq(index).should('be.visible').click({ force: true })
                .then(($btn) => $btn.attr('aria-controls'));
        };

        return openCombobox(0).then((panelId) => chooseOption(panelId, cityValue, 0))
            .then(() => openCombobox(1)).then((panelId) => chooseOption(panelId, stateValue, 1));
    }

    fillChildForm(formDataOrChildName, legacyArgs = [], options = {}){
        const formData = this.resolveFormData(formDataOrChildName, legacyArgs);
        const{
            mode = 'create',
            skipId = false,
            assertIdDisabled = false,
        } = options;
        this.currentFormMode = mode;
        const sameAddress = formData.sameHomeResidence === true
            || ['true', 'yes', '1', '同戶籍地'].includes(String(formData.sameHomeResidence ?? '').toLowerCase().trim());

        this.typeInDialog('input[placeholder="請輸入孩童全名"]', formData.childName);
        this.pickResidencePair('孩童戶籍地', formData.childBorncity, formData.childBornstate);

        if (assertIdDisabled) {
            this.getIdField().should('be.disabled');
            if (formData.childselfcode) {
                this.getIdField().should('have.value', String(formData.childselfcode));
            }
        } else if (!skipId && formData.childselfcode) {
            this.getIdField().should('be.enabled');
            this.typeInDialog('input[placeholder="F123456789"]', formData.childselfcode);
        }

        if (sameAddress) {
            this.getResidenceSection('孩童居住地').within(() => {
                cy.get('input[type="checkbox"]').first().check({ force: true }).should('be.checked');
            });
        } else {
            this.pickResidencePair('孩童居住地', formData.childcity, formData.childstate);
        }

        this.setDateInDialog(formData.childYeartime);

        this.getFieldSection('孩童性別').within(() => {
            const gender = String(formData.childGender ?? '').trim().toLowerCase();
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
                    throw new Error(`childGender 不支援: ${formData.childGender}`);
            }

            cy.get('[role="radiogroup"]').first().find(`button[role="radio"][value="${targetValue}"], button[role="radio"][id$="-${targetValue}"]`)
                .first().click({ force: true }).should('have.attr', 'aria-checked', 'true');
        });

        this.getOpenDialog().contains('div', '出生週數是否超過37(含)週?').closest('div.items-start').within(() => {
            const over37Raw = String(formData.over37Week ?? '').toLowerCase().trim();
            const isDueDateFlow = ['no', 'false', '0', '否', '否，預產期', '否, 預產期'].includes(over37Raw)
                || formData.over37Week === false;

            if (isDueDateFlow) {
                cy.contains('label', /否[,，]?\s*預產期/).click({ force: true });
            } else {
                cy.contains('label', '是').click({ force: true });
            }
        });

        if (
            formData.dueDate
            && formData.over37Week !== true
            && !['yes', 'true', '1', '是'].includes(String(formData.over37Week ?? '').toLowerCase().trim())
        ) {
            this.setDateFieldInDialog('input[name="dueDate"]', formData.dueDate);
        }

        this.getFieldSection('孩童出生體重').within(() => {
            if (String(formData.childweight ?? '').trim() === '<2500g') {
                cy.contains('label', '<2500g').click({ force: true });
            } else {
                cy.contains('label', '≥2500g').click({ force: true });
            }
        });

        this.getOpenDialog().contains('label', '是否為原住民?').closest('div.items-start').within(() => {
            const peopleRaw = String(formData.peopletype ?? '').toLowerCase().trim();
            const isIndigenous = formData.peopletype === true
                || ['yes', 'true', '1', '是', '是，原住民族別'].includes(peopleRaw);

            if (isIndigenous) {
                cy.contains('label', '是，原住民族別').click({ force: true });
            } else {
                cy.contains('label', '否').click({ force: true });
            }
        });

        if (formData.indigenousType) {
            this.findInDialog('select[name="indigenousTribe"]').first().select(formData.indigenousType, { force: true });
        }

        return formData;
    }


    fillKidsAddFileForm(formDataOrChildName, ...legacyArgs) {
        return this.fillChildForm(formDataOrChildName, legacyArgs, {
            mode: 'create',
            skipId: false,
            assertIdDisabled: false,
        });
    }

    fillEditChildForm(formDataOrChildName, ...legacyArgs) {
        return this.fillChildForm(formDataOrChildName, legacyArgs, {
            mode: 'edit',
            skipId: true,
            assertIdDisabled: true,
        });
    }

    clickCreateFileButton() {
        this.getOpenDialog().contains('button:visible', '建立檔案').should('be.visible').click({ force: true });
    }

    clickCancelAddFileButton() {
        this.getOpenDialog().contains('button:visible', '取消').should('be.visible').click({ force: true });
    }

    clickEditSaveFileButton(){
        this.getOpenDialog().contains('button:visible', '儲存變更').should('be.visible').click({ force: true });
    }

    clickEditCancelFileButton(){
        this.getOpenDialog().contains('button:visible', ' 取消 ').should('be.visible').click({ force: true });
    }
}

export default FirstPageList;
