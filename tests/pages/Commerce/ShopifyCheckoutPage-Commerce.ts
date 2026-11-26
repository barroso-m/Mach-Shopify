import { Page, Locator } from '@playwright/test';

/**
 * Page object de ShopifyCheckout (Commerce).
 *
 * Generado por Nexus QA. Los locators estan como PLACEHOLDER: hay que
 * completarlos con DevTools contra la aplicacion real. Todo lo demas —la
 * estructura, los metodos y su firma— ya esta resuelto.
 */
export class ShopifyCheckoutPage {
  readonly page: Page;

  /** Opción de medio de pago Mach dentro del checkout de la tienda */
  readonly machPaymentOption: Locator;
  /** Botón 'Pay now' del checkout */
  readonly payNowButton: Locator;
  /** Opción de un medio de pago alternativo distinto a Mach en el checkout */
  readonly alternativePaymentOption: Locator;
  /** Botón para completar la compra con el medio de pago seleccionado */
  readonly completarCompraButton: Locator;
  /** Mensaje o título de la Thank you page tras completar la compra */
  readonly thankYouMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO(locator): Opción de medio de pago Mach dentro del checkout de la tienda
    this.machPaymentOption = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón 'Pay now' del checkout
    this.payNowButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Opción de un medio de pago alternativo distinto a Mach en el checkout
    this.alternativePaymentOption = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón para completar la compra con el medio de pago seleccionado
    this.completarCompraButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Mensaje o título de la Thank you page tras completar la compra
    this.thankYouMessage = page.locator('[data-nexus-qa-completar-este-locator]');
  }

  async goto() {
    await this.page.goto(process.env.COMMERCE_SHOPIFY_CHECKOUT_URL || '');
    await this.payNowButton.waitFor({ state: 'visible' });
  }

  async clickMachPaymentOption() {
    await this.machPaymentOption.click();
  }

  async clickPayNow() {
    await this.payNowButton.click();
  }

  async clickAlternativePaymentOption() {
    await this.alternativePaymentOption.click();
  }

  async clickCompletarCompra() {
    await this.completarCompraButton.click();
  }

  async isMachPaymentOptionVisible(): Promise<boolean> {
    try {
      await this.machPaymentOption.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isThankYouMessageVisible(): Promise<boolean> {
    try {
      await this.thankYouMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}
