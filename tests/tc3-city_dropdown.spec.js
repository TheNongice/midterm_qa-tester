import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import location from '../datasets/location_state.json';

test.describe('TC3: City/State dropdown check', () => {
    /** @type {import('../pages/RegisterPage').RegisterPage} */
    let Controller;
    test.beforeEach(async ({ page }) => {
        Controller = new RegisterPage(page);
        await Controller.openWebsite();
    });

    test(`TC3.1: city shouldn't disabled until stated is selected`, async ({ page }) => {
        // Check city dropdown shouldn't click.
        const btnState = await page.locator('#city > .css-16xfy0z-control').getAttribute('aria-disabled');
        await expect(btnState).toEqual("true");
    });
    
    test(`TC3.2: city should enabled after stated is selected`, async ({ page }) => {
        await Controller.selectOptionsAddress({states: 'NCR', city: null});
        // Check city dropdown should click.
        await page.locator('#city > .css-13cymwt-control').click();
        const btn = await page.locator('#city > .css-t3ipsp-control');

        await expect(btn).toBeVisible();
    });

    test(`TC3.3: city should show by assosicated with state`, async ({ page }) => {
        const stateNo = await Controller.randomClickStates();
        // Check list all city in selected states
        const result = await page.locator('#city > .css-1nmdiq5-menu').first().getByRole('option').all();
        let cityInWeb = [];
        for (const raw of result) {
            cityInWeb.push(await raw.innerText());
            cityInWeb.sort();
        }
        let cityInJson = location.state[stateNo].city.sort();
        
        await expect(cityInJson).toEqual(cityInWeb);
    });
});