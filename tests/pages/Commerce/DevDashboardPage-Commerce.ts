import { Page, Locator } from '@playwright/test';

/**
 * Page object de DevDashboard (Commerce).
 *
 * Generado por Nexus QA. Los locators estan como PLACEHOLDER: hay que
 * completarlos con DevTools contra la aplicacion real. Todo lo demas —la
 * estructura, los metodos y su firma— ya esta resuelto.
 */
export class DevDashboardPage {
  readonly page: Page;

  /** Enlace a la app Mach stage dentro del listado del Dev Dashboard */
  readonly appToInstallLink: Locator;
  /** Botón 'Install' para aceptar permisos e instalar la app */
  readonly installButton: Locator;
  /** Título de la pantalla del Dev Dashboard */
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO(locator): Enlace a la app Mach stage dentro del listado del Dev Dashboard
    this.appToInstallLink = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón 'Install' para aceptar permisos e instalar la app
    this.installButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Título de la pantalla del Dev Dashboard
    this.pageTitle = page.locator('[data-nexus-qa-completar-este-locator]');
  }

  async goto() {
    await this.page.goto(process.env.COMMERCE_DEV_DASHBOARD_URL || '');
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async clickAppToInstall() {
    await this.appToInstallLink.click();
  }

  async clickInstall() {
    await this.installButton.click();
  }
}
