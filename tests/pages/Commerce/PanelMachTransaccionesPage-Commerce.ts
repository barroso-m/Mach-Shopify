import { Page, Locator } from '@playwright/test';

/**
 * Page object de PanelMachTransacciones (Commerce).
 *
 * Generado por Nexus QA. Los locators estan como PLACEHOLDER: hay que
 * completarlos con DevTools contra la aplicacion real. Todo lo demas —la
 * estructura, los metodos y su firma— ya esta resuelto.
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

  constructor(page: Page) {
    this.page = page;

    // TODO(locator): Título de la pantalla 'Historial de transacciones' del Panel Mach
    this.pageTitle = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Switch para cambiar el Panel Mach a modo Pruebas
    this.pruebasSwitch = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón 'Actualizar' del Historial de transacciones
    this.actualizarButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón 'Completar pagos pendientes' del Panel Mach
    this.completarPagosPendientesButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón 'Fallar pagos pendientes' del Panel Mach
    this.fallarPagosPendientesButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón para reenviar manualmente el webhook de una transacción
    this.reenviarWebhookButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Texto que muestra el estado de la transacción (Pendiente, Confirmado, Expirado, fallido) en el Historial
    this.estadoTransaccionText = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Texto que muestra el historial de devolución (reembolso o reversa) asociado a una transacción
    this.historialDevolucionText = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Fila de la transacción 'Compra desde Shopify' listada en el Historial de transacciones
    this.transaccionRow = page.locator('[data-nexus-qa-completar-este-locator]');
  }

  async goto() {
    await this.page.goto(process.env.COMMERCE_PANEL_MACH_TRANSACCIONES_URL || '');
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async clickPruebasSwitch() {
    await this.pruebasSwitch.click();
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
      .inputValue()
      .catch(async () => (await this.historialDevolucionText.textContent()) ?? '');
  }

  async isTransaccionVisible(): Promise<boolean> {
    try {
      await this.transaccionRow.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}
