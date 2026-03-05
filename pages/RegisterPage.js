import { expect } from '@playwright/test';
import dayjs from 'dayjs';
import path from 'path';
import location from '../datasets/location_state.json';

/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Expect} Expect
 * @typedef {import('../models/Person').default} Person
 */
export class RegisterPage {
    /** @type {Page} */
    #page;
    /** @type {Expect} */
    #expect;
    /**
     * @param {Page} page
     * @param {Expect} expect
     */
    constructor(page) {
        this.#page = page;
        this.#expect = expect;
    }

    async openWebsite() {
        await this.#page.goto('https://demoqa.com/automation-practice-form/');
    }
    
    async submit() {
        await this.#page.getByRole('button', { name: 'Submit' }).click();
    }

    /**
     * @param {Person} instance 
     */
    async inputFullProfile(instance) {
        if (instance.fname && instance.fname != '')
            await this.#page.getByRole('textbox', { name: 'First Name' }).fill(instance.fname);
        if (instance.lname && instance.lname != '')
            await this.#page.getByRole('textbox', { name: 'Last Name' }).fill(instance.lname);
        if (instance.email && instance.email != '')
            await this.#page.getByRole('textbox', { name: 'name@example.com' }).fill(instance.email);
        await this.changeSex(instance.sex);
        await this.manualClickInputBirthdate(instance.birthdate);
        if (instance.mobile_no && instance.mobile_no != '')
            await this.#page.getByRole('textbox', { name: 'Mobile Number' }).fill(instance.mobile_no);
        if (instance.address && instance.address != '')
            await this.#page.getByRole('textbox', { name: 'Current Address' }).fill(instance.address);
    }

    /**
     * @param {Person} instance 
     */
    async inputMandatoryFields(hobbiesList, subjectList, stateCity, imageName) {
        if (hobbiesList)
            await this.selectHobbies(hobbiesList);
        if (subjectList)
            await this.inputSubject(subjectList);
        if (stateCity)
            await this.selectOptionsAddress(stateCity);
        if (imageName)
            await this.attachPhotos(imageName);
    }    

    /**
     * @param {string} sex
     */
    async changeSex(sex) {
        if (sex == '')
            return;
        await this.#page.getByRole('radio', { name: sex, exact: true }).check();
    }

    /**
     * @param {Object} options
    */
    async selectHobbies(options) {
        if (options.sports)
            await this.#page.getByRole('checkbox', { name: 'Sports' }).check();
        if (options.reading)
            await this.#page.getByRole('checkbox', { name: 'Reading' }).check();
        if (options.music)
            await this.#page.getByRole('checkbox', { name: 'Music' }).check();
    }

    /**
     * @param {Object} data
    */
    async selectOptionsAddress(data) {
        if (data.states) {
            await this.#page.locator('#state > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();
            await this.#page.getByRole('option', { name: data.states }).click();
        }
        if (data.city) {
            await this.#page.locator('#city > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();
            await this.#page.getByRole('option', { name: data.city }).click();
        }
    }

    /**
     * @return {number}
    */
    async randomClickStates() {
        const stateNo = Math.floor(Math.random() * Object.keys(location.state).length);
        await this.selectOptionsAddress({states: location.state[stateNo].name, city: null});
        await this.#page.locator('#city > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();
        return stateNo;
    }

    /**
     * @param {string} date
    */
    async manualClickInputBirthdate(date) {
        if (date == null || date == '')
            return;
        
        const convertDate = dayjs(date);
        await this.#page.locator('#dateOfBirthInput').click();
        await this.#page.locator('xpath=//*[@id="dateOfBirth"]/div[2]/div[2]/div/div/div/div/div[1]/div/div[2]/select').selectOption(String(convertDate.year()));
        await this.#page.locator('xpath=/html/body/div/div/div/div/div[2]/div[1]/form/div[5]/div[2]/div[2]/div[2]/div/div/div/div/div[1]/div/div[1]/select').selectOption(String(convertDate.month()));
        const dayOfMonth = convertDate.date();
        const daySuffix = dayOfMonth % 10 === 1 && dayOfMonth !== 11 ? 'st' : dayOfMonth % 10 === 2 && dayOfMonth !== 12 ? 'nd' : dayOfMonth % 10 === 3 && dayOfMonth !== 13 ? 'rd' : 'th';
        await this.#page.getByRole('gridcell', { name: `Choose ${convertDate.format('dddd')}, ${convertDate.format('MMMM')} ${dayOfMonth}${daySuffix}` }).click();
    }

