import dayjs from "dayjs";
import path from 'path';

export async function gotoWebsite(page) {
    await page.goto('https://demoqa.com/automation-practice-form/');
}

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

export async function readSubmitDetails(page, expect, instance, states, activity, subject, imageUpload) {
    const dialogXPath = 'xpath=/html/body/div[4]/div/div/div[2]/div/table/tbody//tr/td[2]';
    const actionElement = await page.locator(dialogXPath).all();

    await expect(page.getByRole("cell", { name: instance.fname + " " + instance.lname })).toBeVisible();
    await expect(page.getByRole("cell", { name: instance.email })).toBeVisible();
    await expect(page.getByRole("cell", { name: instance.sex })).toBeVisible();
    await expect(page.getByRole("cell", { name: instance.mobile_no })).toBeVisible();
    await expect(page.getByRole("cell", { name: dayjs(instance.birthdate).format("D MMMM,YYYY") })).toBeVisible();
    
    if (instance.address)
        await expect(page.getByRole("cell", { name: instance.address })).toBeVisible();
    
    // Subject check
    if (subject) {
        const subjectWeb = String(await actionElement[5].innerText()).split(',').map((e) => e.trim()).sort();
        await expect(subjectWeb).toEqual(subject.sort());
    }

    // Hobby check
    if (activity) {
        const hobbiesWeb = String(await actionElement[6].innerText()).split(',').map((e) => e.trim()).sort();
        if (hobbiesWeb[ hobbiesWeb.length-1 ] == '')
            hobbiesWeb.pop();
        let hobbiesDeclared = [];
        if (activity.sports)
            hobbiesDeclared.push('Sports');
        if (activity.music)
            hobbiesDeclared.push('Music');
        if (activity.reading)
            hobbiesDeclared.push('Reading');
        hobbiesDeclared.sort();
        await expect(hobbiesWeb).toEqual(hobbiesDeclared);
    }
    
    // Upload file check
    if (imageUpload && imageUpload.split('/').length == 1)
        await expect(page.getByRole("cell", { name: imageUpload })).toBeVisible();
    else if (imageUpload) {
        await expect(page.getByRole("cell", { name: imageUpload.split('/')[1] })).toBeVisible();
    }

    if (states)
        await expect(page.getByRole("cell", { name: states.states + " " + states.city })).toBeVisible();
}