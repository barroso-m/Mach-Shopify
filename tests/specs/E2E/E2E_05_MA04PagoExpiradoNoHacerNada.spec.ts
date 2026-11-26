import { test, expect } from '@playwright/test';
import { ShopifyCheckoutPage } from '../../pages/Commerce/ShopifyCheckoutPage-Commerce';
import { MachHostedCheckoutPage } from '../../pages/Commerce/MachHostedCheckoutPage-Commerce';
import { PanelMachTransaccionesPage } from '../../pages/Commerce/PanelMachTransaccionesPage-Commerce';
import { ShopifyOrdersPage } from '../../pages/Commerce/ShopifyOrdersPage-Commerce';

/**
 * MA-04 · Pago expirado (no hacer nada)
 *
 * 2 caso(s) del modulo Pagos.
 *
 * Generado por Nexus QA a partir de los casos aprobados. Los locators de
 * los page objects estan como placeholder y hay que completarlos.
 */
test.describe('MA-04 · Pago expirado (no hacer nada)', () => {
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
   * Objetivo: Confirmar que, si el comprador no completa ni falla el pago desde el Panel Mach, la transacción pasa a "Expirado" y Shopify rechaza el pago sin dejar la orden pagada.
   * Precondicion: Webhooks de Pago completado, Pago expirado y Pago fallido existentes en el Panel Mach (modo Pruebas) para las dos modalidades; tienda conectada con onboarding OK; medio de pago Mach activo con "Modo de prueba" encendido en Shopify; Panel Mach staging abierto en otra pestaña con el switch en "Pruebas" y sin otras transacciones pendientes.
   */
  test('[TC-001]: [Pagos] - [Camino Feliz] - Validar que un pago sin resolver expira en el Panel Mach y la orden queda sin pagar en Shopify', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'faa18ab0-0f72-43bf-8bbf-a14098a5b186' } }, async () => {
    await test.step('En el checkout de Shopify, elegir el medio de pago de Mach y tocar Pay now', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await machHostedCheckoutPage.isPaymentPageVisible(), 'En el checkout de Shopify, elegir el medio de pago de Mach y tocar Pay now').toBe(true);
    });
    await test.step('En el Panel Mach, Historial de transacciones, verificar que la compra aparezca como Compra desde Shopify', async () => {
      await panelMachTransaccionesPage.goto();
      expect(await panelMachTransaccionesPage.isTransaccionVisible(), 'En el Panel Mach, Historial de transacciones, verificar que la compra aparezca como Compra desde Shopify').toBe(true);
    });
    await test.step('No tocar los botones de completar ni fallar, esperar y refrescar periodicamente el Historial de transacciones', async () => {
      await panelMachTransaccionesPage.clickActualizar();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'No tocar los botones de completar ni fallar, esperar y refrescar periodicamente el Historial de transacciones').toContain('Expirado');
    });
    await test.step('Volver a la pestana del checkout de Shopify y revisar el estado del pago y de la orden en el admin', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Volver a la pestana del checkout de Shopify y revisar el estado del pago y de la orden en el admin').toContain('Pago pendiente');
    });
  });

  /**
   * Objetivo: Confirmar que la ausencia del webhook de Pago expirado en el Panel Mach impide que Shopify reciba el resultado y la orden queda indefinidamente pendiente, pese a que en Mach el pago ya expiró.
   * Precondicion: Tienda conectada con onboarding OK y medio de pago Mach activo con "Modo de prueba" encendido; en el Panel Mach staging (modo Pruebas) el evento "Pago expirado" fue removido o desactivado de la suscripción del webhook, dejando el resto de los eventos intactos; sin otras transacciones pendientes.
   */
  test('[TC-002]: [Pagos] - [Camino de Error] - Validar que sin el webhook de Pago expirado configurado la orden queda "Pago pendiente" en Shopify aunque el Panel Mach la muestre "Expirado"', { tag: ['@pagos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '02565b10-977b-45dc-84fc-330037dc2e44' } }, async () => {
    await test.step('En el checkout de Shopify, elegir el medio de pago de Mach y tocar Pay now', async () => {
      await shopifyCheckoutPage.clickMachPaymentOption();
      await shopifyCheckoutPage.clickPayNow();
      expect(await machHostedCheckoutPage.isPaymentPageVisible(), 'En el checkout de Shopify, elegir el medio de pago de Mach y tocar Pay now').toBe(true);
      await panelMachTransaccionesPage.goto();
      expect(await panelMachTransaccionesPage.isTransaccionVisible(), 'En el checkout de Shopify, elegir el medio de pago de Mach y tocar Pay now').toBe(true);
    });
    await test.step('No interactuar con el pago ni con los botones del Panel, esperar hasta que la transaccion cambie de estado', async () => {
      await panelMachTransaccionesPage.clickActualizar();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'No interactuar con el pago ni con los botones del Panel, esperar hasta que la transaccion cambie de estado').toContain('Expirado');
    });
    await test.step('Revisar en el admin de Shopify el estado de la orden asociada, pasados varios minutos desde la expiracion', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Revisar en el admin de Shopify el estado de la orden asociada, pasados varios minutos desde la expiracion').toContain('Pago pendiente');
    });
  });
});
