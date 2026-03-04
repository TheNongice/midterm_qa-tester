import { test, expect } from '@playwright/test';
import { gotoWebsite, checkHobbies, inputFullProfile, selectOptionsAddress } from '../utility/playwrightHandle';
import location from '../datasets/location_state.json';
import { randomPerson } from '../utility/randomTools';

const instance = randomPerson();

test.describe('Dynamic dropdown check', () => {
    test(`city shouldn't click before stated is selected`, async ({ page }) => {
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await checkHobbies(page, {sports: true, music: true});

        // Check city dropdown shouldn't click.
        await expect(await page.locator('#city > .css-16xfy0z-control').getAttribute('aria-disabled')).toEqual("true");
    });
    
    test(`city should click after stated is selected`, async ({ page }) => {
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await checkHobbies(page, {sports: true, music: true});
        
        await selectOptionsAddress(page, {states: 'NCR', city: null});
        
        // Check city dropdown should click.
        await page.locator('#city > .css-13cymwt-control').click();
        await expect(await page.locator('#city > .css-t3ipsp-control')).toBeVisible();
    });

    test(`city should show by assosicated with state`, async ({ page }) => {
        await gotoWebsite(page);
        await inputFullProfile(page, instance);
        await checkHobbies(page, {sports: true, music: true});

        const stateNo = Math.floor(Math.random() * Object.keys(location.state).length);
        await selectOptionsAddress(page, {states: location.state[stateNo].name, city: null});
        await page.locator('#city > .css-13cymwt-control > .css-hlgwow > .css-19bb58m').click();

        // Check list all city in selected states
        const result = await page.locator('#city > .css-1nmdiq5-menu').first().getByRole('option').all();
        let cityInWeb = [];
        for (const raw of result) {
            cityInWeb.push(await raw.innerText());
            cityInWeb.sort();
        }
        let cityInJson = location.state[stateNo].city.sort();
        await expect(JSON.stringify(cityInJson)).toEqual(JSON.stringify(cityInWeb));
    });
});