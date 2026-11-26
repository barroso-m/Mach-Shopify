import { test, expect } from '@playwright/test';
import { PanelMachTransaccionesPage } from '../../pages/Commerce/PanelMachTransaccionesPage-Commerce';
import { ShopifyOrdersPage } from '../../pages/Commerce/ShopifyOrdersPage-Commerce';

/**
 * MA-08 · Reembolso parcial después de 5 minutos
 *
 * 6 caso(s) del modulo Reembolsos.
 *
 * Generado por Nexus QA a partir de los casos aprobados. Los locators de
 * los page objects estan como placeholder y hay que completarlos.
 */
test.describe('MA-08 · Reembolso parcial después de 5 minutos', () => {
  let panelMachTransaccionesPage: PanelMachTransaccionesPage;
  let shopifyOrdersPage: ShopifyOrdersPage;

  test.beforeEach(async ({ page }) => {
    panelMachTransaccionesPage = new PanelMachTransaccionesPage(page);
    shopifyOrdersPage = new ShopifyOrdersPage(page);
  });

  /**
   * Objetivo: Confirmar que un reembolso por un monto menor al total, solicitado 5 minutos o más después de la confirmación del pago, se procesa como reembolso parcial (no como anulación) y queda reflejado correctamente en Shopify y en el Panel Mach.
   * Precondicion: Existe una orden aprobada mediante el flujo de pago aprobado, cuyo pago fue confirmado en el Panel Mach hace 5 minutos o más, y que no fue usada en otro caso de reembolso.
   */
  test('[TC-001]: [Reembolsos] - [Camino Feliz] - Validar reembolso parcial después de 5 minutos', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '502c7af9-9d11-43a5-a4f8-b7556131b88b' } }, async () => {
    await test.step('En el Panel Mach, validar el estado de la transacción asociada a la orden', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'En el Panel Mach, validar el estado de la transacción asociada a la orden').toContain('Confirmado');
    });
    await test.step('En el admin de Shopify, ir a Pedidos y abrir la orden precondición', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
    });
    await test.step('Tocar Reembolsar y cargar un monto menor al total del pedido, luego confirmar', async () => {
      await shopifyOrdersPage.clickReembolsar();
      await shopifyOrdersPage.fillMontoReembolso(process.env.PARTIAL_REFUND_AMOUNT || '');
      await shopifyOrdersPage.clickConfirmarReembolso();
    });
    await test.step('Esperar unos segundos y revisar el estado de la orden en Shopify', async () => {
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Esperar unos segundos y revisar el estado de la orden en Shopify').toContain('Reembolsado parcialmente');
    });
    await test.step('Revisar la transacción correspondiente en el Panel Mach', async () => {
      expect(await panelMachTransaccionesPage.getHistorialDevolucion(), 'Revisar la transacción correspondiente en el Panel Mach').toContain('Reembolso');
    });
  });

  /**
   * Objetivo: Verificar que una orden acepta más de un reembolso parcial después de los 5 minutos y que el acumulado se refleja correctamente en Shopify y en el Panel Mach.
   * Precondicion: Existe una orden aprobada cuyo pago fue confirmado hace 5 minutos o más, sobre la que todavía no se realizó ningún reembolso.
   */
  test('[TC-002]: [Reembolsos] - [Camino Alterno] - Validar reembolsos parciales sucesivos hasta alcanzar el monto total', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'c0cd662e-cc1c-4cea-8ee6-8d181313bbc2' } }, async () => {
    await test.step('En el admin de Shopify, abrir la orden precondición y tocar Reembolsar', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      await shopifyOrdersPage.clickReembolsar();
    });
    await test.step('Cargar un primer monto parcial menor al total y confirmar', async () => {
      await shopifyOrdersPage.fillMontoReembolso(process.env.PARTIAL_REFUND_AMOUNT_1 || '');
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Cargar un primer monto parcial menor al total y confirmar').toContain('Reembolsado parcialmente');
    });
    await test.step('Volver a tocar Reembolsar sobre la misma orden y cargar un segundo monto parcial', async () => {
      await shopifyOrdersPage.clickReembolsar();
      await shopifyOrdersPage.fillMontoReembolso(process.env.PARTIAL_REFUND_AMOUNT_2 || '');
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Volver a tocar Reembolsar sobre la misma orden y cargar un segundo monto parcial').toContain('Reembolsado parcialmente');
    });
    await test.step('Revisar el historial de devolución en el Panel Mach', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      expect(await panelMachTransaccionesPage.getHistorialDevolucion(), 'Revisar el historial de devolución en el Panel Mach').toContain('Reembolso');
    });
    await test.step('Reembolsar el monto restante hasta cubrir el total del pedido', async () => {
      await shopifyOrdersPage.clickReembolsar();
      await shopifyOrdersPage.fillMontoReembolso(process.env.PARTIAL_REFUND_AMOUNT_REMAINING || '');
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Reembolsar el monto restante hasta cubrir el total del pedido').toContain('Reembolsado');
    });
  });

  /**
   * Objetivo: Confirmar que el sistema impide solicitar un reembolso parcial por un monto superior al total pagado de la orden.
   * Precondicion: Existe una orden aprobada cuyo pago fue confirmado hace 5 minutos o más y que no tiene reembolsos previos.
   */
  test('[TC-003]: [Reembolsos] - [Camino de Error] - Validar reembolso parcial con monto mayor al total del pedido', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '3dbf0e8c-2511-472e-9ac8-6c0a6070bfb5' } }, async () => {
    await test.step('En el admin de Shopify, abrir la orden precondición y tocar Reembolsar', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      await shopifyOrdersPage.clickReembolsar();
    });
    await test.step('Intentar cargar en el campo de monto un valor mayor al total pagado de la orden', async () => {
      await shopifyOrdersPage.fillMontoReembolso(process.env.EXCESS_REFUND_AMOUNT || '');
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.isReembolsoErrorVisible(), 'Intentar cargar en el campo de monto un valor mayor al total pagado de la orden').toBe(true);
    });
    await test.step('Validar en el Panel Mach que no se generó ninguna devolución nueva', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'Validar en el Panel Mach que no se generó ninguna devolución nueva').toContain('Confirmado');
    });
  });

  /**
   * Objetivo: Confirmar que el sistema no permite confirmar un reembolso parcial sin un monto mayor a cero.
   * Precondicion: Existe una orden aprobada cuyo pago fue confirmado hace 5 minutos o más.
   */
  test('[TC-004]: [Reembolsos] - [Camino de Error] - Validar reembolso parcial con monto en cero', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '21a9504b-243a-467b-92ce-032f2c65fe39' } }, async () => {
    await test.step('En el admin de Shopify, abrir la orden precondición y tocar Reembolsar', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      await shopifyOrdersPage.clickReembolsar();
    });
    await test.step('Dejar el campo de monto en cero o vacío y tocar el botón de confirmar reembolso', async () => {
      await shopifyOrdersPage.fillMontoReembolso('0');
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.isReembolsoErrorVisible(), 'Dejar el campo de monto en cero o vacío y tocar el botón de confirmar reembolso').toBe(true);
    });
    await test.step('Validar en el Panel Mach que no se generó ninguna devolución', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'Validar en el Panel Mach que no se generó ninguna devolución').toContain('Confirmado');
    });
  });

  /**
   * Objetivo: Confirmar que, si pasados los 5 minutos el pago aún no llegó a estado CONFIRMED en Mach, el reembolso parcial falla y queda registrado como tal en Shopify.
   * Precondicion: Existe una orden aprobada cuyo pago fue confirmado como COMPLETED hace 5 minutos o más, pero que en el Panel Mach todavía no muestra el estado CONFIRMED.
   */
  test('[TC-005]: [Reembolsos] - [Camino de Error] - Validar reembolso parcial sobre un pago que todavía no está CONFIRMED en Mach', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'b4d10a30-a66d-4339-a52e-c7c2430d33ac' } }, async () => {
    await test.step('En el Panel Mach, verificar el estado de la transacción asociada a la orden precondición', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'En el Panel Mach, verificar el estado de la transacción asociada a la orden precondición').toContain('COMPLETED');
    });
    await test.step('En el admin de Shopify, abrir la orden y tocar Reembolsar con un monto menor al total, luego confirmar', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      await shopifyOrdersPage.clickReembolsar();
      await shopifyOrdersPage.fillMontoReembolso(process.env.PARTIAL_REFUND_AMOUNT || '');
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.isReembolsoErrorVisible(), 'En el admin de Shopify, abrir la orden y tocar Reembolsar con un monto menor al total, luego confirmar').toBe(true);
    });
    await test.step('Anotar en el reporte el estado exacto del pago en el Panel Mach y la hora en que se intentó el reembolso', async () => {
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'Anotar en el reporte el estado exacto del pago en el Panel Mach y la hora en que se intentó el reembolso').toContain('COMPLETED');
    });
  });

  /**
   * Objetivo: Confirmar que un reembolso parcial solicitado después de transcurridos 14 días corridos desde el cobro es rechazado y queda registrado como fallido en Shopify.
   * Precondicion: Existe una orden aprobada cuyo pago fue confirmado hace más de 14 días corridos y que no tiene reembolsos previos.
   */
  test('[TC-006]: [Reembolsos] - [Camino de Error] - Validar reembolso parcial fuera de la ventana de 14 días', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '453365fc-48f2-4eb8-85f5-9686910ce60d' } }, async () => {
    await test.step('En el admin de Shopify, abrir la orden precondición y tocar Reembolsar', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      await shopifyOrdersPage.clickReembolsar();
    });
    await test.step('Cargar un monto menor al total del pedido y confirmar el reembolso', async () => {
      await shopifyOrdersPage.fillMontoReembolso(process.env.PARTIAL_REFUND_AMOUNT || '');
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.isReembolsoErrorVisible(), 'Cargar un monto menor al total del pedido y confirmar el reembolso').toBe(true);
    });
    await test.step('Revisar el Panel Mach para la transacción correspondiente', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      expect(await panelMachTransaccionesPage.getEstadoTransaccion(), 'Revisar el Panel Mach para la transacción correspondiente').toContain('Confirmado');
    });
  });
});
