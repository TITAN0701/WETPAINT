import FrontDeskPage from './frontdeskpage';

class FirstPageListTestMode extends FrontDeskPage {
    getChoiceQuestonlabe(type){
        const titles ={
            yes: '是',
            no: '否',
            non: '未觀察',
        };
        return titles[type];
    }

    getTabTitle(type){
        const titles ={
            development: '發展檢測',
            record: '檢測紀錄',
            advice: '發展結果與建議',
            profile: '孩童資料',
        };
        return titles[type];
    }

    getdevelopmentButtonlabel(type){
        const content = {
            start: ' 開始檢測 ',
            restart: ' 繼續檢測 ',
            cancel: '取消',
        };
        return content[type];
    }

    getChoiceQuestionslabel(type){
        const content = {
            next: '下一題',
            start: '下一題',
            skip: ' 跳過 ',
            cancel: '取消',
        };
        return content[type];
    }

    getdevelopmentButtonTypes(type) {
        if (type === 'start') {
            return ['start', 'restart'];
        }

        return [type];
    }

    getDevelopmentWaitLabels() {
        return ['下次檢測日期'];
    }

    getTutorialActionLabels(type){
        const content = {
            start: ['開始錄製', '開始拍照'],
            skip: ['跳過'],
            cancel: ['取消'],
        };
        return content[type] ?? [];
    }

    getdevelopmentButton(type){
        const candidateTypes = this.getdevelopmentButtonTypes(type);
        const selectors = 'button:visible, [role="button"]:visible, a:visible, div:visible, span:visible';

        return cy.get('body').then(($body) => {
            const resolvedType = candidateTypes.find((candidateType) => {
                const label = this.getdevelopmentButtonlabel(candidateType)?.trim();

                if (!label) {
                    return false;
                }

                return Cypress.$($body).find(selectors).filter((_, button) => {
                    return Cypress.$(button).text().trim() === label;
                }).length > 0;
            });

            if (!resolvedType) {
                throw new Error(`找不到發展檢測按鈕: ${candidateTypes.join(' / ')}`);
            }

            return cy.contains(selectors, this.getdevelopmentButtonlabel(resolvedType).trim());
        });
    }

    getDevelopmentEntryState() {
        const selectors = 'button:visible, [role="button"]:visible, a:visible, div:visible, span:visible';
        const startLabels = this.getdevelopmentButtonTypes('start')
            .map((candidateType) => this.getdevelopmentButtonlabel(candidateType)?.trim())
            .filter(Boolean);
        const waitLabels = this.getDevelopmentWaitLabels();

        return cy.get('body').then(($body) => {
            const $visibleControls = Cypress.$($body).find(selectors);
            const hasStartButton = startLabels.some((label) => {
                return $visibleControls.filter((_, el) => Cypress.$(el).text().trim() === label).length > 0;
            });

            if (hasStartButton) {
                return 'actionable';
            }

            const normalizedText = Cypress.$($body).text().replace(/\s+/g, '');
            const hasWaitIndicator = waitLabels.some((label) => normalizedText.includes(String(label).replace(/\s+/g, '')));

            if (hasWaitIndicator) {
                return 'waiting';
            }

            return 'unknown';
        });
    }

    getdevelopmentPanel(){
        return this.getTabControl(this.getTabTitle('development'));
    }

    getTabControl(title) {
        const selectors = 'button:visible, [role="tab"]:visible, [aria-selected]:visible, div:visible, span:visible';
        return cy.contains(selectors, title);
    }

    getOpenTabDropdown() {
        return cy.get('[id^="reka-select-content-"], [role="listbox"]').filter(':visible').last();
    }

    getChoiceQuestionsButton(type){
        return cy.contains('button:visible, label:visible, div[role="button"]:visible', this.getChoiceQuestonlabe(type));
    }

    getVisibleButtonByLabels(labels) {
        return cy.get('body').then(($body) => {
            const resolvedLabel = labels.find((label) => {
                return Cypress.$($body).find('button:visible').filter((_, button) => {
                    return Cypress.$(button).text().trim() === label;
                }).length > 0;
            });

            if (!resolvedLabel) {
                throw new Error(`找不到按鈕: ${labels.join(' / ')}`);
            }

            return cy.contains('button:visible', resolvedLabel);
        });
    }

    getTutorialActionButton(option){
        return this.getVisibleButtonByLabels(this.getTutorialActionLabels(option));
    }

