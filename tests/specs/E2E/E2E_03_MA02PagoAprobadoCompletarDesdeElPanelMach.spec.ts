import { test, expect } from '@playwright/test';
import { ShopifyCheckoutPage } from '../../pages/Commerce/ShopifyCheckoutPage-Commerce';
import { MachHostedCheckoutPage } from '../../pages/Commerce/MachHostedCheckoutPage-Commerce';
import { PanelMachTransaccionesPage } from '../../pages/Commerce/PanelMachTransaccionesPage-Commerce';
import { ShopifyOrdersPage } from '../../pages/Commerce/ShopifyOrdersPage-Commerce';

/**
 * MA-02 · Pago aprobado (completar desde el Panel Mach)
 *
 * 4 caso(s) del modulo Pagos.
 *
 * Generado por Nexus QA a partir de los casos aprobados. Los locators de
 * los page objects estan como placeholder y hay que completarlos.
 */
test.describe('MA-02 · Pago aprobado (completar desde el Panel Mach)', () => {
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
   * Objetivo: Verificar que un pago completado desde el Panel Mach con el botón Completar pagos pendientes deja la orden como pagada en Shopify con Mach como método de pago.
   * Precondicion: Webhooks existentes en el Panel Mach (modo Pruebas y Productivo, dos modalidades); tienda conectada con el medio de pago Mach activo y Modo de prueba encendido en Shopify; Panel Mach staging abierto en otra pestaña con el switch en Pruebas; sin otras transacciones pendientes en el Historial de transacciones.
   */
  test('[TC-001]: [Pagos] - [Camino Feliz] - Validar pago aprobado completando desde el Panel Mach', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'a8d1e2ee-7bdb-47bd-91f9-0c850d5dd7b6' } }, async () => {
    await test.step('En el checkout de Shopify, seleccionar el medio de pago de Mach y tocar el boton Pay now', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await machHostedCheckoutPage.isPaymentPageVisible(), 'En el checkout de Shopify, seleccionar el medio de pago de Mach y tocar el boton Pay now').toBe(true);
    });
    await test.step('En el Panel Mach, abrir Historial de transacciones y actualizar si hace falta', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickActualizar();
      expect(await panelMachTransaccionesPage.isTransaccionVisible(), 'En el Panel Mach, abrir Historial de transacciones y actualizar si hace falta').toBe(true);
    });
    await test.step('Tocar el boton Completar pagos pendientes', async () => {
      await panelMachTransaccionesPage.clickCompletarPagosPendientes();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'Tocar el boton Completar pagos pendientes').toContain('Confirmado');
    });
    await test.step('Volver a la pestana del checkout de Mach y tocar el boton que ofrece volver al sitio', async () => {
      await machHostedCheckoutPage.clickVolverATienda();
      expect(await shopifyCheckoutPage.isThankYouMessageVisible(), 'Volver a la pestana del checkout de Mach y tocar el boton que ofrece volver al sitio').toBe(true);
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Volver a la pestana del checkout de Mach y tocar el boton que ofrece volver al sitio').toContain('Pagado');
      expect(await shopifyOrdersPage.getMetodoPagoText(), 'Volver a la pestana del checkout de Mach y tocar el boton que ofrece volver al sitio').toContain('Mach');
    });
  });

  /**
   * Objetivo: Verificar que, sin el webhook de Pago completado suscripto en el Panel Mach, una transacción confirmada en Mach no aprueba la orden en Shopify.
   * Precondicion: Tienda conectada con el medio de pago Mach activo y Modo de prueba encendido; en el Panel Mach modo Pruebas NO existe (o está deshabilitado) el webhook con el evento Pago completado para la URL del conector; sin otras transacciones pendientes.
   */
  test('[TC-002]: [Pagos] - [Camino de Error] - Validar que la orden queda pendiente en Shopify si falta el webhook de pago completado', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'c7b23a95-7475-4601-92bb-edf4b1c3c037' } }, async () => {
    await test.step('En el checkout de Shopify, seleccionar el medio de pago de Mach y tocar Pay now', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await machHostedCheckoutPage.isPaymentPageVisible(), 'En el checkout de Shopify, seleccionar el medio de pago de Mach y tocar Pay now').toBe(true);
    });
    await test.step('En el Panel Mach, Historial de transacciones, confirmar que la compra figura como Pendiente', async () => {
      await panelMachTransaccionesPage.goto();
      expect(await panelMachTransaccionesPage.isTransaccionVisible(), 'En el Panel Mach, Historial de transacciones, confirmar que la compra figura como Pendiente').toBe(true);
    });
    await test.step('Tocar Completar pagos pendientes', async () => {
      await panelMachTransaccionesPage.clickCompletarPagosPendientes();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'Tocar Completar pagos pendientes').toContain('Confirmado');
    });
    await test.step('Esperar varios minutos y revisar en el admin de Shopify la orden correspondiente', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Esperar varios minutos y revisar en el admin de Shopify la orden correspondiente').toContain('Pago pendiente');
    });
  });

  /**
   * Objetivo: Verificar que dejar más de una transacción pendiente provoca que el botón Completar pagos pendientes las apruebe a todas simultáneamente, mezclando órdenes distintas.
   * Precondicion: Webhooks configurados en el Panel Mach y tienda conectada con Modo de prueba encendido; posibilidad de iniciar al menos dos pagos con Mach en carritos distintos de la misma tienda.
   */
  test('[TC-003]: [Pagos] - [Camino de Error] - Validar que Completar pagos pendientes aprueba todas las transacciones pendientes a la vez', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '92b91f9f-84b6-40a5-bc4d-89277ae0ae50' } }, async () => {
    await test.step('Iniciar un pago con Mach desde un primer carrito y dejar la pestana del checkout de Mach abierta sin resolver', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
    });
    await test.step('Iniciar un segundo pago con Mach desde otro carrito distinto, tambien sin resolver', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await panelMachTransaccionesPage.isTransaccionVisible(), 'Iniciar un segundo pago con Mach desde otro carrito distinto, tambien sin resolver').toBe(true);
    });
    await test.step('Tocar Completar pagos pendientes', async () => {
      await panelMachTransaccionesPage.clickCompletarPagosPendientes();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'Tocar Completar pagos pendientes').toContain('Confirmado');
    });
    await test.step('Volver a la tienda desde cada una de las pestanas de checkout de Mach', async () => {
      await machHostedCheckoutPage.clickVolverATienda();
      await shopifyOrdersPage.goto();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Volver a la tienda desde cada una de las pestanas de checkout de Mach').toContain('Pagado');
    });
  });

  /**
   * Objetivo: Verificar que, tras perderse el webhook de pago completado, reenviarlo manualmente desde el Panel Mach aprueba la orden en Shopify.
   * Precondicion: Existe una transacción en estado "Confirmado" en el Panel Mach cuya orden asociada permanece en "Pago pendiente" en Shopify por falta de entrega del webhook; el Panel Mach ofrece la opción de reenviar el webhook de esa transacción.
   */
  test('[TC-004]: [Pagos] - [Camino Alterno] - Validar que reenviar manualmente el webhook resuelve una orden que quedó pendiente', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'c32d92ce-8143-48cd-9717-3b6005b2db09' } }, async () => {
    await test.step('En el Panel Mach, Historial de transacciones, ubicar la transaccion Confirmado cuya orden sigue pendiente en Shopify', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.isTransaccionVisible();
    });
    await test.step('Reenviar manualmente el webhook asociado a esa transaccion desde el Panel Mach', async () => {
      await panelMachTransaccionesPage.clickReenviarWebhook();
    });
    await test.step('Revisar en el admin de Shopify, en Pedidos, la orden correspondiente', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Revisar en el admin de Shopify, en Pedidos, la orden correspondiente').toContain('Pagado');
    });
  });
});
