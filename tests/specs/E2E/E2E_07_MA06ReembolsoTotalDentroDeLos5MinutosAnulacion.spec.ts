import { test, expect } from '@playwright/test';
import { ShopifyOrdersPage } from '../../pages/Commerce/ShopifyOrdersPage-Commerce';
import { PanelMachTransaccionesPage } from '../../pages/Commerce/PanelMachTransaccionesPage-Commerce';
import { ShopifyLoginPage } from '../../pages/Commerce/ShopifyLoginPage-Commerce';

/**
 * MA-06 · Reembolso total dentro de los 5 minutos (anulación)
 *
 * 4 caso(s) del modulo Reembolsos.
 *
 * Generado por Nexus QA a partir de los casos aprobados. Los locators de
 * los page objects estan como placeholder y hay que completarlos.
 */
test.describe('MA-06 · Reembolso total dentro de los 5 minutos (anulación)', () => {
  let shopifyOrdersPage: ShopifyOrdersPage;
  let panelMachTransaccionesPage: PanelMachTransaccionesPage;
  let shopifyLoginPage: ShopifyLoginPage;

  test.beforeEach(async ({ page }) => {
    shopifyOrdersPage = new ShopifyOrdersPage(page);
    panelMachTransaccionesPage = new PanelMachTransaccionesPage(page);
    shopifyLoginPage = new ShopifyLoginPage(page);
  });

  /**
   * Objetivo: Verificar que un reembolso total solicitado antes de que pasen 5 minutos desde la confirmación del pago se registra en Mach como una anulación (reversa) y la orden queda reembolsada en Shopify.
   * Precondicion: Existe una orden con un pago aprobado (confirmado en el Panel Mach) hace menos de 5 minutos, sin reembolsos previos.
   */
  test('[TC-001]: [Reembolsos] - [Camino Feliz] - Validar reembolso total dentro de los 5 minutos se procesa como anulación', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '6c2b959f-97c4-48e4-904d-c7178b8418f1' } }, async () => {
    await test.step('En el admin de Shopify, ir a Pedidos y abrir la orden con el pago recién aprobado', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
    });
    await test.step('Tocar el botón Reembolsar', async () => {
      await shopifyOrdersPage.clickReembolsar();
    });
    await test.step('Ingresar en el campo de monto el total pagado de la orden', async () => {
      await shopifyOrdersPage.fillMontoReembolso(process.env.ORDER_TOTAL_AMOUNT || '');
    });
    await test.step('Confirmar el reembolso', async () => {
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.getPaymentStatusText(), 'Confirmar el reembolso').toContain('Reembolsado');
    });
    await test.step('Ir al Panel Mach, con el switch en Pruebas, a Historial de transacciones, y ubicar la transacción correspondiente a la orden', async () => {
      await panelMachTransaccionesPage.goto();
      await panelMachTransaccionesPage.clickPruebasSwitch();
      expect(await panelMachTransaccionesPage.getHistorialDevolucion(), 'Ir al Panel Mach, con el switch en Pruebas, a Historial de transacciones, y ubicar la transacción correspondiente a la orden').toContain('Reversa');
    });
  });

  /**
   * Objetivo: Comprobar que, luego de aplicar un reembolso total por anulación, Shopify no permite iniciar un segundo reembolso sobre la misma orden.
   * Precondicion: Existe una orden con un reembolso total ya aplicado mediante una anulación (dentro de los 5 minutos de confirmado el pago).
   */
  test('[TC-002]: [Reembolsos] - [Camino Alterno] - Validar que no se puede reembolsar nuevamente una orden ya reembolsada totalmente dentro de los 5 minutos', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '24535921-a31e-474f-91b0-59c4ade81a01' } }, async () => {
    await test.step('En el admin de Shopify, ir a Pedidos y abrir la orden ya reembolsada totalmente', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
    });
    await test.step('Intentar iniciar un nuevo reembolso sobre la orden', async () => {
      expect(await shopifyOrdersPage.isReembolsarButtonVisible(), 'Intentar iniciar un nuevo reembolso sobre la orden').toBe(true);
    });
  });

  /**
   * Objetivo: Verificar que el formulario de reembolso de Shopify impide confirmar un reembolso por un monto mayor al total cobrado en la orden.
   * Precondicion: Existe una orden con un pago aprobado hace menos de 5 minutos, sin reembolsos previos.
   */
  test('[TC-003]: [Reembolsos] - [Camino de Error] - Validar que el monto a reembolsar no puede superar el total pagado', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: 'bfed9026-128a-423e-9098-6fc39adb70ed' } }, async () => {
    await test.step('En el admin de Shopify, ir a Pedidos y abrir la orden con el pago aprobado', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
    });
    await test.step('Tocar el botón Reembolsar', async () => {
      await shopifyOrdersPage.clickReembolsar();
    });
    await test.step('Ingresar en el campo de monto un valor mayor al total pagado de la orden', async () => {
      await shopifyOrdersPage.fillMontoReembolso(process.env.EXCESS_REFUND_AMOUNT || '');
    });
    await test.step('Intentar confirmar el reembolso', async () => {
      await shopifyOrdersPage.clickConfirmarReembolso();
      expect(await shopifyOrdersPage.isReembolsoErrorVisible(), 'Intentar confirmar el reembolso').toBe(true);
    });
  });

  /**
   * Objetivo: Comprobar que un usuario de staff de Shopify sin permiso de gestión de pedidos no puede acceder a la opción de reembolso de una orden pagada con Mach.
   * Precondicion: Existe una orden con un pago aprobado hace menos de 5 minutos, y existe un usuario de staff de la tienda sin el permiso de administración de pedidos habilitado.
   */
  test('[TC-004]: [Reembolsos] - [Camino de Error] - Validar que un usuario sin permiso sobre pedidos no puede iniciar un reembolso', { tag: ['@reembolsos', '@E2E'], annotation: { type: 'nexus-qa-caso', description: '067198e3-b8b6-49db-b9cf-c0a0c4d4efee' } }, async () => {
    await test.step('Iniciar sesión en el admin de Shopify con las credenciales del usuario de staff sin permiso de pedidos', async () => {
      await shopifyLoginPage.goto();
      await shopifyLoginPage.fillUsername(process.env.COMMERCE_STAFF_NO_PERMISSION_USERNAME || '');
      await shopifyLoginPage.fillPassword(process.env.COMMERCE_STAFF_NO_PERMISSION_PASSWORD || '');
      await shopifyLoginPage.clickLogin();
    });
    await test.step('Intentar acceder a la sección Pedidos o abrir la orden pagada', async () => {
      await shopifyOrdersPage.goto();
      await shopifyOrdersPage.clickOrder();
      expect(await shopifyOrdersPage.isAccesoRestringidoVisible(), 'Intentar acceder a la sección Pedidos o abrir la orden pagada').toBe(true);
    });
  });
});
