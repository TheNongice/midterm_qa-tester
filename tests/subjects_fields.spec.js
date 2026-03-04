import { test, expect } from '@playwright/test';
import { getSubjectSelected, inputSubject, removeSubject } from '../utility/playwrightHandle';
import { randomSubjects } from '../utility/randomTools';

const subjectsRandom = randomSubjects(2);

test.describe('Subjects test', () => {
    test(`subjects can be show multiple when selected more than one`, async ({ page }) => {
        await page.goto('https://demoqa.com/automation-practice-form/');
        await inputSubject(page, subjectsRandom);

        // Get all subjects that entered on website
        let subjectsWeb = await getSubjectSelected(page);
        await expect(subjectsWeb).toEqual(subjectsRandom);
    });

    test(`subjects can show removeable button for each subject after selected`, async ({ page }) => {
        await page.goto('https://demoqa.com/automation-practice-form/');
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
    });
});