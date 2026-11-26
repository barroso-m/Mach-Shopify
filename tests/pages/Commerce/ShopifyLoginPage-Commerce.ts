import { Page, Locator } from '@playwright/test';

/**
 * Page object de ShopifyLogin (Commerce).
 *
 * Generado por Nexus QA. Los locators estan como PLACEHOLDER: hay que
 * completarlos con DevTools contra la aplicacion real. Todo lo demas —la
 * estructura, los metodos y su firma— ya esta resuelto.
 */
export class ShopifyLoginPage {
  readonly page: Page;

  /** Campo de usuario/email del login del admin de Shopify */
  readonly usernameInput: Locator;
  /** Campo de contraseña del login del admin de Shopify */
  readonly passwordInput: Locator;
  /** Botón para iniciar sesión en el admin de Shopify */
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO(locator): Campo de usuario/email del login del admin de Shopify
    this.usernameInput = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Campo de contraseña del login del admin de Shopify
    this.passwordInput = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón para iniciar sesión en el admin de Shopify
    this.loginButton = page.locator('[data-nexus-qa-completar-este-locator]');
  }

  async goto() {
    await this.page.goto(process.env.COMMERCE_SHOPIFY_LOGIN_URL || '');
    await this.loginButton.waitFor({ state: 'visible' });
  }

  async fillUsername(usuario: string) {
    await this.usernameInput.fill(usuario);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}
