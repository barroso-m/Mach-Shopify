import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { OnboardingPage } from '../../pages/Commerce/OnboardingPage-Commerce';
import { DevDashboardPage } from '../../pages/Commerce/DevDashboardPage-Commerce';
import { ShopifyPaymentsSettingsPage } from '../../pages/Commerce/ShopifyPaymentsSettingsPage-Commerce';

/**
 * MA-01 · Onboarding: llaves válidas, inválidas y de ambiente cruzado
 *
 * 5 caso(s) del modulo Onboarding y desinstalación.
 *
 * Generado por Nexus QA a partir de los casos aprobados. Los locators de
 * los page objects estan como placeholder y hay que completarlos.
 */
test.describe('MA-01 · Onboarding: llaves válidas, inválidas y de ambiente cruzado', () => {
  let onboardingPage: OnboardingPage;
  let devDashboardPage: DevDashboardPage;
  let shopifyPaymentsSettingsPage: ShopifyPaymentsSettingsPage;

  test.beforeEach(async ({ page }) => {
    onboardingPage = new OnboardingPage(page);
    devDashboardPage = new DevDashboardPage(page);
    shopifyPaymentsSettingsPage = new ShopifyPaymentsSettingsPage(page);
  });

  /**
   * Objetivo: Verificar que el formulario de onboarding solo conecta la tienda cuando ambas llaves son correctas y están cada una en su campo, y que rechaza los demás casos con el mensaje correspondiente.
   * Precondicion: App Mach stage instalada en la tienda de staging y parado en la pantalla de onboarding ("Ingresa tu API Key de MACH para comercios y conecta tu tienda"); si la tienda ya estaba conectada, se ejecutó antes la desinstalación y reinstalación de la app para volver a esta pantalla.
   */
  test('[TC-001]: [Onboarding y desinstalación] - [Camino Alterno] - Validar onboarding con llaves vacías, inválidas, cruzadas y válidas', { tag: ['@onboardingydesinstalacion', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'a030218f-57d3-4dc3-9e5c-20693ed26d15' } }, async () => {
    await test.step('Dejar vacío el campo "Sandbox API Key", completar el campo "API Key" con una llave válida de modo Productivo y tocar "Conectar tienda"', async () => {
      await onboardingPage.fillApiKey(process.env.COMMERCE_VALID_PROD_API_KEY || '');
      await onboardingPage.clickConectarTienda();
      expect(await onboardingPage.isFormTitleVisible(), 'Dejar vacío el campo "Sandbox API Key", completar el campo "API Key" con una llave válida de modo Productivo y tocar "Conectar tienda"').toBe(true);
    });
    await test.step('Completar ambos campos y cargar en el campo "API Key" una cadena que no corresponda a ninguna llave real, y tocar "Conectar tienda"', async () => {
      await onboardingPage.fillApiKey(faker.string.alphanumeric(10));
      await onboardingPage.fillSandboxApiKey(process.env.COMMERCE_VALID_SANDBOX_API_KEY || '');
      await onboardingPage.clickConectarTienda();
      expect(await onboardingPage.isErrorMessageVisible(), 'Completar ambos campos y cargar en el campo "API Key" una cadena que no corresponda a ninguna llave real, y tocar "Conectar tienda"').toBe(true);
    });
    await test.step('Cargar en el campo "API Key" la llave real de modo Pruebas y en el campo "Sandbox API Key" la llave real de modo Productivo (invertidas), y tocar "Conectar tienda"', async () => {
      await onboardingPage.fillApiKey(process.env.COMMERCE_VALID_SANDBOX_API_KEY || '');
      await onboardingPage.fillSandboxApiKey(process.env.COMMERCE_VALID_PROD_API_KEY || '');
      await onboardingPage.clickConectarTienda();
      expect(await onboardingPage.isErrorMessageVisible(), 'Cargar en el campo "API Key" la llave real de modo Pruebas y en el campo "Sandbox API Key" la llave real de modo Productivo (invertidas), y tocar "Conectar tienda"').toBe(true);
    });
    await test.step('Cargar en el campo "API Key" la llave real de modo Productivo y en el campo "Sandbox API Key" la llave real de modo Pruebas, cada una en su campo correspondiente, y tocar "Conectar tienda"', async () => {
      await onboardingPage.fillApiKey(process.env.COMMERCE_VALID_PROD_API_KEY || '');
      await onboardingPage.fillSandboxApiKey(process.env.COMMERCE_VALID_SANDBOX_API_KEY || '');
      await onboardingPage.clickConectarTienda();
      expect(await onboardingPage.isSuccessMessageVisible(), 'Cargar en el campo "API Key" la llave real de modo Productivo y en el campo "Sandbox API Key" la llave real de modo Pruebas, cada una en su campo correspondiente, y tocar "Conectar tienda"').toBe(true);
    });
  });

  /**
   * Objetivo: Comprobar que el formulario de onboarding no avanza si se intenta conectar sin cargar ninguna de las dos llaves.
   * Precondicion: App Mach stage instalada y parado en la pantalla de onboarding, con los campos "API Key" y "Sandbox API Key" sin completar.
   */
  test('[TC-002]: [Onboarding y desinstalación] - [Camino de Error] - Validar que dejar ambos campos vacíos impide conectar la tienda', { tag: ['@onboardingydesinstalacion', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'f425b536-e3d9-4976-a5a3-9909d19f61c7' } }, async () => {
    await test.step('Sin completar ningún campo, tocar "Conectar tienda"', async () => {
      await onboardingPage.clickConectarTienda();
      expect(await onboardingPage.isCamposObligatoriosVisible(), 'Sin completar ningún campo, tocar "Conectar tienda"').toBe(true);
    });
  });

  /**
   * Objetivo: Verificar que una llave correcta mal formateada con espacios en blanco es tratada como inválida y no conecta la tienda.
   * Precondicion: App Mach stage instalada y parado en la pantalla de onboarding, con ambas llaves válidas disponibles.
   */
  test('[TC-003]: [Onboarding y desinstalación] - [Camino de Error] - Validar error al ingresar una llave válida con espacios adicionales al inicio o al final', { tag: ['@onboardingydesinstalacion', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '00c582d8-8a3b-4358-844a-74475674e430' } }, async () => {
    await test.step('Completar el campo "API Key" con la llave válida de modo Productivo agregando un espacio en blanco al inicio y al final del valor, completar "Sandbox API Key" con la llave válida de modo Pruebas, y tocar "Conectar tienda"', async () => {
      await onboardingPage.fillApiKey(` ${process.env.COMMERCE_VALID_PROD_API_KEY || ''} `);
      await onboardingPage.fillSandboxApiKey(process.env.COMMERCE_VALID_SANDBOX_API_KEY || '');
      await onboardingPage.clickConectarTienda();
      expect(await onboardingPage.isErrorMessageVisible(), 'Completar el campo "API Key" con la llave válida de modo Productivo agregando un espacio en blanco al inicio y al final del valor, completar "Sandbox API Key" con la llave válida de modo Pruebas, y tocar "Conectar tienda"').toBe(true);
    });
  });

  /**
   * Objetivo: Comprobar que tras un intento fallido de conexión, corregir los valores y volver a tocar "Conectar tienda" permite completar el onboarding correctamente.
   * Precondicion: App Mach stage instalada y parado en la pantalla de onboarding, con ambas llaves válidas disponibles.
   */
  test('[TC-004]: [Onboarding y desinstalación] - [Camino Alterno] - Validar que se puede reintentar la conexión después de un error sin perder la posibilidad de completar el onboarding', { tag: ['@onboardingydesinstalacion', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'cef7a77f-7bb9-484d-ad75-51441338f0cd' } }, async () => {
    await test.step('Cargar una llave inventada en el campo "API Key" y una llave válida en "Sandbox API Key", y tocar "Conectar tienda"', async () => {
      await onboardingPage.fillApiKey(faker.string.alphanumeric(10));
      await onboardingPage.fillSandboxApiKey(process.env.COMMERCE_VALID_SANDBOX_API_KEY || '');
      await onboardingPage.clickConectarTienda();
      expect(await onboardingPage.isErrorMessageVisible(), 'Cargar una llave inventada en el campo "API Key" y una llave válida en "Sandbox API Key", y tocar "Conectar tienda"').toBe(true);
    });
    await test.step('Sin recargar la página, corregir el campo "API Key" con la llave válida de modo Productivo y tocar nuevamente "Conectar tienda"', async () => {
      await onboardingPage.fillApiKey(process.env.COMMERCE_VALID_PROD_API_KEY || '');
      await onboardingPage.clickConectarTienda();
      expect(await onboardingPage.isSuccessMessageVisible(), 'Sin recargar la página, corregir el campo "API Key" con la llave válida de modo Productivo y tocar nuevamente "Conectar tienda"').toBe(true);
    });
  });

  /**
   * Objetivo: Verificar que, con la tienda ya conectada a Mach, no es posible volver a cargar llaves desde una pantalla de onboarding accesible sin haber desinstalado la app primero.
   * Precondicion: Tienda ya conectada a Mach mediante un onboarding previo exitoso.
   */
  test('[TC-005]: [Onboarding y desinstalación] - [Camino Alterno] - Validar que acceder a la pantalla de onboarding con la tienda ya conectada no permite reconectar sin pasar antes por la desinstalación', { tag: ['@onboardingydesinstalacion', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '74f67a77-62fc-412b-b0bd-284b3df35b6c' } }, async () => {
    await test.step('Intentar volver a abrir la pantalla de onboarding desde la app ya conectada, por ejemplo reabriendo la app desde el Dev Dashboard', async () => {
      await devDashboardPage.goto();
      await devDashboardPage.clickAppToInstall();
      await devDashboardPage.clickInstall();
      expect(await shopifyPaymentsSettingsPage.isMachActivoVisible(), 'Intentar volver a abrir la pantalla de onboarding desde la app ya conectada, por ejemplo reabriendo la app desde el Dev Dashboard').toBe(true);
    });
  });
});
