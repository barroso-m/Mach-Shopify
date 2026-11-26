/**
 * ============================================================================
 * SHIPPER PAGE REFERENCE TEMPLATE
 * ============================================================================
 * 
 * Esta es una página de referencia que demuestra las buenas prácticas y
 * patrones recomendados para crear páginas de prueba en SHIPPER.
 * 
 * Úsala como templado base cuando crees nuevas páginas para SHIPPER.
 * ============================================================================
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * Ejemplo: ReferencePage
 * Propósito: Demostrar la estructura y buenas prácticas para páginas SHIPPER
 * 
 * BUENAS PRÁCTICAS:
 * - Usar nombres descriptivos que representen claramente qué elemento es
 * - Definir todos los localizadores en el constructor
 * - Usar métodos pequeños y reutilizables (Single Responsibility Principle)
 * - Agregar esperas explícitas cuando sea necesario
 * - Usar comentarios para explicar lógica compleja
 * - Mantener la coherencia con otros localizadores de la app
 */
export class ReferencePageSHIPPER {
  readonly page: Page;

  // ========================================================================
  // LOCALIZADORES - ESTRUCTURA RECOMENDADA
  // ========================================================================
  readonly submitButton: Locator;
  readonly downloadLink: Locator;
  readonly pageHeading: Locator;
  readonly accountNumberInput: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly confirmationCheckbox: Locator;
  readonly successMessage: Locator;
  readonly errorNotification: Locator;
  readonly searchInput: Locator;
  readonly formSection: Locator;
  readonly selectOptions: Locator;
  readonly modalDialog: Locator;
  readonly successAlert: Locator;

  /**
   * Constructor: Inicializa todos los localizadores
   * 
   * RECOMENDACIÓN: Definir todos los localizadores aquí en el constructor
   * para que sean fáciles de encontrar y mantener en un solo lugar.
   */
  constructor(page: Page) {
    this.page = page;

    // Ejemplo 1: Usando getByRole (PREFERIDO)
    this.submitButton = page.getByRole('button', { name: 'Enviar' });
    this.downloadLink = page.getByRole('link', { name: 'Descargar' });
    this.pageHeading = page.getByRole('heading', { name: 'Bienvenido a SHIPPER' });

    // Ejemplo 2: Usando locator() con CSS
    this.accountNumberInput = page.locator('#accountNumber');
    this.emailField = page.locator('input[type="email"]');
    this.passwordField = page.locator('input[type="password"]');
    this.confirmationCheckbox = page.locator('input[type="checkbox"][name="accept-terms"]');

    // Ejemplo 3: Usando getByText()
    this.successMessage = page.getByText('¡Operación completada con éxito!');
    this.errorNotification = page.getByText(/Error|error/);

    // Ejemplo 4: Usando getByPlaceholder()
    this.searchInput = page.getByPlaceholder('Buscar número de cuenta...');

    // Ejemplo 5: Usando combinaciones y selectores anidados
    this.formSection = page.locator('form[id="user-details"]');
    this.selectOptions = page.locator('select[name="delivery-type"]');

    // Contenedores
    this.modalDialog = page.locator('div[role="dialog"]');
    this.successAlert = page.locator('[role="alert"].success');
  }

  // ========================================================================
  // MÉTODOS DE NAVEGACIÓN
  // ========================================================================

