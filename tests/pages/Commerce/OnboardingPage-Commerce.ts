import { Page, Locator } from '@playwright/test';

/**
 * Page object de Onboarding (Commerce).
 *
 * Generado por Nexus QA. Los locators estan como PLACEHOLDER: hay que
 * completarlos con DevTools contra la aplicacion real. Todo lo demas —la
 * estructura, los metodos y su firma— ya esta resuelto.
 */
export class OnboardingPage {
  readonly page: Page;

  /** Título de la pantalla de onboarding 'Ingresa tu API Key de MACH para comercios y conecta tu tienda' */
  readonly formTitle: Locator;
  /** Campo de texto 'API Key' del formulario de onboarding */
  readonly apiKeyInput: Locator;
  /** Campo de texto 'Sandbox API Key' del formulario de onboarding */
  readonly sandboxApiKeyInput: Locator;
  /** Botón 'Conectar tienda' del formulario de onboarding */
  readonly conectarTiendaButton: Locator;
  /** Botón 'Ir a mi tienda' que aparece tras una conexión exitosa */
  readonly irATiendaButton: Locator;
  /** Mensaje de éxito '¡Hemos conectado tu tienda con MACH exitosamente!' */
  readonly successMessage: Locator;
  /** Mensaje de error 'La API Key es incorrecta.' */
  readonly errorMessage: Locator;
  /** Indicador visual de que ambos campos quedaron señalados como obligatorios al intentar enviar el formulario vacío */
  readonly camposObligatoriosMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO(locator): Título de la pantalla de onboarding 'Ingresa tu API Key de MACH para comercios y conecta tu tienda'
    this.formTitle = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Campo de texto 'API Key' del formulario de onboarding
    this.apiKeyInput = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Campo de texto 'Sandbox API Key' del formulario de onboarding
    this.sandboxApiKeyInput = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón 'Conectar tienda' del formulario de onboarding
    this.conectarTiendaButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Botón 'Ir a mi tienda' que aparece tras una conexión exitosa
    this.irATiendaButton = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Mensaje de éxito '¡Hemos conectado tu tienda con MACH exitosamente!'
    this.successMessage = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Mensaje de error 'La API Key es incorrecta.'
    this.errorMessage = page.locator('[data-nexus-qa-completar-este-locator]');
    // TODO(locator): Indicador visual de que ambos campos quedaron señalados como obligatorios al intentar enviar el formulario vacío
    this.camposObligatoriosMessage = page.locator('[data-nexus-qa-completar-este-locator]');
  }

  async goto() {
    await this.page.goto(process.env.COMMERCE_ONBOARDING_URL || '');
    await this.formTitle.waitFor({ state: 'visible' });
  }

  async fillApiKey(apiKey: string) {
    await this.apiKeyInput.fill(apiKey);
  }

  async fillSandboxApiKey(sandboxApiKey: string) {
    await this.sandboxApiKeyInput.fill(sandboxApiKey);
  }

  async clickConectarTienda() {
    await this.conectarTiendaButton.click();
  }

  async clickIrATienda() {
    await this.irATiendaButton.click();
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isErrorMessageVisible(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isCamposObligatoriosVisible(): Promise<boolean> {
    try {
      await this.camposObligatoriosMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isFormTitleVisible(): Promise<boolean> {
    try {
      await this.formTitle.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}
