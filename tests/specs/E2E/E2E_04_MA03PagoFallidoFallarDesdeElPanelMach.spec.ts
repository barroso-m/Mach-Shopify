import { test, expect } from '@playwright/test';
import { ShopifyCheckoutPage } from '../../pages/Commerce/ShopifyCheckoutPage-Commerce';
import { MachHostedCheckoutPage } from '../../pages/Commerce/MachHostedCheckoutPage-Commerce';
import { PanelMachTransaccionesPage } from '../../pages/Commerce/PanelMachTransaccionesPage-Commerce';

/**
 * MA-03 · Pago fallido (fallar desde el Panel Mach)
 *
 * 3 caso(s) del modulo Pagos.
 *
 * Generado por Nexus QA a partir de los casos aprobados. Los locators de
 * los page objects estan como placeholder y hay que completarlos.
 */
test.describe('MA-03 · Pago fallido (fallar desde el Panel Mach)', () => {
  let shopifyCheckoutPage: ShopifyCheckoutPage;
  let machHostedCheckoutPage: MachHostedCheckoutPage;
  let panelMachTransaccionesPage: PanelMachTransaccionesPage;

  test.beforeEach(async ({ page }) => {
    shopifyCheckoutPage = new ShopifyCheckoutPage(page);
    machHostedCheckoutPage = new MachHostedCheckoutPage(page);
    panelMachTransaccionesPage = new PanelMachTransaccionesPage(page);
  });

  /**
   * Objetivo: Verificar que al fallar manualmente un pago pendiente desde el Panel Mach, el comprador vuelve al checkout de Shopify con el pago rechazado y ninguna orden queda pagada.
   * Precondicion: Webhooks de Mach existentes en modo Pruebas y Productivo con las dos modalidades suscriptas; tienda conectada (onboarding OK); medio de pago Mach activo con Modo de prueba encendido en Shopify; Panel Mach staging abierto en otra pestaña con el switch en Pruebas; no hay otras transacciones pendientes en el Panel Mach.
   */
  test('[TC-001]: [Pagos] - [Camino de Error] - Validar pago fallado desde el Panel Mach', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '871f358b-a061-4f86-878e-117559e4575e' } }, async () => {
    await test.step('En el checkout de Shopify, elegir el medio de pago de Mach y tocar el boton de pago', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await machHostedCheckoutPage.isPaymentPageVisible(), 'En el checkout de Shopify, elegir el medio de pago de Mach y tocar el boton de pago').toBe(true);
    });
    await test.step('En el Panel Mach, ir a Historial de transacciones y localizar la compra', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickActualizar();
      expect(await panelMachTransaccionesPage.isTransaccionVisible(), 'En el Panel Mach, ir a Historial de transacciones y localizar la compra').toBe(true);
    });
    await test.step('Tocar el boton Fallar pagos pendientes', async () => {
      await panelMachTransaccionesPage.clickFallarPagosPendientes();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'Tocar el boton Fallar pagos pendientes').toContain('Fallido');
    });
    await test.step('Volver a la pestana del checkout de Mach y seguir a la tienda con el boton de retorno', async () => {
      await machHostedCheckoutPage.clickVolverATienda();
      expect(await shopifyCheckoutPage.isMachPaymentOptionVisible(), 'Volver a la pestana del checkout de Mach y seguir a la tienda con el boton de retorno').toBe(true);
    });
  });

  /**
   * Objetivo: Verificar que luego de un pago rechazado con Mach, el comprador puede completar la compra eligiendo otro metodo de pago disponible en el checkout.
   * Precondicion: Webhooks de Mach existentes en modo Pruebas y Productivo; tienda conectada; medio de pago Mach activo con Modo de prueba encendido; al menos otro metodo de pago habilitado en el checkout de la tienda; no hay otras transacciones pendientes en el Panel Mach.
   */
  test('[TC-002]: [Pagos] - [Camino Alterno] - Validar que el comprador puede reintentar el pago con otro metodo tras un pago fallido con Mach', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'dc22d022-a72f-4268-9a4c-4e0eda8661d4' } }, async () => {
    await test.step('Iniciar un pago eligiendo Mach en el checkout de Shopify y tocar el boton de pago', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await machHostedCheckoutPage.isPaymentPageVisible(), 'Iniciar un pago eligiendo Mach en el checkout de Shopify y tocar el boton de pago').toBe(true);
    });
    await test.step('En el Panel Mach, localizar la compra pendiente y tocar Fallar pagos pendientes', async () => {
      await panelMachTransaccionesPage.clickFallarPagosPendientes();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'En el Panel Mach, localizar la compra pendiente y tocar Fallar pagos pendientes').toContain('Fallido');
    });
    await test.step('Volver a la tienda desde el checkout de Mach', async () => {
      await machHostedCheckoutPage.clickVolverATienda();
      expect(await shopifyCheckoutPage.isMachPaymentOptionVisible(), 'Volver a la tienda desde el checkout de Mach').toBe(true);
    });
    await test.step('Elegir un metodo de pago distinto a Mach y completar la compra', async () => {
      await shopifyCheckoutPage.clickAlternativePaymentOption();
      await shopifyCheckoutPage.clickCompletarCompra();
      expect(await shopifyCheckoutPage.isThankYouMessageVisible(), 'Elegir un metodo de pago distinto a Mach y completar la compra').toBe(true);
    });
  });

  /**
   * Objetivo: Verificar que si hay mas de una transaccion pendiente en el Panel Mach, el boton "Fallar pagos pendientes" falla a todas por igual, mezclando los resultados de distintas compras.
   * Precondicion: Webhooks de Mach existentes en modo Pruebas y Productivo; tienda conectada; medio de pago Mach activo con Modo de prueba encendido; posibilidad de generar al menos dos pagos pendientes simultaneos en el Panel Mach.
   */
  test('[TC-003]: [Pagos] - [Camino de Error] - Validar que "Fallar pagos pendientes" afecta a todas las transacciones pendientes a la vez', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '43046aa7-a0ab-41a7-8840-5ee50da08acd' } }, async () => {
    await test.step('Iniciar un primer pago eligiendo Mach en el checkout de Shopify y dejarlo sin resolver', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await machHostedCheckoutPage.isPaymentPageVisible(), 'Iniciar un primer pago eligiendo Mach en el checkout de Shopify y dejarlo sin resolver').toBe(true);
    });
    await test.step('En otra sesion, iniciar un segundo pago eligiendo Mach y dejarlo tambien sin resolver', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await machHostedCheckoutPage.isPaymentPageVisible(), 'En otra sesion, iniciar un segundo pago eligiendo Mach y dejarlo tambien sin resolver').toBe(true);
    });
    await test.step('En el Panel Mach, tocar Fallar pagos pendientes', async () => {
      await panelMachTransaccionesPage.clickFallarPagosPendientes();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'En el Panel Mach, tocar Fallar pagos pendientes').toContain('Fallido');
    });
    await test.step('Volver a la tienda desde ambas pestanas de checkout de Mach', async () => {
      await machHostedCheckoutPage.clickVolverATienda();
      expect(await shopifyCheckoutPage.isMachPaymentOptionVisible(), 'Volver a la tienda desde ambas pestanas de checkout de Mach').toBe(true);
    });
  });
});