  /**
   * Navega a la página SHIPPER principal
   * 
   * BUENAS PRÁCTICAS:
   * - Usar URLs desde variables de entorno cuando sea posible
   * - Esperar a que la página esté completamente cargada
   * - Validar que la navegación fue exitosa cuando sea crítico
   */
  async goto(shipperInstallationCode: string, userId: string) {
    const baseUrl = process.env.SHIPPER_BASE_URL || '';
    const url = `${baseUrl}/.../...?userId=${userId}`;
    
    await this.page.goto(url);
    // Esperar a que el elemento esperado esté presente
    await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  // ========================================================================
  // MÉTODOS DE INTERACCIÓN - ACCIONES SIMPLES
  // ========================================================================

  /**
   * Método simple para rellenar un input
   * 
   * RECOMENDACIÓN: Crear métodos pequeños y específicos
   * que hagan una sola cosa (Single Responsibility)
   */
  async fillAccountNumber(accountNumber: string) {
    await this.accountNumberInput.fill(accountNumber);
  }

  async fillEmail(email: string) {
    await this.emailField.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async fillSearch(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    // Esperar a que los resultados se carguen
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Método para clicks
   */
  async clickSubmit() {
    await this.submitButton.click();
  }

  async clickDownload() {
    await this.downloadLink.click();
  }

  /**
   * Métodos para interactuar con selects/dropdowns
   */
  async selectDeliveryType(value: string) {
    await this.selectOptions.selectOption(value);
  }

  /**
   * Métodos para checkboxes
   */
  async checkTermsCheckbox() {
    // Verificar que no está ya marcado para evitar errores
    const isChecked = await this.confirmationCheckbox.isChecked();
    if (!isChecked) {
      await this.confirmationCheckbox.check();
    }
  }

  async unchecksTermsCheckbox() {
    const isChecked = await this.confirmationCheckbox.isChecked();
    if (isChecked) {
      await this.confirmationCheckbox.uncheck();
    }
  }

  // ========================================================================
  // MÉTODOS DE VALIDACIÓN - VERIFICAR ESTADO DE LA PÁGINA
  // ========================================================================

  /**
   * Validar si un mensaje de éxito es visible
   * 
   * RECOMENDACIÓN: Crear métodos que retornen booleanos para validaciones
   * Usar try/catch o .then().catch() para manejar timeouts
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validar si hay errores en la página
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      const text = await this.errorNotification.textContent();
      return text;
    } catch {
      return null;
    }
  }

  /**
   * Método para verificar visibilidad de un elemento
   */
  async isModalVisible(): Promise<boolean> {
    try {
      await this.modalDialog.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // ========================================================================
  // MÉTODOS COMPLEJOS - FLUJOS DE USUARIO
  // ========================================================================

  /**
   * Flujo completo de login
   * 
   * PATRÓN: Métodos complejos que combinan varias acciones simples
   * 
   * BUENAS PRÁCTICAS:
   * - Documentar el propósito del método
   * - Incluir esperas apropiadas
   * - Manejar casos de error cuando sea necesario
   * - Hacer métodos reutilizables
   */
  async performLogin(accountNumber: string, email: string, password: string) {
    // Rellenar credenciales
    await this.fillAccountNumber(accountNumber);
    await this.fillEmail(email);
    await this.fillPassword(password);
    
    // Usar secureFill para contraseñas sensibles (importar desde utils)
    // await secureFill(this.passwordInput, password);
    
    // Hacer click en submit
    await this.clickSubmit();

    // Esperar a que la navegación sea exitosa
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });

    // Validar que accedimos correctamente
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  /**
   * Flujo de búsqueda con validación
   */
  async searchAndValidate(searchTerm: string): Promise<boolean> {
    await this.fillSearch(searchTerm);
    
    // Esperar a que los resultados aparezcan
    await this.page.waitForLoadState('networkidle');
    
    // Validar que hay resultados
    const resultsCount = await this.page.locator('.result-item').count();
    return resultsCount > 0;
  }

  /**
   * Aceptar términos y condiciones
   */
  async acceptTermsAndSubmit() {
    await this.checkTermsCheckbox();
    await this.clickSubmit();
    
    // Esperar confirmación
    const isSuccess = await this.isSuccessMessageVisible();
    if (!isSuccess) {
      throw new Error('No se pudo completar la operación: falta confirmación de éxito');
    }
  }

  // ========================================================================
  // MÉTODOS UTILITARIOS - FUNCIONES AUXILIARES
  // ========================================================================

  /**
   * Esperar a que un elemento desaparezca (útil para modales, loaders)
   */
  async waitForLoaderToDisappear() {
    const loader = this.page.locator('.loader, .spinner, [role="progressbar"]');
    try {
      await loader.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      console.warn('Loader no encontrado o no desapareció en el tiempo esperado');
    }
  }

  /**
   * Cerrar un modal si está abierto
   */
  async closeModalIfOpen() {
    const isOpen = await this.isModalVisible();
    if (isOpen) {
      const closeButton = this.page.getByRole('button', { name: 'Cerrar' });
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  }

  /**
   * Tomar screenshot para debugging
   */
  async takeDebugScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ path: `./test-results/debug-${name}-${timestamp}.png` });
  }
}

// ============================================================================
// EJEMPLO DE USO EN UN TEST
// ============================================================================

/**
 * Ejemplo de cómo usar esta página de referencia en un test:
 * 
 * ```typescript
 * import { test } from '@playwright/test';
 * import { ReferencePageSHIPPER } from './ReferencePageTemplate-SHIPPER';
 * 
 * test('Example: Login Flow', async ({ page }) => {
 *   const shipperPage = new ReferencePageSHIPPER(page);
 *   
 *   // Navegar a la página
 *   await shipperPage.goto(installationCode, userId);
 *   
 *   // Realizar login
 *   await shipperPage.performLogin(accountNumber, email, password);
 *   
 *   // Validar éxito
 *   const isSuccess = await shipperPage.isSuccessMessageVisible();
 *   expect(isSuccess).toBe(true);
 * });
 * ```
 */
