import { Page, Locator } from '@playwright/test';

/**
 * Page object de PanelMachTransacciones (Commerce).
 * URL: https://pay-staging.somosmach.com/payments (Historial de transacciones)
 *
 * Prioridad: data-test -> test-id -> id -> getByRole -> name
 * - La app (Angular Material) no expone data-test ni test-id.
 * - Ids descartados: mat-input-N, mat-select-N, mat-tab-link-N los genera Angular Material
 *   en runtime según el orden de render.
 * - Sin role="heading" en el título y sin role="switch" en el selector de ambiente: se anclan
 *   a los componentes propios de la app (<app-payments-list-container>, <app-test-mode-slider>),
 *   que son estables (nombres de componentes, no hashes).
 * - La tabla es un mat-table con roles row/cell, así que las filas se toman por getByRole('row').
 *
 * Verificado contra el panel staging en modo Pruebas el 2026-11-26.
 * Los botones "Completar/Fallar pagos pendientes" solo se renderizan cuando hay al menos una
 * transacción Pendiente; al resolverse, desaparecen (no hay diálogo de confirmación).
 */
export class PanelMachTransaccionesPage {
  readonly page: Page;

  /** Título de la pantalla 'Historial de transacciones' del Panel Mach */
  readonly pageTitle: Locator;
  /** Switch para cambiar el Panel Mach a modo Pruebas */
  readonly pruebasSwitch: Locator;
  /** Botón 'Actualizar' del Historial de transacciones */
  readonly actualizarButton: Locator;
  /** Botón 'Completar pagos pendientes' del Panel Mach */
  readonly completarPagosPendientesButton: Locator;
  /** Botón 'Fallar pagos pendientes' del Panel Mach */
  readonly fallarPagosPendientesButton: Locator;
  /** Botón para reenviar manualmente el webhook de una transacción */
  readonly reenviarWebhookButton: Locator;
  /** Texto que muestra el estado de la transacción (Pendiente, Confirmado, Expirado, fallido) en el Historial */
  readonly estadoTransaccionText: Locator;
  /** Texto que muestra el historial de devolución (reembolso o reversa) asociado a una transacción */
  readonly historialDevolucionText: Locator;
  /** Fila de la transacción 'Compra desde Shopify' listada en el Historial de transacciones */
  readonly transaccionRow: Locator;
  /** Botón 'Ver detalle' de la fila de la transacción (solo visible con hover) */
  readonly verDetalleButton: Locator;
  /** Título 'Historial de devoluciones' en el detalle de pago */
  readonly historialDevolucionTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sin heading: el <span class="text-2xl"> del contenedor de la lista. El mismo texto
    // aparece en el menú lateral y en el breadcrumb, por eso se ancla al componente.
    this.pageTitle = page.locator('app-payments-list-container').getByText('Historial de transacciones', { exact: true });
    // <app-test-mode-slider>: dos <span> "Productivo" / "Pruebas" sin rol; se clickea el texto.
    this.pruebasSwitch = page.locator('app-test-mode-slider').getByText('Pruebas', { exact: true });
    // getByRole: el mat-icon "autorenew" es aria-hidden, el nombre accesible queda "Actualizar".
    this.actualizarButton = page.getByRole('button', { name: 'Actualizar', exact: true });
    this.completarPagosPendientesButton = page.getByRole('button', { name: 'Completar pagos pendientes', exact: true });
    this.fallarPagosPendientesButton = page.getByRole('button', { name: 'Fallar pagos pendientes', exact: true });
    // ATENCIÓN: al 2026-11-26 el Panel Mach staging NO ofrece reenvío manual de webhooks
    // (ni en Historial, ni en el detalle de pago, ni en Configuraciones > Para desarrolladores > Webhooks).
    // Se deja el locator por nombre para cuando exista; el caso que lo usa (MA-02 TC-004) está en fixme.
    this.reenviarWebhookButton = page.getByRole('button', { name: /reenviar/i });
    // Última "Compra desde Shopify" (la lista está ordenada por fecha descendente).
    this.transaccionRow = page.getByRole('row').filter({ hasText: 'Compra desde Shopify' }).first();
    // <app-payment-status> renderiza el estado: Pendiente / Confirmado / Expirado / Fallido / Cancelado.
    this.estadoTransaccionText = this.transaccionRow.locator('app-payment-status');
    this.verDetalleButton = this.transaccionRow.getByRole('button', { name: 'Ver detalle' });
    // Detalle de pago (/payments/<id>): sección "Historial de devoluciones" (h4, sin rol heading accesible propio).
    this.historialDevolucionTitle = page.locator('app-payment-detail-container h4', { hasText: 'Historial de devoluciones' });
    // Contenido que sigue al título. PENDIENTE de verificar con una devolución real: al 2026-11-26
    // no había ninguna devolución en el sandbox, así que solo se pudo ver la sección vacía.
    this.historialDevolucionText = page.locator('app-payment-detail-container h4:has-text("Historial de devoluciones") ~ *');
  }

  async goto() {
    await this.page.goto(process.env.COMMERCE_PANEL_MACH_TRANSACCIONES_URL || '');
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async clickPruebasSwitch() {
    await this.pruebasSwitch.click();
  }

  /** El ambiente activo es el <span> en negrita del slider. Solo togglea si hace falta. */
  async asegurarModoPruebas() {
    const activo = await this.pruebasSwitch.locator('xpath=..').getAttribute('class');
    if (!activo?.includes('font-bold')) {
      await this.clickPruebasSwitch();
      await this.page.waitForTimeout(2000);
      await this.pageTitle.waitFor({ state: 'visible' });
    }
  }

  async clickActualizar() {
    await this.actualizarButton.click();
  }

  async clickCompletarPagosPendientes() {
    await this.completarPagosPendientesButton.click();
  }

  async clickFallarPagosPendientes() {
    await this.fallarPagosPendientesButton.click();
  }

  async clickReenviarWebhook() {
    await this.reenviarWebhookButton.click();
  }

  async getEstadoTransaccion(): Promise<string> {
    return this.estadoTransaccionText
      .inputValue()
      .catch(async () => (await this.estadoTransaccionText.textContent()) ?? '');
  }

  async getHistorialDevolucion(): Promise<string> {
    return this.historialDevolucionText
      .allInnerTexts()
      .then((t) => t.join('\n'))
      .catch(() => '');
  }

  async isTransaccionVisible(): Promise<boolean> {
    try {
      await this.transaccionRow.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Espera (refrescando con "Actualizar") hasta que la última "Compra desde Shopify" tenga el estado dado.
   * Los cambios de estado los aplica el backend de Mach en forma asíncrona.
   */
  async esperarEstadoTransaccion(estado: string, timeoutMs = 60_000) {
    const fin = Date.now() + timeoutMs;
    while (Date.now() < fin) {
      if ((await this.getEstadoTransaccion().catch(() => '')).includes(estado)) return;
      await this.clickActualizar();
      await this.page.waitForTimeout(3000);
    }
    throw new Error(`La transacción no llegó al estado "${estado}" en ${timeoutMs / 1000}s`);
  }

  /** Abre el detalle de la última "Compra desde Shopify" (el botón solo aparece con hover). */
  async abrirDetalleTransaccion() {
    await this.transaccionRow.hover();
    await this.verDetalleButton.click();
    await this.historialDevolucionTitle.waitFor({ state: 'visible' });
  }
}
