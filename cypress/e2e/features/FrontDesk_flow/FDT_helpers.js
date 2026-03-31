function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
    const date = new Date(`${dateString}T00:00:00`);
    date.setDate(date.getDate() + days);
    return formatDateInput(date);
}

function buildValidTaiwanId(gender = '\u5973', seed = Date.now().toString()) {
    const letter = 'A';
    const letterValue = 10;
    const genderDigit = ['male', 'm', '\u7537'].includes(String(gender).toLowerCase()) ? '1' : '2';
    const serialSource = seed.replace(/\D/g, '').padStart(7, '0').slice(-7);
    const body = `${genderDigit}${serialSource}`;
    const prefixSum = Math.floor(letterValue / 10) + (letterValue % 10) * 9;
    const weights = [8, 7, 6, 5, 4, 3, 2, 1];

    const weightedSum = body
        .split('')
        .reduce((sum, digit, index) => sum + Number(digit) * weights[index], prefixSum);
    const checkDigit = (10 - (weightedSum % 10)) % 10;

    return `${letter}${body}${checkDigit}`;
}

function pickRandom(items, seed = Math.random()) {
    return items[Math.floor(seed * items.length)];
}

function buildRandomBirthDate(seed = Math.random()) {
    const start = new Date('2023-01-01T00:00:00');
    const end = new Date('2024-12-31T00:00:00');
    const randomTime = start.getTime() + Math.floor(seed * (end.getTime() - start.getTime()));
    return formatDateInput(new Date(randomTime));
}

function buildChildFormData() {
    const timestamp = Date.now().toString();
    const runId = timestamp.slice(-6);
    const locationPairs = [
        { city: '\u81fa\u5317\u5e02', state: '\u4e2d\u6b63\u5340' },
        { city: '\u81fa\u5317\u5e02', state: '\u6587\u5c71\u5340' },
        { city: '\u65b0\u5317\u5e02', state: '\u677f\u6a4b\u5340' },
        { city: '\u65b0\u5317\u5e02', state: '\u65b0\u838a\u5340' },
        { city: '\u6843\u5712\u5e02', state: '\u6843\u5712\u5340' },
        { city: '\u81fa\u4e2d\u5e02', state: '\u897f\u5c6f\u5340' },
    ];
    const genders = ['\u7537', '\u5973'];
    const weightOptions = ['<2500g', '\u22652500g'];
    const over37WeekOptions = ['\u662f', '\u5426'];
    const gender = pickRandom(genders);
    const birthLocation = pickRandom(locationPairs);
    const sameHomeResidence = Math.random() >= 0.5;
    const residenceLocation = sameHomeResidence
        ? birthLocation
        : pickRandom(locationPairs.filter((pair) => pair.city !== birthLocation.city || pair.state !== birthLocation.state));
    const childYeartime = buildRandomBirthDate();
    const over37Week = pickRandom(over37WeekOptions);
    const dueDate = over37Week === '\u5426'
        ? addDays(childYeartime, 30)
        : '';

    return {
        childName: `\u6e2c\u8a66\u5b69\u7ae5${runId}`,
        childBorncity: birthLocation.city,
        childBornstate: birthLocation.state,
        childselfcode: buildValidTaiwanId(gender, timestamp),
        childcity: residenceLocation.city,
        childstate: residenceLocation.state,
        childYeartime,
        childGender: gender,
        over37Week,
        dueDate,
        childweight: pickRandom(weightOptions),
        peopletype: '\u5426',
        sameHomeResidence,
    };
}

const sharedChildData = buildChildFormData();
const reusableChildData = {
    ...sharedChildData,
    childName: 'E2E測試孩童A',
};

function buildFDT003ChildData() {
    const timestamp = Date.now().toString();
    const childYeartime = '2023-02-22';

    return {
        childName: `\u6a94\u6848${timestamp.slice(-6)}`,
        childBorncity: '\u81fa\u5317\u5e02',
        childBornstate: '\u6587\u5c71\u5340',
        childselfcode: buildValidTaiwanId('\u5973', `${timestamp}31`),
        childcity: '\u81fa\u5317\u5e02',
        childstate: '\u4e2d\u6b63\u5340',
        childYeartime,
        childGender: '\u5973',
        over37Week: '\u5426',
        dueDate: addDays(childYeartime, 30),
        childweight: '<2500g',
        peopletype: '\u5426',
        sameHomeResidence: false,
    };
}

function ensureFrontDeskChild(adminPage, firstPageList, childData = reusableChildData) {
    adminPage.clickOtherPageItem('前往前台');
    firstPageList.verifyFirstPageListPageLoaded();

    return cy.get('body').then(($body) => {
        const childExists = Cypress.$($body)
            .find('div.group.cursor-pointer')
            .filter((_, el) => Cypress.$(el).text().includes(childData.childName))
            .length > 0;

        if (childExists) {
            return cy.wrap(childData, { log: false });
        }

        firstPageList.openKidsAddFileDialog();
        firstPageList.fillKidsAddFileForm(childData);
        firstPageList.clickCreateFileButton();
        return cy.wrap(childData, { log: false });
    });
}

export {
    addDays,
    buildChildFormData,
    buildFDT003ChildData,
    buildRandomBirthDate,
    buildValidTaiwanId,
    ensureFrontDeskChild,
    formatDateInput,
    pickRandom,
    reusableChildData,
    sharedChildData,
};
