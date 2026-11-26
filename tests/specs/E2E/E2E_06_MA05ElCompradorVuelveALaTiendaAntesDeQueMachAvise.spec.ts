import { test, expect } from '@playwright/test';
import { ShopifyCheckoutPage } from '../../pages/Commerce/ShopifyCheckoutPage-Commerce';
import { MachHostedCheckoutPage } from '../../pages/Commerce/MachHostedCheckoutPage-Commerce';
import { PanelMachTransaccionesPage } from '../../pages/Commerce/PanelMachTransaccionesPage-Commerce';
import { ShopifyOrdersPage } from '../../pages/Commerce/ShopifyOrdersPage-Commerce';

/**
 * MA-05 · El comprador vuelve a la tienda antes de que Mach avise
 *
 * 2 caso(s) del modulo Pagos.
 *
 * Generado por Nexus QA a partir de los casos aprobados. Los locators de
 * los page objects estan como placeholder y hay que completarlos.
 */
test.describe('MA-05 · El comprador vuelve a la tienda antes de que Mach avise', () => {
  let shopifyCheckoutPage: ShopifyCheckoutPage;
  let machHostedCheckoutPage: MachHostedCheckoutPage;
  let panelMachTransaccionesPage: PanelMachTransaccionesPage;
  let shopifyOrdersPage: ShopifyOrdersPage;

  test.beforeEach(async ({ page }) => {
    shopifyCheckoutPage = new ShopifyCheckoutPage(page);
    machHostedCheckoutPage = new MachHostedCheckoutPage(page);
    panelMachTransaccionesPage = new PanelMachTransaccionesPage(page);
    shopifyOrdersPage = new ShopifyOrdersPage(page);
  });

  /**
   * Objetivo: Confirmar que si el comprador regresa a la tienda antes de que Mach avise el resultado, la orden igualmente se resuelve como pagada cuando el webhook llega tras completar el pago desde el Panel Mach.
   * Precondicion: Webhooks existentes en el Panel Mach (modo Pruebas y Productivo, dos modalidades), tienda conectada (onboarding OK), medio de pago Mach activo con Modo de prueba encendido en Shopify, Panel Mach staging abierto en otra pestana con el switch en Pruebas, y ninguna otra transaccion pendiente en el Panel.
   */
  test('[TC-001]: [Pagos] - [Camino Alterno] - Validar que la orden se apruebe cuando el comprador vuelve antes del webhook y luego se completa el pago', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '59ce3319-a15d-420d-b770-13cf74d24d59' } }, async () => {
    await test.step('En el checkout de Shopify, elegir el medio de pago de Mach y tocar el boton Pay now', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await machHostedCheckoutPage.isPaymentPageVisible(), 'En el checkout de Shopify, elegir el medio de pago de Mach y tocar el boton Pay now').toBe(true);
    });
    await test.step('En el Panel Mach, abrir Historial de transacciones y actualizar si hace falta', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickActualizar();
      expect(await panelMachTransaccionesPage.isTransaccionVisible(), 'En el Panel Mach, abrir Historial de transacciones y actualizar si hace falta').toBe(true);
    });
    await test.step('Sin completar ni fallar nada en el Panel, volver a la tienda desde el checkout de Mach usando el boton de retorno', async () => {
      await machHostedCheckoutPage.clickVolverATienda();
      expect(await shopifyCheckoutPage.isMachPaymentOptionVisible(), 'Sin completar ni fallar nada en el Panel, volver a la tienda desde el checkout de Mach usando el boton de retorno').toBe(true);
    });
    await test.step('En el Panel Mach, tocar Completar pagos pendientes', async () => {
      await panelMachTransaccionesPage.clickCompletarPagosPendientes();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'En el Panel Mach, tocar Completar pagos pendientes').toContain('Confirmado');
    });
    await test.step('En el admin de Shopify, ir a Pedidos y abrir la orden generada en el paso 1', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'En el admin de Shopify, ir a Pedidos y abrir la orden generada en el paso 1').toContain('Pagado');
      expect(await shopifyOrdersPage.getMetodoPagoText(), 'En el admin de Shopify, ir a Pedidos y abrir la orden generada en el paso 1').toContain('Mach');
    });
  });

  /**
   * Objetivo: Confirmar que si el comprador regresa antes del aviso de Mach y despues el pago se falla desde el Panel, la orden queda rechazada en Shopify.
   * Precondicion: Webhooks existentes en el Panel Mach (modo Pruebas y Productivo, dos modalidades), tienda conectada, medio de pago Mach activo con Modo de prueba encendido en Shopify, Panel Mach staging abierto en modo Pruebas, y ninguna otra transaccion pendiente en el Panel.
   */
  test('[TC-002]: [Pagos] - [Camino Alterno] - Validar que la orden quede rechazada cuando el comprador vuelve antes del webhook y luego se falla el pago desde el Panel', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'd21c1fe8-5872-4dc0-af00-1b8baa0a37ca' } }, async () => {
    await test.step('En el checkout de Shopify, elegir el medio de pago de Mach y tocar Pay now', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await machHostedCheckoutPage.isPaymentPageVisible(), 'En el checkout de Shopify, elegir el medio de pago de Mach y tocar Pay now').toBe(true);
    });
    await test.step('En el Panel Mach, verificar que la compra aparece en Historial de transacciones como Compra desde Shopify en estado Pendiente', async () => {
      await panelMachTransaccionesPage.goto();
      expect(await panelMachTransaccionesPage.isTransaccionVisible(), 'En el Panel Mach, verificar que la compra aparece en Historial de transacciones como Compra desde Shopify en estado Pendiente').toBe(true);
    });
    await test.step('Sin completar ni fallar nada en el Panel, volver a la tienda desde el checkout de Mach', async () => {
      await machHostedCheckoutPage.clickVolverATienda();
      expect(await shopifyCheckoutPage.isMachPaymentOptionVisible(), 'Sin completar ni fallar nada en el Panel, volver a la tienda desde el checkout de Mach').toBe(true);
    });
    await test.step('En el Panel Mach, tocar Fallar pagos pendientes', async () => {
      await panelMachTransaccionesPage.clickFallarPagosPendientes();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'En el Panel Mach, tocar Fallar pagos pendientes').toContain('Fallido');
    });
    await test.step('En el admin de Shopify, ir a Pedidos y revisar la orden generada en el paso 1', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'En el admin de Shopify, ir a Pedidos y revisar la orden generada en el paso 1').toContain('Pago pendiente');
    });
  });
});
