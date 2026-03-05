import { test, expect } from '@playwright/test';
import { randomHobbies, randomOptionsAddress, 
        randomPerson, randomSubjects, randomImage
} from '../utility/randomTools';
import { gotoWebsite, attachPhotos, checkHobbies, inputFullProfile,
        inputSubject, readSubmitDetails, selectOptionsAddress, checkSuccessModal 
} from '../utility/playwrightHandle';

const instance = randomPerson();
const stateCity = randomOptionsAddress();
const hobbiesList = randomHobbies();
const subjectList = randomSubjects(1);
const imageName = randomImage();

test.describe('TC1: Submitted form', () => {
  test('TC1.1: should submit normally with enter every input', async ({ page }) => {
    await gotoWebsite(page);
    await inputFullProfile(page, instance);
  
    await checkHobbies(page, hobbiesList);
    await inputSubject(page, subjectList);
    await selectOptionsAddress(page, stateCity);
    await attachPhotos(page, imageName);
  
    await page.getByRole('button', { name: 'Submit' }).click();
    await checkSuccessModal(page, expect);
    await readSubmitDetails(page, expect, instance, stateCity, hobbiesList, subjectList, imageName);
  });
  
  test('TC1.2: should submit normally when only entered mandatory fields', async ({ page }) => {
    instance.address = '';
    await gotoWebsite(page);
    await inputFullProfile(page, instance);
  
    await page.getByRole('button', { name: 'Submit' }).click();
    await checkSuccessModal(page, expect);
    await readSubmitDetails(page, expect, instance);
  });
});

/*
test('should collect all available subjects without duplicates', async ({ page }) => {
  await gotoWebsite(page);
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