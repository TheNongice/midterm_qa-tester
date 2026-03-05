import { test, expect } from '@playwright/test';
import { gotoWebsite, inputFullProfile } from '../utility/playwrightHandle';
import { randomPerson } from '../utility/randomTools';
import dayjs from 'dayjs';

const instance = randomPerson();

test.describe('TC5: Fields Validation', () => {
    test.describe('Mobile Number Validation', () => {
        test(`TC5.1: can submit when has mobile number enter with 10 digits`, async ({ page }) => {
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await expect(await page.getByRole('textbox', { name: 'Mobile Number' }).inputValue()).toEqual(instance.mobile_no);
    
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).toBeVisible('Thanks for submitting the form');
        });
    
        test(`TC5.2: can't submit when has mobile number enter less than 10 digits`, async ({ page }) => {
            const realTel = instance.mobile_no;
            instance.mobile_no = realTel.substring(0, 9);
    
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
    
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
    
            instance.mobile_no = realTel;
        });
    
        test(`TC5.3: can submit when has mobile number enter more than 10 digits (website show by auto truncate it)`, async ({ page }) => {
            const realTel = instance.mobile_no;
            instance.mobile_no = realTel + '1';
    
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
    
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).toBeVisible('Thanks for submitting the form');
            await expect(await page.getByRole('textbox', { name: 'Mobile Number' }).inputValue()).toEqual(realTel);
            instance.mobile_no = realTel;
        });
    
        test(`TC5.4: can't submit when has mobile number enter another character (alphabets case)`, async ({ page }) => {
            const realTel = instance.mobile_no;
            instance.mobile_no = realTel.substring(0, 8) + 'SA';
    
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
    
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
    
            instance.mobile_no = realTel;
        });

        test(`TC5.5: can't submit when has mobile number enter another character (symbol case)`, async ({ page }) => {
            const realTel = instance.mobile_no;
            instance.mobile_no = realTel.substring(0, 8) + '%#';
    
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
    
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
    
            instance.mobile_no = realTel;
        });
    });

    test.describe('Email Validation', () => {
        test(`TC5.6: email is enter with valid structure`, async ({ page }) => {
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
            await expect(await page.getByRole('textbox', { name: 'name@example.com' }).inputValue()).toEqual(instance.email);
    
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).toBeVisible('Thanks for submitting the form');
        });
    
        test(`TC5.7: email is enter with invalid (forgot fill @)`, async ({ page }) => {
            const realMail = instance.email;
            instance.email = 'tempgmail.com';
            await gotoWebsite(page);
            await inputFullProfile(page, instance);
    
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
            instance.email = realMail;
        });
    
        test(`TC5.8: email is enter with invalid (domain extension more than 5 characters)`, async ({ page }) => {
            const realMail = instance.email;
            instance.email = 'temp@gmail.commmm';
            await gotoWebsite(page);
            
            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
    
            instance.email = realMail;
        });

        test(`TC5.9: email is enter with invalid (domain extension less than 2 characters)`, async ({ page }) => {
            const realMail = instance.email;
            instance.email = 'temp@gmail.c';
            await gotoWebsite(page);

            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
    
            instance.email = realMail;
        });

        test(`TC5.10: email is enter with invalid (has whitespace)`, async ({ page }) => {
            const realMail = instance.email;
            instance.email = 'temp @gmail.com';
            await gotoWebsite(page);

            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
    
            instance.email = realMail;
        });

        test(`TC5.11: email is enter with invalid (not have prefix)`, async ({ page }) => {
            const realMail = instance.email;
            instance.email = '@gmail.com';
            await gotoWebsite(page);

            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
    
            instance.email = realMail;
        });

        test(`TC5.12: email is enter with invalid (not have domain)`, async ({ page }) => {
            const realMail = instance.email;
            instance.email = 'test@.com';
            await gotoWebsite(page);

            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
    
            instance.email = realMail;
        });


        test(`TC5.13: email is enter with invalid (not have domain extenstion)`, async ({ page }) => {
            const realMail = instance.email;
            instance.email = 'test@gmail';
            await gotoWebsite(page);

            await inputFullProfile(page, instance);
            await page.getByRole('button', { name: 'Submit' }).click();
            await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
    
            instance.email = realMail;
        });
    });

    test.describe('Birthdate Validation', () => {
        test(`TC5.14: default birthdate should show only current date`, async ({ page }) => {
            await gotoWebsite(page);
            const currentDate = dayjs().format('DD MMM YYYY');
            const inputValue = await page.locator('#dateOfBirthInput').inputValue();
            expect(inputValue).toBe(currentDate);
        });

        test(`TC5.15: default birthdate should show only current date`, async ({ page }) => {
            await gotoWebsite(page);
            await inputFullProfile(page, instance);

            const inputValue = await page.locator('#dateOfBirthInput').inputValue();
            expect(dayjs(inputValue).format('D MMM YYYY')).toBe(instance.birthdate);
        });
    });
});