    getChoiceQuestionButton(option){
        return cy.contains('button:visible', this.getChoiceQuestionslabel(option).trim());
    }

    getTestModeScreenState() {
        return cy.location('href', { timeout: 10000 }).then((href) => {
            return cy.get('body', { timeout: 10000 }).should('be.visible').then(($body) => {
                const visibleText = Cypress.$($body).text();
                const normalizedText = visibleText.replace(/\s+/g, '');

                if (
                    normalizedText.includes('測驗總覽')
                    || href.includes('step=overview')
                    || (
                        normalizedText.includes('歡迎使用WETPAINT')
                        && normalizedText.includes('開始檢測')
                    )
                ) {
                    return 'overview';
                }

                if (
                    normalizedText.includes('影片拍攝教學')
                    || normalizedText.includes('照片拍攝教學')
                    || normalizedText.includes('開始錄製')
                    || normalizedText.includes('開始拍照')
                ) {
                    return 'tutorial';
                }

                if (
                    normalizedText.includes('下一題')
                    || (
                        normalizedText.includes('跳過')
                        && normalizedText.includes('取消')
                    )
                ) {
                    return 'question';
                }

                return 'unknown';
            });
        });
    }

    clickAiFlowActionButton(option = 'start') {
        const button = this.getTutorialActionButton(option).should('be.visible');

        if (option === 'start') {
            return button.should(($button) => {
                expect($button.prop('disabled'), '教學頁開始按鈕不應為 disabled').to.eq(false);
                expect($button.attr('aria-disabled'), '教學頁開始按鈕不應為 aria-disabled=true').not.to.eq('true');
            }).click();
        }

        return button.click({ force: true });
    }

    clickChoiceQuestionActionButton(option = 'next') {
        const resolvedOption = option === 'start' ? 'next' : option;
        return this.getChoiceQuestionButton(resolvedOption).should('be.visible').click({ force: true });
    }

    resolveFlowAction(flowAction) {
        if (typeof flowAction === 'string') {
            return { action: flowAction };
        }

        if (flowAction?.answer && !flowAction?.action) {
            return {
                action: 'next',
                ...flowAction,
            };
        }

        return flowAction ?? {};
    }

    resolveFlowActionForScreen(flowAction, screenState) {
        if (
            flowAction
            && typeof flowAction === 'object'
            && !Array.isArray(flowAction)
            && !Object.prototype.hasOwnProperty.call(flowAction, 'action')
            && (
                Object.prototype.hasOwnProperty.call(flowAction, 'overview')
                || Object.prototype.hasOwnProperty.call(flowAction, 'tutorial')
                || Object.prototype.hasOwnProperty.call(flowAction, 'question')
                || Object.prototype.hasOwnProperty.call(flowAction, 'default')
            )
        ) {
            return this.resolveFlowAction(flowAction[screenState] ?? flowAction.default ?? {});
        }

        return this.resolveFlowAction(flowAction);
    }

    hasFlowActionForScreen(flowAction, screenState) {
        return Boolean(
            flowAction
            && typeof flowAction === 'object'
            && !Array.isArray(flowAction)
            && Object.prototype.hasOwnProperty.call(flowAction, screenState)
        );
    }

    answerChoiceQuestion(answer) {
        if (!answer) {
            throw new Error('Choice question requires answer: yes / no / non');
        }

        return this.getChoiceQuestionsButton(answer).should('be.visible').click({ force: true });
    }

    ensureQuestionScreen(tutorialAction = 'skip') {
        return this.getTestModeScreenState().then((screenState) => {
            if (screenState === 'question') {
                return 'question';
            }

            if (screenState === 'tutorial') {
                this.clickAiFlowActionButton(tutorialAction);
                return this.ensureQuestionScreen(tutorialAction);
            }

            throw new Error(`Expected question or tutorial screen before answering, got ${screenState}`);
        });
    }

    answerChoiceQuestions(questionCountOrAnswers = 1, defaultAnswer = 'yes', tutorialAction = 'skip') {
        const answers = Array.isArray(questionCountOrAnswers)
            ? questionCountOrAnswers
            : Array.from({ length: Number(questionCountOrAnswers) }, () => defaultAnswer);

        if (answers.length === 0) {
            return cy.wrap(null);
        }

        return cy.wrap(answers).each((answer) => {
            this.ensureQuestionScreen(tutorialAction);
            this.answerChoiceQuestion(answer);
            this.clickChoiceQuestionActionButton('next');
        });
    }

