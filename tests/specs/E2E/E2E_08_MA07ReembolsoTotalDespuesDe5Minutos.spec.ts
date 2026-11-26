import { test, expect } from '@playwright/test';
import { ShopifyOrdersPage } from '../../pages/Commerce/ShopifyOrdersPage-Commerce';
import { PanelMachTransaccionesPage } from '../../pages/Commerce/PanelMachTransaccionesPage-Commerce';

/**
 * MA-07 · Reembolso total después de 5 minutos
 *
 * 3 caso(s) del modulo Reembolsos.
 *
 * Generado por Nexus QA a partir de los casos aprobados. Los locators de
 * los page objects estan como placeholder y hay que completarlos.
 */
test.describe('MA-07 · Reembolso total después de 5 minutos', () => {
  let shopifyOrdersPage: ShopifyOrdersPage;
  let panelMachTransaccionesPage: PanelMachTransaccionesPage;

  test.beforeEach(async ({ page }) => {
    shopifyOrdersPage = new ShopifyOrdersPage(page);
    panelMachTransaccionesPage = new PanelMachTransaccionesPage(page);
  });

  /**
   * Objetivo: Confirmar que un reembolso total solicitado sobre una orden con más de 5 minutos desde la confirmación del pago se procesa como reembolso (no como anulación) y queda reflejado correctamente en Shopify y en el Panel Mach.
   * Precondicion: Existe una orden aprobada en Shopify cuyo pago fue confirmado en el Panel Mach (estado Confirmado) hace 5 minutos o más, y no tiene reembolsos previos.
   */
  test('[TC-001]: [Reembolsos] - [Camino Feliz] - Validar reembolso total después de 5 minutos', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '94bf06f3-7c63-4042-a860-7ee8f21c9d72' } }, async () => {
    await test.step('En el admin de Shopify, ir a Pedidos y abrir la orden aprobada', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
    });
    await test.step('Tocar el botón Reembolsar', async () => {
      await shopifyOrdersPage.clickReembolsar();
    });
    await test.step('Ingresar el monto total y confirmar la operación', async () => {
      await shopifyOrdersPage.fillMontoReembolso(process.env.ORDER_TOTAL_AMOUNT || '');
      await shopifyOrdersPage.clickConfirmarReembolso();
    });
    await test.step('Esperar unos segundos y revisar el estado de la orden en Shopify', async () => {
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Esperar unos segundos y revisar el estado de la orden en Shopify').toContain('Reembolsado');
    });
    await test.step('En el Panel Mach, abrir el Historial de transacciones y ubicar la transacción de la orden', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      expect(await panelMachTransaccionesPage.getHistorialDevolucion(), 'En el Panel Mach, abrir el Historial de transacciones y ubicar la transacción de la orden').toContain('Reembolso');
    });
  });

  /**
   * Objetivo: Confirmar que un reembolso solicitado sobre un pago confirmado hace más de 14 días corridos es rechazado por el conector.
   * Precondicion: Existe una orden aprobada cuyo pago fue confirmado en el Panel Mach hace más de 14 días corridos y no tiene reembolsos previos.
   */
  test('[TC-002]: [Reembolsos] - [Camino de Error] - Validar reembolso rechazado fuera de los 14 días corridos', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'cb8c3b41-780c-49c6-9bb6-0488f1f9e4f9' } }, async () => {
    await test.step('En el admin de Shopify, ir a Pedidos y abrir la orden con más de 14 días desde la confirmación del pago', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
    });
    await test.step('Tocar Reembolsar, ingresar el monto total y confirmar', async () => {
      await shopifyOrdersPage.clickReembolsar();
      await shopifyOrdersPage.fillMontoReembolso(process.env.ORDER_TOTAL_AMOUNT || '');
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.isReembolsoErrorVisible(), 'Tocar Reembolsar, ingresar el monto total y confirmar').toBe(true);
    });
    await test.step('Revisar en el Panel Mach el estado de la transacción', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'Revisar en el Panel Mach el estado de la transacción').toContain('Confirmado');
    });
  });

  /**
   * Objetivo: Confirmar que, una vez que una orden fue reembolsada por el total, Shopify no permite iniciar un nuevo reembolso sobre el monto ya devuelto.
   * Precondicion: Existe una orden que ya fue reembolsada en su totalidad mediante un reembolso procesado más de 5 minutos después de la confirmación del pago.
   */
  test('[TC-003]: [Reembolsos] - [Camino Alterno] - Validar que no se puede reembolsar nuevamente una orden ya reembolsada totalmente', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '0daccc71-724d-482b-9bdc-7b4a3e07f7a7' } }, async () => {
    await test.step('En el admin de Shopify, ir a Pedidos y abrir la orden ya reembolsada en su totalidad', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
    });
    await test.step('Intentar tocar el botón Reembolsar o acceder al formulario de reembolso', async () => {
      expect(await shopifyOrdersPage.isReembolsarButtonVisible(), 'Intentar tocar el botón Reembolsar o acceder al formulario de reembolso').toBe(true);
    });
  });
});
