import { test, expect } from '@playwright/test';
import { ShopifyOrdersPage } from '../../pages/Commerce/ShopifyOrdersPage-Commerce';
import { PanelMachTransaccionesPage } from '../../pages/Commerce/PanelMachTransaccionesPage-Commerce';

/**
 * MA-09 · Reembolso parcial dentro de los 5 minutos (verificación de comportamiento)
 *
 * 4 caso(s) del modulo Reembolsos.
 *
 * Generado por Nexus QA a partir de los casos aprobados. Los locators de
 * los page objects estan como placeholder y hay que completarlos.
 */
test.describe('MA-09 · Reembolso parcial dentro de los 5 minutos (verificación de comportamiento)', () => {
  let shopifyOrdersPage: ShopifyOrdersPage;
  let panelMachTransaccionesPage: PanelMachTransaccionesPage;

  test.beforeEach(async ({ page }) => {
    shopifyOrdersPage = new ShopifyOrdersPage(page);
    panelMachTransaccionesPage = new PanelMachTransaccionesPage(page);
  });

  /**
   * Objetivo: Verificar que sucede cuando el merchant pide un reembolso parcial sobre un pago aprobado hace menos de 5 minutos, ventana en la que el conector solo deberia aceptar anulaciones totales.
   * Precondicion: Existe una orden aprobada mediante el flujo de pago aprobado, confirmada en el Panel Mach hace menos de 5 minutos.
   */
  test('[TC-001]: [Reembolsos] - [Camino Alterno] - Validar comportamiento de reembolso parcial dentro de los 5 minutos', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '591739da-73f1-4300-87fc-60ae1828d693' } }, async () => {
    await test.step('Ir al admin de Shopify, sección Pedidos, y abrir la orden aprobada reciente', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
    });
    await test.step('Tocar Reembolsar y cargar un monto menor al total del pedido', async () => {
      await shopifyOrdersPage.clickReembolsar();
      await shopifyOrdersPage.fillMontoReembolso(process.env.PARTIAL_REFUND_AMOUNT || '');
    });
    await test.step('Confirmar el reembolso', async () => {
      await shopifyOrdersPage.clickConfirmarReembolso();
    });
    await test.step('Verificar de inmediato el estado de la orden en Shopify y el estado de la transacción en el Panel Mach', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      await panelMachTransaccionesPage.getHistorialDevolucion();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Verificar de inmediato el estado de la orden en Shopify y el estado de la transacción en el Panel Mach').toContain('Reembolsado parcialmente');
    });
  });

  /**
   * Objetivo: Verificar que si Shopify reintenta la misma solicitud de reembolso parcial dentro de la ventana de 5 minutos, el conector no vuelve a llamar a Mach y no se duplica el movimiento.
   * Precondicion: Existe una orden aprobada hace menos de 5 minutos sobre la que ya se disparo un reembolso parcial (exitoso o fallido) desde Shopify.
   */
  test('[TC-002]: [Reembolsos] - [Camino Alterno] - Validar reintento del mismo reembolso parcial dentro de los 5 minutos', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'fb0f7239-c440-4330-9b1a-8e2f1f78c6a2' } }, async () => {
    await test.step('Sobre la misma orden, intentar reembolsar nuevamente por el mismo monto', async () => {
      await shopifyOrdersPage.clickReembolsar();
      await shopifyOrdersPage.fillMontoReembolso(process.env.PARTIAL_REFUND_AMOUNT || '');
    });
    await test.step('Confirmar el reembolso', async () => {
      await shopifyOrdersPage.clickConfirmarReembolso();
    });
    await test.step('Revisar el estado final de la orden en Shopify y la transacción en el Panel Mach', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Revisar el estado final de la orden en Shopify y la transacción en el Panel Mach').toContain('Reembolsado parcialmente');
    });
  });

  /**
   * Objetivo: Verificar que el formulario de reembolso de Shopify impide cargar un monto parcial superior al total pagado de la orden.
   * Precondicion: Existe una orden aprobada, con cualquier antiguedad, aun no reembolsada.
   */
  test('[TC-003]: [Reembolsos] - [Camino de Error] - Validar reembolso parcial por un monto mayor al total del pedido', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'c5420f2b-a8dc-45c1-937a-90d25e7b0749' } }, async () => {
    await test.step('Ir al admin de Shopify, sección Pedidos, y abrir la orden aprobada', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
    });
    await test.step('Tocar Reembolsar e ingresar un monto mayor al total pagado', async () => {
      await shopifyOrdersPage.clickReembolsar();
      await shopifyOrdersPage.fillMontoReembolso(process.env.EXCESS_REFUND_AMOUNT || '');
    });
    await test.step('Intentar confirmar el reembolso', async () => {
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.isReembolsoErrorVisible(), 'Intentar confirmar el reembolso').toBe(true);
    });
  });

  /**
   * Objetivo: Verificar que Shopify no permite confirmar un reembolso sin un monto valido mayor a cero.
   * Precondicion: Existe una orden aprobada, con cualquier antiguedad, aun no reembolsada.
   */
  test('[TC-004]: [Reembolsos] - [Camino de Error] - Validar reembolso con monto vacio o en cero', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'a0cf9fb8-e99e-4744-8f94-c5b898253edb' } }, async () => {
    await test.step('Ir al admin de Shopify, sección Pedidos, y abrir la orden aprobada', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
    });
    await test.step('Tocar Reembolsar y dejar el campo de monto vacío o en cero', async () => {
      await shopifyOrdersPage.clickReembolsar();
      await shopifyOrdersPage.fillMontoReembolso('0');
    });
    await test.step('Intentar confirmar el reembolso', async () => {
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.isReembolsoErrorVisible(), 'Intentar confirmar el reembolso').toBe(true);
    });
  });
});
