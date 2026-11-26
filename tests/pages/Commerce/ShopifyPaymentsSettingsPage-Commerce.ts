import { Page, Locator } from '@playwright/test';

/**
 * Page object de ShopifyPaymentsSettings (Commerce).
 *
 * Generado por Nexus QA. Los locators estan como PLACEHOLDER: hay que
 * completarlos con DevTools contra la aplicacion real. Todo lo demas —la
 * estructura, los metodos y su firma— ya esta resuelto.
 */
export class ShopifyPaymentsSettingsPage {
  readonly page: Page;

  /** Título de la pantalla Configuración → Pagos del admin de Shopify */
  readonly pageTitle: Locator;
  /** Enlace o sección del medio de pago Mach dentro de Configuración → Pagos */
  readonly machPaymentMethodLink: Locator;
  /** Interruptor 'Modo de prueba' (Test mode) del medio de pago Mach */
  readonly modoDePruebaToggle: Locator;
  /** Botón 'Activar' para habilitar el medio de pago Mach */
  readonly activarButton: Locator;
  /** Indicador de que el medio de pago Mach quedó activo */
  readonly machActivoMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO(locator): Título de la pantalla Configuración → Pagos del admin de Shopify
    this.pageTitle = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Enlace o sección del medio de pago Mach dentro de Configuración → Pagos
    this.machPaymentMethodLink = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Interruptor 'Modo de prueba' (Test mode) del medio de pago Mach
    this.modoDePruebaToggle = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón 'Activar' para habilitar el medio de pago Mach
    this.activarButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Indicador de que el medio de pago Mach quedó activo
    this.machActivoMessage = page.locator('[data-nexus-qa-completar-este-locator]');
  }

  async goto() {
    await this.page.goto(process.env.COMMERCE_SHOPIFY_PAYMENTS_SETTINGS_URL || '');
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async clickMachPaymentMethod() {
    await this.machPaymentMethodLink.click();
  }

  async toggleModoDePrueba() {
    await this.modoDePruebaToggle.click();
  }

  async clickActivar() {
    await this.activarButton.click();
  }

  async isMachActivoVisible(): Promise<boolean> {
    try {
      await this.machActivoMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}
