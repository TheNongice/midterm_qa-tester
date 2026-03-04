import { test, expect } from '@playwright/test';
import Person from '../models/Person';
import { gotoWebsite, checkHobbies, inputFullProfile, selectOptionsAddress } from '../utility/playwrightHandle';

test.describe('Mandatory fields check', () => {
  test(`shouldn't submit (First name blanks)`, async ({ page }) => {
    const instance = new Person('', 'Doe', 'mail@gm.com', 'M', '0981238751', '12/01/2020', 'TH/A');
  
    await gotoWebsite(page);
    await inputFullProfile(page, instance);
    await checkHobbies(page, {sports: true, music: true});
    
    await selectOptionsAddress(page, {states: 'Haryana', city: 'Karnal'})
  
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
  });

  test(`shouldn't submit (Last name blanks)`, async ({ page }) => {
    const instance = new Person('Jane', '', 'mail@gm.com', 'F', '0981238751', '12/02/2019', 'TH/A');
  
    await gotoWebsite(page);
    await inputFullProfile(page, instance);
    await checkHobbies(page, {sports: true, music: true});
    
    await selectOptionsAddress(page, {states: 'Haryana', city: 'Karnal'})
  
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
  });

  test(`shouldn't submit (Gender blanks)`, async ({ page }) => {
    const instance = new Person('Jane', 'Doe', 'mg@mg.com', '', '0981238751', '12/02/2019', 'TH/A');
  
    await gotoWebsite(page);
    await inputFullProfile(page, instance);
    await checkHobbies(page, {sports: true, music: true});
    
    await selectOptionsAddress(page, {states: 'Haryana', city: 'Karnal'})
  
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
  });
  
  test(`shouldn't submit (Mobile blanks)`, async ({ page }) => {
    const instance = new Person('Stephan', 'Hawking', 'stephan@mg.com', 'O', '', '12/02/1998', 'TH/A');
  
    await gotoWebsite(page);
    await inputFullProfile(page, instance);
    await checkHobbies(page, {sports: true, music: true});
    
    await selectOptionsAddress(page, {states: 'Haryana', city: 'Karnal'})
  
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
  });

  test(`shouldn't submit (all mandatory are blanks)`, async ({ page }) => {
    const instance = new Person('', '', 'hello@mg.com', '', '', '12/02/2019', 'TH/A');
  
    await gotoWebsite(page);
    await inputFullProfile(page, instance);
    await checkHobbies(page, {sports: true, music: true});
    
    await selectOptionsAddress(page, {states: 'Haryana', city: 'Karnal'})
  
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible('Thanks for submitting the form');
  });  
});