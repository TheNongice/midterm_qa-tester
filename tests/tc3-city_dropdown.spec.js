import { test, expect } from '@playwright/test';
import { gotoWebsite, selectOptionsAddress } from '../utility/playwrightHandle';
import location from '../datasets/location_state.json';

test.describe('TC3: City/State dropdown check', () => {
    test(`TC3.1: city shouldn't disabled until stated is selected`, async ({ page }) => {
        await gotoWebsite(page);
        // Check city dropdown shouldn't click.
        await expect(await page.locator('#city > .css-16xfy0z-control').getAttribute('aria-disabled')).toEqual("true");
    });
    
    test(`TC3.2: city should enabled after stated is selected`, async ({ page }) => {
        await gotoWebsite(page);
        await selectOptionsAddress(page, {states: 'NCR', city: null});
        
        // Check city dropdown should click.
        await page.locator('#city > .css-13cymwt-control').click();
        await expect(await page.locator('#city > .css-t3ipsp-control')).toBeVisible();
    });

    test(`TC3.3: city should show by assosicated with state`, async ({ page }) => {
        await gotoWebsite(page);

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
        await expect(cityInJson).toEqual(cityInWeb);
    });
});