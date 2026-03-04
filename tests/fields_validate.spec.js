import { test, expect } from '@playwright/test';
import { gotoWebsite, inputFullProfile } from '../utility/playwrightHandle';
import { randomPerson } from '../utility/randomTools';

const instance = randomPerson();

test.describe('Fields Validation', () => {
    test(`mobile digits enter with 10 digits`, async ({ page }) => {
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await expect(await page.getByRole('textbox', { name: 'Mobile Number' }).inputValue()).toEqual(instance.mobile_no);

        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).toBeVisible('Thanks for submitting the form');
    });

    test(`mobile digits enter less than 10 digits`, async ({ page }) => {
        const realTel = instance.mobile_no;
        instance.mobile_no = realTel.substring(0, 9);

        await gotoWebsite(page);
        await inputFullProfile(page, instance);

        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');

        instance.mobile_no = realTel;
    });

    test(`mobile digits enter more than 10 digits`, async ({ page }) => {
        const realTel = instance.mobile_no;
        instance.mobile_no = realTel + '1';

        await gotoWebsite(page);
        await inputFullProfile(page, instance);

        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).toBeVisible('Thanks for submitting the form');
        await expect(await page.getByRole('textbox', { name: 'Mobile Number' }).inputValue()).toEqual(realTel);
        instance.mobile_no = realTel;
    });

    test(`mobile digits enter another character such as alphabets, symbol`, async ({ page }) => {
        const realTel = instance.mobile_no;
        instance.mobile_no = realTel.substring(0, 8) + '$A';

        await gotoWebsite(page);
        await inputFullProfile(page, instance);

        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');

        instance.mobile_no = realTel;
    });    

    test(`email is enter with valid structure`, async ({ page }) => {
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await expect(await page.getByRole('textbox', { name: 'name@example.com' }).inputValue()).toEqual(instance.email);

        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).toBeVisible('Thanks for submitting the form');
    });

    test(`email is enter with invalid (forgot fill @)`, async ({ page }) => {
        const realMail = instance.email;
        instance.email = 'tempgmail.com';
        await gotoWebsite(page);
        await inputFullProfile(page, instance);

        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
        instance.email = realMail;
    });

    test(`email is enter with invalid (domain extension)`, async ({ page }) => {
        const realMail = instance.email;
        instance.email = 'temp@gmail.commmm';
        await gotoWebsite(page);

        // Extension more than 5 character
        await inputFullProfile(page, instance);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
        
        // Extension less than 2 character
        instance.email = 'temp@gmail.c';
        await page.getByRole('textbox', { name: 'name@example.com' }).fill(instance.email);

        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');

        instance.email = realMail;
    });
});