import { test, expect } from '@playwright/test';
import { gotoWebsite, getSubjectSelected, inputSubject, removeSubject } from '../utility/playwrightHandle';
import { randomSubjects } from '../utility/randomTools';

const subjectsRandom = [...new Set(randomSubjects(3))];

test.describe('TC4: Subjects validation', () => {
    test(`TC4.1: subjects can be show only one when selected one.`, async ({ page }) => {
        await gotoWebsite(page);
        await inputSubject(page, subjectsRandom[0]);

        // Get all subjects that entered on website
        let subjectsWeb = await getSubjectSelected(page);
        await expect(subjectsWeb[0]).toEqual(subjectsRandom[0]);
    });

    test(`TC4.2: subjects can be show multiple when selected more than one`, async ({ page }) => {
        await gotoWebsite(page);
        await inputSubject(page, subjectsRandom);

        // Get all subjects that entered on website
        let subjectsWeb = await getSubjectSelected(page);
        await expect(subjectsWeb).toEqual(subjectsRandom);
    });

    test(`TC4.3: subjects can show removeable button and random a subject to delete`, async ({ page }) => {
        await gotoWebsite(page);
        await inputSubject(page, subjectsRandom);

        // Get all subjects that entered on website
        let subjectsWeb = await getSubjectSelected(page);

        // Random position for remove
        const noIdx = Math.floor(Math.random() * subjectsWeb.length);
        const subjectForRemove = subjectsWeb[noIdx];
        subjectsWeb.splice(noIdx, 1);

        // Click remove subjects
        await removeSubject(page, subjectForRemove);

        // Recheck in website
        let subjectsWebNew = await getSubjectSelected(page);

        await expect(subjectsWebNew.length).toEqual(subjectsWeb.length);
        await expect(subjectsWebNew).toEqual(subjectsWeb);
        await expect(subjectsWebNew).not.toContain(subjectForRemove);
    });

    test(`TC4.4: subjects can't add when inputted invalid subjects`, async ({ page }) => {
        await gotoWebsite(page);

        // Input invalid subjects
        await page.locator('.subjects-auto-complete__input-container').click();
        await page.locator('#subjectsInput').fill('none_std');
        await page.locator('body').click();
        
        const selected = await getSubjectSelected(page);
        expect(selected).toHaveLength(0);
    });
});