    clickdevelopmentButton(type, options = {}){
        const {
            allowWaiting = false,
        } = options;

        this.getdevelopmentPanel().click();
        return cy.get('body').then(($body) => {
            const hasOpenDropdown = Cypress.$($body)
                .find('[id^="reka-select-content-"]:visible, [role="listbox"]:visible')
                .length > 0;

            if (hasOpenDropdown) {
                this.getOpenTabDropdown().contains('[role="option"], [data-radix-collection-item], [data-value], li, button, div, span', this.getTabTitle('development'))
                    .click({ force: true });

                cy.get('body').should('not.have.css', 'pointer-events', 'none');
            }
        }).then(() => {
            return this.getDevelopmentEntryState().then((entryState) => {
                if (entryState === 'waiting') {
                    if (allowWaiting) {
                        return cy.wrap('waiting');
                    }

                    throw new Error('目前此孩童已完成檢測，頁面僅顯示下次檢測日期');
                }

                if (entryState === 'unknown') {
                    throw new Error('發展檢測頁已開啟，但找不到開始檢測/繼續檢測，也沒有下次檢測日期');
                }

                this.getdevelopmentButton(type).click();
                return cy.wrap('actionable');
            });
        });
    }

    clickTestModeflow(option1 = 'start', option2 = 'start'){
        return this.getTestModeScreenState().then((screenState) => {
            if (screenState === 'overview') {
                cy.contains('h2:visible', '測驗總覽').should('be.visible');
                cy.get('body').should(($body) => {
                    const visibleText = Cypress.$($body).text().replace(/\s+/g, '');
                    expect(visibleText, '總覽頁應顯示測驗須知').to.include('測驗須知');
                });
                this.getdevelopmentButton(option1).click();
                return this.getTestModeScreenState().then((nextScreenState) => nextScreenState);
            }

            return screenState;
        }).then((screenState) => {
            const resolvedFlowAction = this.resolveFlowActionForScreen(option2, screenState);
            const {
                action = 'start',
                answer,
            } = resolvedFlowAction;

            if (screenState === 'tutorial') {
                cy.get('body').should(($body) => {
                    const visibleText = Cypress.$($body).text().replace(/\s+/g, '');
                    const isTutorialScreen = visibleText.includes('影片拍攝教學')
                        || visibleText.includes('照片拍攝教學');
                    expect(isTutorialScreen, '應顯示任一教學頁').to.eq(true);
                });
                this.clickAiFlowActionButton(action);
            } else if (screenState === 'question') {
                if (action === 'next' || action === 'start') {
                    this.answerChoiceQuestion(answer);
                }

                this.clickChoiceQuestionActionButton(action);
            } else {
                throw new Error(`目前不在可處理的檢測流程畫面，screenState=${screenState}`);
            }

            if (action !== 'cancel') {
                cy.get('body').should(($body) => {
                    const visibleText = Cypress.$($body).text().replace(/\s+/g, '');

                    if (screenState === 'tutorial') {
                        expect(
                            visibleText.includes('影片拍攝教學') || visibleText.includes('照片拍攝教學'),
                            '點擊後不應停留在任一教學頁'
                        ).to.eq(false);
                    }

                });
            }

            if (
                screenState === 'tutorial'
                && action !== 'cancel'
                && this.hasFlowActionForScreen(option2, 'question')
            ) {
                return this.getTestModeScreenState().then((nextScreenState) => {
                    if (nextScreenState !== 'question') {
                        return null;
                    }

                    const nextQuestionAction = this.resolveFlowActionForScreen(option2, 'question');
                    const {
                        action: nextAction = 'next',
                        answer: nextAnswer,
                    } = nextQuestionAction;

                    if (nextAction === 'next' || nextAction === 'start') {
                        this.answerChoiceQuestion(nextAnswer);
                    }

                    return this.clickChoiceQuestionActionButton(nextAction);
                });
            }
        });
    }

    runPendingTestModeFlows(flowActions = [], option1 = 'start') {
        flowActions.forEach((flowAction) => {
            this.clickdevelopmentButton(option1);
            this.clickTestModeflow(option1, flowAction);
        });
    }
}

export default FirstPageListTestMode;
