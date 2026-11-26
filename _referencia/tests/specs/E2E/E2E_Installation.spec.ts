/*
import { test, type Page } from '@playwright/test';
import { LoginPage } from '../../pages/Commerce/LoginPage-Commerce';
import { LateralPanelPage } from '../../pages/Commerce/LateralPanelPage-Commerce';
import { InstallationPage } from '../../pages/Shipper/InstallationPage-Shipper';
import { RemitterPage } from '../../pages/Shipper/OnboardingRemitterPage-Shipper';
import { DispatchPage } from '../../pages/Shipper/OnboardingDispatchPage-Shipper';
import { AccountPage } from '../../pages/Shipper/OnboardingAccountPage-Shipper';
import { createRandomRemitter } from '../../data/data-models';

let loginPage: LoginPage;
let lateralPanelPage: LateralPanelPage;
let installationPage: InstallationPage;
let remitterPage: RemitterPage;
let dispatchPage: DispatchPage;
let accountPage: AccountPage;
let page: Page;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  loginPage = new LoginPage(page);
  lateralPanelPage = new LateralPanelPage(page);
  installationPage = new InstallationPage(page);
  remitterPage = new RemitterPage(page);
  dispatchPage = new DispatchPage(page);
  accountPage = new AccountPage(page);

  await loginPage.goto();
  await loginPage.login(process.env.TN_VALID_USERNAME || '', process.env.TN_VALID_PASSWORD || '');
});

test('[OT-T3]: Flujo de instalacion',{tag: ['@installation','@regression','@smoke','@E2E']}, async ({ }) => {
  test.slow()
  
  await test.step('TS-01: Navegacion a Aplicaciones', async ({ }) => {
    await lateralPanelPage.navigateToApplications();
  });

  await test.step('TS-02: Instalacion de Aplicacion Shipper', async ({ }) => {
    await installationPage.goto(process.env.SHIPPER_INSTALLATION_CODE || '', process.env.SHIPPER_USER_ID || '');
    await installationPage.clickLoginAccount();
    await installationPage.login(process.env.SHIPPER_ACCOUNT_NUMBER || '', process.env.SHIPPER_EMAIL || '', process.env.SHIPPER_PASSWORD || '');
  });

  await test.step('TS-03: Completar datos de Remitente', async ({ }) => {
    const remitter = createRandomRemitter();
    await remitterPage.enterRemitterDetails(remitter);
    await remitterPage.continueButtonClick();
  });

  await test.step('TS-04: Completar datos de Tus Despachos', async ({ }) => {
    await dispatchPage.enterDispatchDetails();
    await dispatchPage.continueButtonClick();
  });

  await test.step('TS-05: Completar datos de Tu Cuenta', async ({ }) => {
    await accountPage.enterAccountDetails();
    await accountPage.continueButtonClick();
  });
});

*/