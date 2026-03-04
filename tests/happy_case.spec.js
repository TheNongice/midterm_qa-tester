import { test, expect } from '@playwright/test';
import { randomHobbies, randomOptionsAddress, 
        randomPerson, randomSubjects
} from '../utility/randomTools';
import { attachPhotos, checkHobbies, inputFullProfile,
        inputSubject, readSubmitDetails, selectOptionsAddress 
} from '../utility/playwrightHandle';

const instance = randomPerson();
const stateCity = randomOptionsAddress();
const hobbiesList = randomHobbies();
const subjectList = randomSubjects(1);

test('should submit normally with enter every input', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form/');
  await inputFullProfile(page, instance);

  await checkHobbies(page, hobbiesList);
  await inputSubject(page, subjectList);
  await selectOptionsAddress(page, stateCity);
  await attachPhotos(page, 'radiohead.png');

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('#example-modal-sizes-title-lg')).toContainText('Thanks for submitting the form');
  await readSubmitDetails(page, instance, stateCity, hobbiesList, subjectList);
});

test('should submit normally when only entered mandatory fields', async ({ page }) => {
  instance.address = '';
  await page.goto('https://demoqa.com/automation-practice-form/');
  await inputFullProfile(page, instance);

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('#example-modal-sizes-title-lg')).toContainText('Thanks for submitting the form');
  await readSubmitDetails(page, instance);
});

/*
test('should collect all available subjects without duplicates', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form/');
  await page.locator('.subjects-auto-complete__input-container').click();
  let subject = new Set();
  let char = 'A';
  for (let i = 0; i < 26; i++) {
    await page.locator('#subjectsInput').fill(char);
    const result = await page.locator('#subjectsContainer > .css-1nmdiq5-menu').first().locator('.subjects-auto-complete__option').all();
    for (const r of result) {
      const t = await r.innerText();
      subject.add(t);
    }
    char = String.fromCharCode(char.charCodeAt() + 1);
  }
  console.log(Array.from(subject));
});
*/