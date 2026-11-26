import { Page, Locator } from '@playwright/test';

/**
 * Page object de ShopifyApps (Commerce).
 *
 * Generado por Nexus QA. Los locators estan como PLACEHOLDER: hay que
 * completarlos con DevTools contra la aplicacion real. Todo lo demas —la
 * estructura, los metodos y su firma— ya esta resuelto.
 */
export class ShopifyAppsPage {
  readonly page: Page;

  /** Enlace a la app de Mach dentro del listado de Apps instaladas del admin de Shopify */
  readonly machAppLink: Locator;
  /** Botón 'Desinstalar' dentro del detalle de la app Mach */
  readonly desinstalarButton: Locator;
  /** Botón de confirmación de la desinstalación dentro del modal de confirmación */
  readonly confirmarDesinstalarButton: Locator;
  /** Título de la sección Apps del admin de Shopify */
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO(locator): Enlace a la app de Mach dentro del listado de Apps instaladas del admin de Shopify
    this.machAppLink = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón 'Desinstalar' dentro del detalle de la app Mach
    this.desinstalarButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón de confirmación de la desinstalación dentro del modal de confirmación
    this.confirmarDesinstalarButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Título de la sección Apps del admin de Shopify
    this.pageTitle = page.locator('[data-nexus-qa-completar-este-locator]');
  }

  async goto() {
    await this.page.goto(process.env.COMMERCE_SHOPIFY_APPS_URL || '');
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async clickMachApp() {
    await this.machAppLink.click();
  }

  async clickDesinstalar() {
    await this.desinstalarButton.click();
  }

  async clickConfirmarDesinstalar() {
    await this.confirmarDesinstalarButton.click();
  }

  async isDesinstalarButtonVisible(): Promise<boolean> {
    try {
      await this.desinstalarButton.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}
