import { Page, Locator } from '@playwright/test';

/**
 * Page object del login del Panel Mach staging (Commerce).
 * URL: https://pay-staging.somosmach.com/auth/sign-in
 *
 * Prioridad: data-test -> test-id -> id -> getByRole -> name
 * - La app (Angular Material) no expone data-test ni test-id.
 * - Ids descartados: mat-input-0 / mat-input-1 los genera Angular Material en
 *   runtime y dependen del orden de render.
 * - Los inputs no tienen atributo name (usan formcontrolname), así que se usa
 *   getByRole con el nombre accesible que les da su <label>.
 */
export class PanelMachLoginPage {
  readonly page: Page;

  /** Campo "Ingresa tu correo" */
  readonly emailInput: Locator;
  /** Campo "Contraseña" */
  readonly passwordInput: Locator;
  /** Botón "Iniciar sesión" (queda disabled hasta completar ambos campos) */
  readonly iniciarSesionButton: Locator;
  /** Botón "Olvidé mi contraseña" */
  readonly olvideMiContrasenaButton: Locator;
  /** Botón "Rechazar opcionales" del banner de cookies (OneTrust) */
  readonly rechazarCookiesButton: Locator;
  /** Snackbar de error (p. ej. "Estamos solucionando un inconveniente técnico...") */
  readonly errorSnackbar: Locator;

  constructor(page: Page) {
    this.page = page;

    // getByRole: el <label for> le da el nombre accesible; exact evita choques con el texto de ayuda.
    this.emailInput = page.getByRole('textbox', { name: 'Ingresa tu correo', exact: true });
    // getByRole: el input type=password conserva el nombre de su <label> "Contraseña".
    this.passwordInput = page.getByRole('textbox', { name: 'Contraseña', exact: true });
    this.iniciarSesionButton = page.getByRole('button', { name: 'Iniciar sesión', exact: true });
    this.olvideMiContrasenaButton = page.getByRole('button', { name: 'Olvidé mi contraseña', exact: true });
    // id estable: lo define OneTrust (no es generado en runtime).
    this.rechazarCookiesButton = page.locator('#onetrust-reject-all-handler');
    // Sin role="alert": se ancla al componente <app-snackbar> con la variante de error.
    this.errorSnackbar = page.locator('app-snackbar .snackbar--error');
  }

  async goto() {
    await this.page.goto(process.env.COMMERCE_PANEL_MACH_LOGIN_URL || '');
    await this.emailInput.waitFor({ state: 'visible' });
  }

  async aceptarBannerCookiesSiAparece() {
    await this.rechazarCookiesButton.click({ timeout: 5000 }).catch(() => {});
  }

  async login(usuario: string, password: string) {
    await this.aceptarBannerCookiesSiAparece();
    await this.emailInput.fill(usuario);
    await this.passwordInput.fill(password);
    await this.iniciarSesionButton.click();
  }
}
