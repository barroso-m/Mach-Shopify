import { test, expect } from '@playwright/test';
import { ShopifyAppsPage } from '../../pages/Commerce/ShopifyAppsPage-Commerce';
import { DevDashboardPage } from '../../pages/Commerce/DevDashboardPage-Commerce';
import { OnboardingPage } from '../../pages/Commerce/OnboardingPage-Commerce';
import { ShopifyCheckoutPage } from '../../pages/Commerce/ShopifyCheckoutPage-Commerce';
import { ShopifyPaymentsSettingsPage } from '../../pages/Commerce/ShopifyPaymentsSettingsPage-Commerce';
import { ShopifyLoginPage } from '../../pages/Commerce/ShopifyLoginPage-Commerce';

/**
 * MA-10 · Desinstalar y reinstalar la app
 *
 * 3 caso(s) del modulo Onboarding y desinstalación.
 *
 * Generado por Nexus QA a partir de los casos aprobados. Los locators de
 * los page objects estan como placeholder y hay que completarlos.
 */
test.describe('MA-10 · Desinstalar y reinstalar la app', () => {
  let shopifyAppsPage: ShopifyAppsPage;
  let devDashboardPage: DevDashboardPage;
  let onboardingPage: OnboardingPage;
  let shopifyCheckoutPage: ShopifyCheckoutPage;
  let shopifyPaymentsSettingsPage: ShopifyPaymentsSettingsPage;
  let shopifyLoginPage: ShopifyLoginPage;

  test.beforeEach(async ({ page }) => {
    shopifyAppsPage = new ShopifyAppsPage(page);
    devDashboardPage = new DevDashboardPage(page);
    onboardingPage = new OnboardingPage(page);
    shopifyCheckoutPage = new ShopifyCheckoutPage(page);
    shopifyPaymentsSettingsPage = new ShopifyPaymentsSettingsPage(page);
    shopifyLoginPage = new ShopifyLoginPage(page);
  });

  /**
   * Objetivo: Verificar que al desinstalar y volver a instalar la app Mach la tienda queda desconectada hasta repetir el onboarding, y que al completarlo con llaves válidas el medio de pago vuelve a operar.
   * Precondicion: La tienda de staging tiene la app Mach instalada y conectada (onboarding completo, medio de pago Mach activo con Modo de prueba encendido).
   */
  test('[TC-001]: [Onboarding y desinstalación] - [Camino Feliz] - Desinstalar y reinstalar la app completando el onboarding correctamente', { tag: ['@onboardingydesinstalacion', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'd27995a0-3592-447a-9bc8-931736da1b95' } }, async () => {
    await test.step('En el admin de Shopify ir a "Apps", seleccionar la app de Mach y tocar "Desinstalar", confirmando la acción.', async () => {
      await shopifyAppsPage.goto();
      await shopifyAppsPage.clickMachApp();
      await shopifyAppsPage.clickDesinstalar();
      await shopifyAppsPage.clickConfirmarDesinstalar();
    });
    await test.step('Desde el Dev Dashboard, volver a instalar la app Mach stage en la tienda y aceptar los permisos con "Install".', async () => {
      await devDashboardPage.goto();
      await devDashboardPage.clickAppToInstall();
      await devDashboardPage.clickInstall();
      expect(await onboardingPage.isFormTitleVisible(), 'Desde el Dev Dashboard, volver a instalar la app Mach stage en la tienda y aceptar los permisos con "Install".').toBe(true);
    });
    await test.step('Sin completar el onboarding, abrir el checkout de la tienda de compras y elegir Mach como medio de pago.', async () => {
      await shopifyCheckoutPage.goto();
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
    });
    await test.step('Volver a la pantalla de onboarding y cargar los campos "API Key" y "Sandbox API Key", luego tocar "Conectar tienda".', async () => {
      await onboardingPage.goto();
      await onboardingPage.fillApiKey(process.env.COMMERCE_VALID_PROD_API_KEY || '');
      await onboardingPage.fillSandboxApiKey(process.env.COMMERCE_VALID_SANDBOX_API_KEY || '');
      await onboardingPage.clickConectarTienda();
      expect(await onboardingPage.isSuccessMessageVisible(), 'Volver a la pantalla de onboarding y cargar los campos "API Key" y "Sandbox API Key", luego tocar "Conectar tienda".').toBe(true);
    });
    await test.step('Tocar "Ir a mi tienda", activar el medio de pago Mach, encender "Modo de prueba" (Test mode) y tocar "Activar".', async () => {
      await onboardingPage.clickIrATienda();
      await shopifyPaymentsSettingsPage.goto();
      await shopifyPaymentsSettingsPage.clickMachPaymentMethod();
      await shopifyPaymentsSettingsPage.toggleModoDePrueba();
      await shopifyPaymentsSettingsPage.clickActivar();
      expect(await shopifyPaymentsSettingsPage.isMachActivoVisible(), 'Tocar "Ir a mi tienda", activar el medio de pago Mach, encender "Modo de prueba" (Test mode) y tocar "Activar".').toBe(true);
    });
    await test.step('Abrir nuevamente el checkout de la tienda de compras.', async () => {
      await shopifyCheckoutPage.goto();
      expect(await shopifyCheckoutPage.isMachPaymentOptionVisible(), 'Abrir nuevamente el checkout de la tienda de compras.').toBe(true);
    });
  });

  /**
   * Objetivo: Verificar que, mientras la app sigue desinstalada y sin reinstalar, ningún intento de pago con Mach redirige al checkout hospedado de Mach.
   * Precondicion: La app de Mach fue desinstalada de la tienda y todavía no se reinstaló.
   */
  test('[TC-002]: [Onboarding y desinstalación] - [Camino de Error] - Intentar pagar con Mach mientras la tienda sigue desconectada tras la desinstalación', { tag: ['@onboardingydesinstalacion', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '2a41e3b4-8a2e-4a9b-b486-243dd89ed33e' } }, async () => {
    await test.step('Abrir el checkout de la tienda de compras con un producto en el carrito.', async () => {
      await shopifyCheckoutPage.goto();
    });
    await test.step('Intentar completar la compra con cualquier otro medio de pago disponible.', async () => {
      await shopifyCheckoutPage.clickAlternativePaymentOption();
      await shopifyCheckoutPage.clickCompletarCompra();
      expect(await shopifyCheckoutPage.isThankYouMessageVisible(), 'Intentar completar la compra con cualquier otro medio de pago disponible.').toBe(true);
    });
  });

  /**
   * Objetivo: Verificar que un usuario de la tienda sin permisos para gestionar aplicaciones no puede desinstalar la app Mach.
   * Precondicion: La tienda tiene la app Mach instalada y conectada, y existe un usuario de staff con acceso al admin de Shopify pero sin permiso para administrar aplicaciones.
   */
  test('[TC-003]: [Onboarding y desinstalación] - [Camino de Error] - Usuario sin permisos de administrador intenta desinstalar la app Mach', { tag: ['@onboardingydesinstalacion', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '58e6271f-4ec9-448e-a640-f1896b983eb6' } }, async () => {
    await test.step('Iniciar sesión en el admin de Shopify con las credenciales de un usuario de staff sin permiso de gestión de aplicaciones.', async () => {
      await shopifyLoginPage.goto();
      await shopifyLoginPage.fillUsername(process.env.COMMERCE_STAFF_LIMITED_USERNAME || '');
      await shopifyLoginPage.fillPassword(process.env.COMMERCE_STAFF_LIMITED_PASSWORD || '');
      await shopifyLoginPage.clickLogin();
    });
    await test.step('Intentar navegar a "Apps" y acceder a la app de Mach para desinstalarla.', async () => {
      await shopifyAppsPage.goto();
      await shopifyAppsPage.clickMachApp();
    });
    await test.step('Abrir el checkout de la tienda de compras y verificar el medio de pago Mach.', async () => {
      await shopifyCheckoutPage.goto();
      expect(await shopifyCheckoutPage.isMachPaymentOptionVisible(), 'Abrir el checkout de la tienda de compras y verificar el medio de pago Mach.').toBe(true);
    });
  });
});
