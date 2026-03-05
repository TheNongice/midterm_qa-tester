import { test } from '@playwright/test';
import { randomHobbies, randomOptionsAddress, 
        randomPerson, randomSubjects, randomImage
} from '../utility/randomTools';
import { RegisterPage } from '../pages/RegisterPage';

const instance = randomPerson();
const stateCity = randomOptionsAddress();
const hobbiesList = randomHobbies();
const subjectList = randomSubjects(1);
const imageName = randomImage();

test.describe('TC1: Submitted form', () => {
  /** @type {import('../pages/RegisterPage').RegisterPage} */
  let Controller;
  test.beforeEach(async ({ page }) => {
    Controller = new RegisterPage(page);
    await Controller.openWebsite();
  });

  test('TC1.1: should submit normally with enter every input', async ({ page }) => {
    await Controller.inputFullProfile(instance);
    await Controller.inputMandatoryFields(hobbiesList, subjectList, stateCity, imageName);
    await Controller.submit();
    await Controller.checkSuccessModal(true);
    await Controller.readSubmitDetails(instance, stateCity, hobbiesList, subjectList, imageName);
  });
  
  test('TC1.2: should submit normally when only entered mandatory fields', async ({ page }) => {
    instance.address = '';
    await Controller.inputFullProfile(instance);
    await Controller.submit();
    await Controller.checkSuccessModal(true);
    await Controller.readSubmitDetails(instance);
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