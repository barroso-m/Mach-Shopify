import { Page, Locator } from '@playwright/test';

/**
 * Page object de MachHostedCheckout (Commerce).
 *
 * Generado por Nexus QA. Los locators estan como PLACEHOLDER: hay que
 * completarlos con DevTools contra la aplicacion real. Todo lo demas —la
 * estructura, los metodos y su firma— ya esta resuelto.
 */
export class MachHostedCheckoutPage {
  readonly page: Page;

  /** Elemento identificativo de la página de pago hospedada de Mach (checkout.somosmach.com) */
  readonly paymentPageTitle: Locator;
  /** Botón para volver a la tienda desde el checkout hospedado de Mach */
  readonly volverATiendaButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO(locator): Elemento identificativo de la página de pago hospedada de Mach (checkout.somosmach.com)
    this.paymentPageTitle = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón para volver a la tienda desde el checkout hospedado de Mach
    this.volverATiendaButton = page.locator('[data-nexus-qa-completar-este-locator]');
  }

  async isPaymentPageVisible(): Promise<boolean> {
    try {
      await this.paymentPageTitle.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickVolverATienda() {
    await this.volverATiendaButton.click();
  }
}
