import dayjs from "dayjs";
import path from 'path';

export async function inputFullProfile(page, instance) {
    await page.getByRole('textbox', { name: 'First Name' }).fill(instance.fname);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(instance.lname);
    await page.getByRole('textbox', { name: 'name@example.com' }).fill(instance.email);
    await changeSex(page, instance.sex);
    await manualClickInputBirthdate(page, instance.birthdate);
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill(instance.mobile_no);
    await page.getByRole('textbox', { name: 'Current Address' }).fill(instance.address);
}

export async function inputProfileDetails(page, instance) {
    await page.getByRole('textbox', { name: 'First Name' }).fill(instance.fname);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(instance.lname);
    await page.getByRole('textbox', { name: 'name@example.com' }).fill(instance.email);
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill(instance.mobile_no);
    await page.getByRole('textbox', { name: 'Current Address' }).click();
    await page.getByRole('textbox', { name: 'Current Address' }).fill(instance.address);
}

export async function changeSex(page, sex) {
    if (sex == '')
        return;
    await page.getByRole('radio', { name: sex, exact: true }).check();
}

export async function checkHobbies(page, options) {
    if (options.sports)
        await page.getByRole('checkbox', { name: 'Sports' }).check();
    if (options.reading)
        await page.getByRole('checkbox', { name: 'Reading' }).check();
    if (options.music)
        await page.getByRole('checkbox', { name: 'Music' }).check();
}

export async function selectOptionsAddress(page, data) {
    if (data.states) {
        await page.locator('#state > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();
        await page.getByRole('option', { name: data.states }).click();
    }
    if (data.city) {
        await page.locator('#city > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();
        await page.getByRole('option', { name: data.city }).click();
    }
}

export async function manualKeyboardInputBirthdate(page, date) {
    await page.locator('#dateOfBirthInput').click();
    await page.locator('#dateOfBirthInput').fill(date);
}

export async function manualClickInputBirthdate(page, date) {
    if (date == null || date == '')
        return;
    
    const convertDate = dayjs(date);
    await page.locator('#dateOfBirthInput').click();
    await page.locator('xpath=//*[@id="dateOfBirth"]/div[2]/div[2]/div/div/div/div/div[1]/div/div[2]/select').selectOption(String(convertDate.year()));
    await page.locator('xpath=/html/body/div/div/div/div/div[2]/div[1]/form/div[5]/div[2]/div[2]/div[2]/div/div/div/div/div[1]/div/div[1]/select').selectOption(String(convertDate.month()));
    const dayOfMonth = convertDate.date();
    const daySuffix = dayOfMonth % 10 === 1 && dayOfMonth !== 11 ? 'st' : dayOfMonth % 10 === 2 && dayOfMonth !== 12 ? 'nd' : dayOfMonth % 10 === 3 && dayOfMonth !== 13 ? 'rd' : 'th';
    await page.getByRole('gridcell', { name: `Choose ${convertDate.format('dddd')}, ${convertDate.format('MMMM')} ${dayOfMonth}${daySuffix}` }).click();
}

export async function inputSubject(page, name) {
    if (Array.isArray(name)) {
        for (const n of name) {
            await page.locator('.subjects-auto-complete__input-container').click();
            await page.locator('#subjectsInput').fill(n);
            await page.locator('#subjectsInput').press('Enter');
        }
    } else {
        await page.locator('.subjects-auto-complete__input-container').click();
        await page.locator('#subjectsInput').fill(name);
        await page.locator('#subjectsInput').press('Enter');
    }
}

export async function removeSubject(page, name) {
    if (Array.isArray(name)) {
        for (const n of name) {
            await page.getByRole('button', { name: `Remove ${n}` }).click();
        }
    } else {
        await page.getByRole('button', { name: `Remove ${name}` }).click();
    }
}

export async function getSubjectSelected(page) {
    const obj = await page.locator('.subjects-auto-complete__multi-value.css-1p3m7a8-multiValue').all();
    let subjectsWeb = [];
    for (const o of obj) {
        subjectsWeb.push(await o.innerText());
    }
    subjectsWeb.sort();

    return subjectsWeb;
}

export async function attachPhotos(page, filename) {
    await page.getByRole('button', { name: 'Choose File' }).setInputFiles(path.join(__dirname, `../datasets/${filename}`));
}

export async function readSubmitDetails(page, instance, states, activity, subject) {
    const dialogXPath = 'xpath=/html/body/div[4]/div/div/div[2]/div/table/tbody//tr/td[2]';
    const actionElement = await page.locator(dialogXPath).all();
    for (let idx=0; idx<10; idx++) {
        if (idx == 7)
            continue;
        const ele = await actionElement[idx].innerText();
        if (ele == `${instance.fname} ${instance.lname}`)
            continue;
        else if (ele == instance.email)
            continue;
        else if (ele == instance.sex)
            continue;
        else if (ele == instance.mobile_no)
            continue;
        else if (dayjs(ele).format("D MMM YYYY") == dayjs(instance.birthdate).format("D MMM YYYY"))
            continue;
        else if (subject != null && JSON.stringify(ele.split(',').map((e) => e.trim()).sort()) == JSON.stringify(subject.sort()))
            continue;
        else if (activity != null && idx == 6) {
            let box = [];
            if (activity.sports)
                box.push('Sports');
            if (activity.music)
                box.push('Music');
            if (activity.reading)
                box.push('Reading');
            box.sort();
            let htmlResult = ele.split(',').map(item => item.trim()).sort();
            if (JSON.stringify(box) == JSON.stringify(htmlResult))
                continue;
        }
        else if (ele == instance.address)
            continue;
        else if (states != null && ele == `${states.states} ${states.city}`)
            continue;
        else 
            throw new Error(`Invalid to check '${ele}' with any table fields (idx=${idx})`);
    }
}