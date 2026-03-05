import { test } from '@playwright/test';
import Person from '../models/Person';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('TC2: Mandatory fields check', () => {
  /** @type {import('../pages/RegisterPage').RegisterPage} */
  let Controller;
  test.beforeEach(async ({ page }) => {
    Controller = new RegisterPage(page);
    await Controller.openWebsite();
  });

  test(`TC2.1: shouldn't submit (First name blanks)`, async ({ page }) => {
    const instance = new Person('', 'Doe', 'mail@gm.com', 'M', '0981238751', '12/01/2020', 'TH/A');
    await Controller.inputFullProfile(instance);
    await Controller.submit();
    await Controller.checkSuccessModal(false);
  });

  test(`TC2.2: shouldn't submit (Last name blanks)`, async ({ page }) => {
    const instance = new Person('Jane', '', 'mail@gm.com', 'F', '0981238751', '12/02/2019', 'TH/A');
    await Controller.inputFullProfile(instance);
    await Controller.submit();
    await Controller.checkSuccessModal(false);
  });

  test(`TC2.3: shouldn't submit (Gender blanks)`, async ({ page }) => {
    const instance = new Person('Jane', 'Doe', 'mg@mg.com', '', '0981238751', '12/02/2019', 'TH/A');
    await Controller.inputFullProfile(instance);
    await Controller.submit();
    await Controller.checkSuccessModal(false);
  });
  
  test(`TC2.4: shouldn't submit (Mobile number blanks)`, async ({ page }) => {
    const instance = new Person('Stephan', 'Hawking', 'stephan@mg.com', 'O', '', '12/02/1998', 'TH/A');
    await Controller.inputFullProfile(instance);
    await Controller.submit();
    await Controller.checkSuccessModal(false);
  });

  test(`TC2.5: shouldn't submit (all mandatory are blanks)`, async ({ page }) => {
    const instance = new Person('', '', 'hello@mg.com', '', '', '12/02/2019', 'TH/A');
    await Controller.inputFullProfile(instance);
    await Controller.submit();
    await Controller.checkSuccessModal(false);
  });  
});