    /**
     * @param {string | string[]} name
    */
    async inputSubject(name) {
        if (Array.isArray(name)) {
            for (const n of name) {
                await this.#page.locator('.subjects-auto-complete__input-container').click();
                await this.#page.locator('#subjectsInput').fill(n);
                await this.#page.locator('#subjectsInput').press('Enter');
            }
        } else {
            await this.#page.locator('.subjects-auto-complete__input-container').click();
            await this.#page.locator('#subjectsInput').fill(name);
            await this.#page.locator('#subjectsInput').press('Enter');
        }
    }

    /**
     * @param {string | string[]} name
    */
    async removeSubject(name) {
        if (Array.isArray(name)) {
            for (const n of name) {
                await this.#page.getByRole('button', { name: `Remove ${n}` }).click();
            }
        } else {
            await this.#page.getByRole('button', { name: `Remove ${name}` }).click();
        }
    }

    /**
     * @returns {string[]}
    */
    async getSubjectSelected() {
        const obj = await this.#page.locator('.subjects-auto-complete__multi-value.css-1p3m7a8-multiValue').all();
        let subjectsWeb = [];
        for (const o of obj) {
            subjectsWeb.push(await o.innerText());
        }
        subjectsWeb.sort();

        return subjectsWeb;
    }

    /**
     * @param {string} filename
    */
    async attachPhotos(filename) {
        await this.#page.getByRole('button', { name: 'Choose File' }).setInputFiles(path.join(__dirname, `../datasets/${filename}`));
    }

    /**
     * @param {boolean} status
    */
    async checkSuccessModal(status) {
        if (status) {
            await this.#expect(this.#page.locator('#example-modal-sizes-title-lg')).toBeVisible();
            await this.#expect(this.#page.locator('#example-modal-sizes-title-lg')).toContainText('Thanks for submitting the form');
        } else {
            await this.#expect(this.#page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
        }
    }

    /**
     * @param {Person} instance
     * @param {Object | undefined} states
     * @param {Object | undefined} activity
     * @param {string[] | undefined} subject
     * @param {string | string[] | undefined} imageUpload
    */
    async readSubmitDetails(instance, states, activity, subject, imageUpload) {
        const dialogXPath = 'xpath=/html/body/div[4]/div/div/div[2]/div/table/tbody//tr/td[2]';
        const actionElement = await this.#page.locator(dialogXPath).all();
    
        await this.#expect(this.#page.getByRole("cell", { name: instance.fname + " " + instance.lname })).toBeVisible();
        await this.#expect(this.#page.getByRole("cell", { name: instance.email })).toBeVisible();
        await this.#expect(this.#page.getByRole("cell", { name: instance.sex })).toBeVisible();
        await this.#expect(this.#page.getByRole("cell", { name: instance.mobile_no })).toBeVisible();
        await this.#expect(this.#page.getByRole("cell", { name: dayjs(instance.birthdate).format("D MMMM,YYYY") })).toBeVisible();
        
        if (instance.address)
            await this.#expect(this.#page.getByRole("cell", { name: instance.address })).toBeVisible();
        
        // Subject check
        if (subject) {
            const subjectWeb = String(await actionElement[5].innerText()).split(',').map((e) => e.trim()).sort();
            await this.#expect(subjectWeb).toEqual(subject.sort());
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
            await this.#expect(hobbiesWeb).toEqual(hobbiesDeclared);
        }
        
        // Upload file check
        if (imageUpload && imageUpload.split('/').length == 1)
            await this.#expect(this.#page.getByRole("cell", { name: imageUpload })).toBeVisible();
        else if (imageUpload) {
            await this.#expect(this.#page.getByRole("cell", { name: imageUpload.split('/')[1] })).toBeVisible();
        }
        
        if (states)
            await this.#expect(this.#page.getByRole("cell", { name: states.states + " " + states.city })).toBeVisible();
    }
}