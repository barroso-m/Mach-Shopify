
/*

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/Commerce/LoginPage-Commerce';
import { DashboardPage } from '../../pages/Commerce/DashboardPage-Commerce';
import { faker } from '@faker-js/faker';
import { secureFill } from '../../../utils/secureFill';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.goto();
});


test('[OT-T1]: Realizar login NO exitoso a Commerce',{tag: ['@login','@regression','@smoke','@E2E']}, async ({ }) => {
  await loginPage.enterUsername(process.env.COMMERCE_VALID_USERNAME || '');
  await loginPage.enterPassword(faker.internet.password());
  await loginPage.clickLogin();
  await loginPage.isErrorAlertVisible();
});

test('[OT-T2]: Realizar login exitoso a Commerce', async ({ page }) => {
  await secureFill(loginPage.usernameInput, process.env.COMMERCE_VALID_USERNAME || '');
  await secureFill(loginPage.passwordInput, process.env.COMMERCE_VALID_PASSWORD || '');
  await loginPage.clickLogin();
});

*/