import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { randomPerson } from '../utility/randomTools';
import dayjs from 'dayjs';

const instance = randomPerson();

test.describe('TC5: Fields Validation', () => {
    /** @type {import('../pages/RegisterPage').RegisterPage} */
    let Controller;
    test.beforeEach(async ({ page }) => {
        Controller = new RegisterPage(page);
        await Controller.openWebsite();
    });

    test.describe('Mobile Number Validation', () => {
        test(`TC5.1: can submit when has mobile number enter with 10 digits`, async ({ page }) => {
            await Controller.inputFullProfile(instance);
            const mobileNo = await page.getByRole('textbox', { name: 'Mobile Number' }).inputValue();
            await expect(mobileNo).toEqual(instance.mobile_no);
    
            await Controller.submit();
            await Controller.checkSuccessModal(true);
        });
    
        test(`TC5.2: can't submit when has mobile number enter less than 10 digits`, async ({ page }) => {
            const realTel = instance.mobile_no;
            instance.mobile_no = realTel.substring(0, 9);
            await Controller.inputFullProfile(instance);
    
            await Controller.submit();
            await Controller.checkSuccessModal(false);
    
            instance.mobile_no = realTel;
        });
    
        test(`TC5.3: can submit when has mobile number enter more than 10 digits (website show by auto truncate it)`, async ({ page }) => {
            const realTel = instance.mobile_no;
            instance.mobile_no = realTel + '1';

            await Controller.inputFullProfile(instance);
            await Controller.submit();
            await Controller.checkSuccessModal(true);

            const mobileNo = await page.getByRole('textbox', { name: 'Mobile Number' }).inputValue()
            await expect(mobileNo).toEqual(realTel);

            instance.mobile_no = realTel;
        });
    
        test(`TC5.4: can't submit when has mobile number enter another character (alphabets case)`, async ({ page }) => {
            const realTel = instance.mobile_no;
            instance.mobile_no = realTel.substring(0, 8) + 'SA';

            await Controller.inputFullProfile(instance);
            await Controller.submit();
            await Controller.checkSuccessModal(false);
    
            instance.mobile_no = realTel;
        });

        test(`TC5.5: can't submit when has mobile number enter another character (symbol case)`, async ({ page }) => {
            const realTel = instance.mobile_no;
            instance.mobile_no = realTel.substring(0, 8) + '%#';

            await Controller.inputFullProfile(instance);
            await Controller.submit();
            await Controller.checkSuccessModal(false);
    
            instance.mobile_no = realTel;
        });
    });

    test.describe('Email Validation', () => {
        test(`TC5.6: email is enter with valid structure`, async ({ page }) => {
            await Controller.inputFullProfile(instance);
            const email = await page.getByRole('textbox', { name: 'name@example.com' }).inputValue();
            await expect(email).toEqual(instance.email);
            await Controller.submit();
            await Controller.checkSuccessModal(true);
        });
    
        const invalidEmailCases = [
            { id: 'TC5.7', desc: 'forgot fill @', email: 'tempgmail.com' },
            { id: 'TC5.8', desc: 'domain extension > 5 characters', email: 'temp@gmail.commmm' },
            { id: 'TC5.9', desc: 'domain extension < 2 characters', email: 'temp@gmail.c' },
            { id: 'TC5.10', desc: 'has whitespace', email: 'temp @gmail.com' },
            { id: 'TC5.11', desc: 'not have prefix', email: '@gmail.com' },
            { id: 'TC5.12', desc: 'not have domain', email: 'test@.com' },
            { id: 'TC5.13', desc: 'not have domain extension', email: 'test@gmail' },
        ];

        for (const { id, desc, email } of invalidEmailCases) {
            test(`${id}: email is enter with invalid (${desc})`, async () => {
                const testData = { ...instance, email: email };
                await Controller.inputFullProfile(testData);
                await Controller.submit();
                await Controller.checkSuccessModal(false);
            });
        }
    });

    test.describe('Birthdate Validation', () => {
        test(`TC5.14: default birthdate should show only current date`, async ({ page }) => {
            const currentDate = dayjs().format('DD MMM YYYY');
            const inputValue = await page.locator('#dateOfBirthInput').inputValue();
            expect(inputValue).toBe(currentDate);
        });

        test(`TC5.15: default birthdate should show only current date`, async ({ page }) => {
            await Controller.manualClickInputBirthdate(instance.birthdate);
            const inputValue = await page.locator('#dateOfBirthInput').inputValue();
            expect(dayjs(inputValue).format('D MMM YYYY')).toBe(instance.birthdate);
        });
    });
});