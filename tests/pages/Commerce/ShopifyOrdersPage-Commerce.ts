import { Page, Locator } from '@playwright/test';

/**
 * Page object de ShopifyOrders (Commerce).
 *
 * Generado por Nexus QA. Los locators estan como PLACEHOLDER: hay que
 * completarlos con DevTools contra la aplicacion real. Todo lo demas —la
 * estructura, los metodos y su firma— ya esta resuelto.
 */
export class ShopifyOrdersPage {
  readonly page: Page;

  /** Tabla o listado de Pedidos en el admin de Shopify */
  readonly ordersTable: Locator;
  /** Enlace a una orden específica dentro del listado de Pedidos */
  readonly orderLink: Locator;
  /** Botón 'Reembolsar' dentro del detalle de la orden */
  readonly reembolsarButton: Locator;
  /** Campo de monto a reembolsar del formulario de reembolso */
  readonly montoReembolsoInput: Locator;
  /** Botón de confirmación del reembolso dentro del formulario */
  readonly confirmarReembolsoButton: Locator;
  /** Texto que muestra el estado de pago de la orden (Pagado, Pago pendiente, Reembolsado, Reembolsado parcialmente, fallido) */
  readonly paymentStatusText: Locator;
  /** Texto que muestra el método de pago utilizado en el detalle de la orden */
  readonly metodoPagoText: Locator;
  /** Mensaje de error de validación del formulario de reembolso */
  readonly reembolsoErrorMessage: Locator;
  /** Mensaje o indicador de que el acceso a la sección de Pedidos o a la acción de reembolso está restringido */
  readonly accesoRestringidoMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO(locator): Tabla o listado de Pedidos en el admin de Shopify
    this.ordersTable = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Enlace a una orden específica dentro del listado de Pedidos
    this.orderLink = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón 'Reembolsar' dentro del detalle de la orden
    this.reembolsarButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Campo de monto a reembolsar del formulario de reembolso
    this.montoReembolsoInput = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón de confirmación del reembolso dentro del formulario
    this.confirmarReembolsoButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Texto que muestra el estado de pago de la orden (Pagado, Pago pendiente, Reembolsado, Reembolsado parcialmente, fallido)
    this.paymentStatusText = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Texto que muestra el método de pago utilizado en el detalle de la orden
    this.metodoPagoText = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Mensaje de error de validación del formulario de reembolso
    this.reembolsoErrorMessage = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Mensaje o indicador de que el acceso a la sección de Pedidos o a la acción de reembolso está restringido
    this.accesoRestringidoMessage = page.locator('[data-nexus-qa-completar-este-locator]');
  }

  async goto() {
    await this.page.goto(process.env.COMMERCE_SHOPIFY_ORDERS_URL || '');
    await this.ordersTable.waitFor({ state: 'visible' });
  }

  async clickOrder() {
    await this.orderLink.click();
  }

  async clickReembolsar() {
    await this.reembolsarButton.click();
  }

  async fillMontoReembolso(monto: string) {
    await this.montoReembolsoInput.fill(monto);
  }

  async clickConfirmarReembolso() {
    await this.confirmarReembolsoButton.click();
  }

  async getPaymentStatusText(): Promise<string> {
    return this.paymentStatusText
      .inputValue()
      .catch(async () => (await this.paymentStatusText.textContent()) ?? '');
  }

  async getMetodoPagoText(): Promise<string> {
    return this.metodoPagoText
      .inputValue()
      .catch(async () => (await this.metodoPagoText.textContent()) ?? '');
  }

  async isReembolsarButtonVisible(): Promise<boolean> {
    try {
      await this.reembolsarButton.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isReembolsoErrorVisible(): Promise<boolean> {
    try {
      await this.reembolsoErrorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isAccesoRestringidoVisible(): Promise<boolean> {
    try {
      await this.accesoRestringidoMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}
