/*

import { test, type Page, expect } from '@playwright/test';
import { OrdersPage } from '../../pages/Commerce/OrdersPage-Commerce';
import { LoginPage } from '../../pages/Commerce/LoginPage-Commerce';
import { secureFill } from '../../../utils/secureFill';
import { DashboardPage } from '../../pages/Commerce/DashboardPage-Commerce';

let page: Page;
let loginPage: LoginPage;
let ordersPage: OrdersPage;
let dashboardPage: DashboardPage;
let orderId1: string;

test.describe.configure({ mode: 'serial' });

test('TC-01: Realizar búsqueda avanzada de órdenes',{tag: ['@orders','@regression','@smoke','@API']}, async ({ page }) => {

  await test.step('TS-01: Obtener ordenes abiertas mediante API', async ({ }) => {
    const response = await page.request.post(process.env.ORDERS_API_URL || '', {
      data: {
        page: "1",
        perPage: "50",
        properties: ["disputes"],
        status: "open"
      },
      headers: {*/
        //"accept": "image/webp, application/json, text/plain, */*",
        /*"accept-language": "es,es-ES;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,es-AR;q=0.5",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Microsoft Edge\";v=\"144\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "x-access-token": process.env.X_ACCESS_TOKEN || '',
        "x-admin-build-version": "7c549e8",
        "x-admin-front-version": "0.6.42",
        "x-admin-platform": "web",
        "x-authentication-factor-code": "no-defined",
        "x-store-country": "AR",
        "x-store-id": process.env.USER_ID || '',
        "x-user-id": process.env.X_USER_ID || '',
        "Referer": `https://${process.env.COMMERCE_VALID_USERNAME}` || ''
      },
    });

    expect(response.status()).toEqual(200);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    expect(responseBody.results[1]).toBeDefined();
    orderId1 = responseBody.results[1].id;
  });

  await test.step('TS-02: Comprobar resultado de back encontrado en el front', async ({ }) => {

    loginPage = new LoginPage(page)
    dashboardPage = new DashboardPage(page)
    ordersPage = new OrdersPage(page)

    await loginPage.goto();
    await secureFill(loginPage.usernameInput, process.env.COMMERCE_VALID_USERNAME || '');
    await secureFill(loginPage.passwordInput, process.env.COMMERCE_VALID_PASSWORD || '');
    await loginPage.clickLogin();
    await dashboardPage.ControlOrdersClick();
    await ordersPage.getOrderDetails(orderId1);
  });
});

*/