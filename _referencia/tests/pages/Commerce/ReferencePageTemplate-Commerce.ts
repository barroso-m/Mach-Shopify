/**
 * ============================================================================
 * COMMERCE PAGE REFERENCE TEMPLATE
 * ============================================================================
 * 
 * Esta es una página de referencia que demuestra las buenas prácticas y
 * patrones recomendados para crear páginas de prueba en Commerce.
 * 
 * Úsala como templado base cuando crees nuevas páginas para Commerce.
 * ============================================================================
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * Ejemplo: ReferencePage
 * Propósito: Demostrar la estructura y buenas prácticas para páginas Commerce
 * 
 * BUENAS PRÁCTICAS:
 * - Usar nombres descriptivos que representen claramente qué elemento es
 * - Definir todos los localizadores en el constructor
 * - Usar métodos pequeños y reutilizables (Single Responsibility Principle)
 * - Agregar esperas explícitas cuando sea necesario
 * - Usar comentarios para explicar lógica compleja
 * - Mantener la coherencia con otros localizadores de la app
 */
export class ReferencePageCommerce {
  readonly page: Page;

  // ========================================================================
  // LOCALIZADORES - ESTRUCTURA RECOMENDADA
  // ========================================================================
  
  /**
   * ESTRATEGIA 1: getByRole() - RECOMENDADO CUANDO SEA POSIBLE
   * Ventajas: Accesibilidad, semántica, durabilidad
   * Uso: Botones, enlaces, encabezados, inputs
   */
  readonly loginButton: Locator;
  readonly logoutButton: Locator;
  readonly signUpLink: Locator;
  readonly pageTitle: Locator;

  /**
   * ESTRATEGIA 2: locator() por CSS selector
   * Uso: Cuando getByRole() no es disponible
   * Nota: Preferir selectores simples y estables
   */
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly storeNameInput: Locator;

  /**
   * ESTRATEGIA 3: getByText() - para elementos con texto conocido
   * Uso: Cuando el texto es único y estable
   */
  readonly welcomeMessage: Locator;
  readonly validationError: Locator;
  readonly confirmationMessage: Locator;

  /**
   * ESTRATEGIA 4: getByPlaceholder() - para inputs con placeholder
   * Uso: Búsquedas, filtros, inputs de búsqueda
   */
  readonly searchBox: Locator;
  readonly filterInput: Locator;

  /**
   * ESTRATEGIA 5: Combinaciones y selectores complejos
   * Uso: Elementos anidados, dentro de contenedores específicos
   */
  readonly navigationMenu: Locator;
  readonly ordersTable: Locator;
  readonly paginationButtons: Locator;

  // Contenedores y elementos comunes
  readonly mainContent: Locator;
  readonly loadingSpinner: Locator;
  readonly notificationAlert: Locator;

  /**
   * Constructor: Inicializa todos los localizadores
   * 
   * RECOMENDACIÓN: Definir todos los localizadores aquí en el constructor
   * para que sean fáciles de encontrar y mantener en un solo lugar.
   */
  constructor(page: Page) {
    this.page = page;

    // Ejemplo 1: Usando getByRole (PREFERIDO)
    this.loginButton = page.getByRole('button', { name: 'Ingresar a mi tienda' });
    this.logoutButton = page.getByRole('button', { name: 'Cerrar sesión' });
    this.signUpLink = page.getByRole('link', { name: 'Crear tienda' });
    this.pageTitle = page.getByRole('heading', { name: 'Ingresá a tu cuenta' });

    // Ejemplo 2: Usando locator() con CSS
    this.usernameInput = page.locator('#user-mail');
    this.passwordInput = page.locator('#pass');
    this.storeNameInput = page.locator('input[name="store_name"]');

    // Ejemplo 3: Usando getByText()
    this.welcomeMessage = page.getByText('Bienvenido a tu tienda');
    this.validationError = page.getByText(/Error de validación|Campo requerido/);
    this.confirmationMessage = page.getByText('Cambios guardados exitosamente');

    // Ejemplo 4: Usando getByPlaceholder()
    this.searchBox = page.getByPlaceholder('Buscar productos...');
    this.filterInput = page.getByPlaceholder('Filtrar por...');

    // Ejemplo 5: Selectores más específicos y complejos
    this.navigationMenu = page.locator('nav[aria-label="Principal"]');
    this.ordersTable = page.locator('table[data-testid="orders-table"]');
    this.paginationButtons = page.locator('nav[aria-label="Paginación"] button');

    // Contenedores comunes
    this.mainContent = page.locator('main');
    this.loadingSpinner = page.locator('[role="progressbar"], .spinner, .loader');
    this.notificationAlert = page.locator('[role="alert"]');
  }

  // ========================================================================
  // MÉTODOS DE NAVEGACIÓN
  // ========================================================================

  /**
   * Navega a la página de login de Commerce
   * 
   * BUENAS PRÁCTICAS:
   * - Usar URLs desde variables de entorno cuando sea posible
   * - Esperar a que la página esté completamente cargada
   * - Validar que la navegación fue exitosa cuando sea crítico
   */
  async goto() {
    const loginUrl = process.env.COMMERCE_LOGIN_URL || '';
    await this.page.goto(loginUrl);
    // Esperar a que el elemento esperado esté presente
    await this.pageTitle.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Navega al dashboard
   */
  async goToDashboard() {
    const dashboardUrl = process.env.COMMERCE_DASHBOARD_URL || '';
    await this.page.goto(dashboardUrl);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navega a órdenes
   */
  async goToOrders() {
    const ordersUrl = process.env.COMMERCE_ORDERS_URL || '';
    await this.page.goto(ordersUrl);
    await this.waitForLoadingToComplete();
  }

  // ========================================================================
  // MÉTODOS DE INTERACCIÓN - ACCIONES SIMPLES
  // ========================================================================

  /**
   * Método simple para rellenar el usuario
   * 
   * RECOMENDACIÓN: Crear métodos pequeños y específicos
   * que hagan una sola cosa (Single Responsibility)
   */
  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  /**
   * Método para rellenar contraseña
   * 
   * NOTA: Usar secureFill del utils para contraseñas sensibles
   */
  async fillPassword(password: string) {
    // Opción 1: Usar el método simple (no recomendado para datos sensibles)
    // await this.passwordInput.fill(password);
    
    // Opción 2: Usar secureFill desde utils para mayor seguridad
    // await secureFill(this.passwordInput, password);
    
    // Por ahora usamos fill simple, pero considera importar secureFill
    await this.passwordInput.fill(password);
  }

  async fillStoreName(storeName: string) {
    await this.storeNameInput.fill(storeName);
    // Pequeña espera para que el campo procese el input
    await this.page.waitForTimeout(500);
  }

  /**
   * Método para búsquedas
   */
  async fillSearch(searchTerm: string) {
    await this.searchBox.fill(searchTerm);
    // Esperar a que los resultados se carguen
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Métodos para clicks en botones
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async clickSignUp() {
    await this.signUpLink.click();
  }

  /**
   * Click en elementos de paginación
   */
  async goToNextPage() {
    const nextButton = this.paginationButtons.filter({ hasText: 'Siguiente' });
    await nextButton.click();
    await this.waitForLoadingToComplete();
  }

  async goToPreviousPage() {
    const prevButton = this.paginationButtons.filter({ hasText: 'Anterior' });
    await prevButton.click();
    await this.waitForLoadingToComplete();
  }

  // ========================================================================
  // MÉTODOS DE VALIDACIÓN - VERIFICAR ESTADO DE LA PÁGINA
  // ========================================================================

  /**
   * Validar si el mensaje de bienvenida es visible
   * 
   * RECOMENDACIÓN: Crear métodos que retornen booleanos para validaciones
   * Usar try/catch para manejar timeouts gracefully
   */
  async isWelcomeMessageVisible(): Promise<boolean> {
    try {
      await this.welcomeMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtener mensaje de error si existe
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      const errorText = await this.validationError.textContent({ timeout: 3000 });
      return errorText?.trim() || null;
    } catch {
      return null;
    }
  }

  /**
   * Validar si un elemento está presente en la página
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Contar elementos (ej: filas en una tabla, órdenes)
   */
  async countTableRows(): Promise<number> {
    await this.waitForLoadingToComplete();
    return await this.ordersTable.locator('tbody tr').count();
  }

  /**
   * Validar que el usuario está logueado (verificar presencia de logout button)
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      await this.logoutButton.waitFor({ state: 'visible', timeout: 3000 });
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
  async performLogin(username: string, password: string) {
    // Rellenar credenciales
    await this.fillUsername(username);
    await this.fillPassword(password);
    
    // Hacer click en login
    await this.clickLogin();

    // Esperar a que la navegación sea exitosa
    await this.page.waitForURL('**/admin', { timeout: 10000 });

    // Validar que accedimos correctamente
    const isLoggedIn = await this.isUserLoggedIn();
    if (!isLoggedIn) {
      throw new Error('Login failed: logoutButton not found after navigation');
    }
  }

  /**
   * Flujo de búsqueda y validación
   */
  async searchAndValidateResults(searchTerm: string): Promise<boolean> {
    await this.fillSearch(searchTerm);
    
    // Esperar a que los resultados se carguen
    await this.waitForLoadingToComplete();
    
    // Validar que hay resultados
    const resultsCount = await this.page.locator('tr').count();
    return resultsCount > 1; // Más que el header
  }

  /**
   * Flujo de crear una orden (ejemplo más complejo)
   */
  async createOrder(customerData: {
    name: string;
    email: string;
    address: string;
  }) {
    // 1. Navegar a crear orden
    const createButton = this.page.getByRole('button', { name: 'Nueva orden' });
    await createButton.click();

    // 2. Rellenar datos
    await this.page.locator('input[name="customer-name"]').fill(customerData.name);
    await this.page.locator('input[name="customer-email"]').fill(customerData.email);
    await this.page.locator('input[name="customer-address"]').fill(customerData.address);

    // 3. Enviar
    const submitButton = this.page.getByRole('button', { name: 'Crear' });
    await submitButton.click();

    // 4. Validar éxito
    const isSuccess = await this.isElementVisible(this.confirmationMessage);
    if (!isSuccess) {
      throw new Error('Failed to create order');
    }
  }

  /**
   * Flujo: Aplicar filtro en la tabla
   */
  async applyTableFilter(filterValue: string) {
    await this.filterInput.fill(filterValue);
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingToComplete();
  }

  /**
   * Flujo: Logoutear usuario
   */
  async logout() {
    await this.clickLogout();
    // Esperar a que se redirija a la página de login
    await this.page.waitForURL('**/login', { timeout: 5000 });
  }

  // ========================================================================
  // MÉTODOS UTILITARIOS - FUNCIONES AUXILIARES
  // ========================================================================

  /**
   * Esperar a que el loading spinner desaparezca
   * Muy útil para operaciones async en Commerce
   */
  async waitForLoadingToComplete() {
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      console.warn('Loading spinner not found or did not complete in time');
    }
  }

  /**
   * Esperar a que aparezca una notificación y obtener su texto
   */
  async getNotificationMessage(): Promise<string | null> {
    try {
      const text = await this.notificationAlert.textContent({ timeout: 5000 });
      return text?.trim() || null;
    } catch {
      return null;
    }
  }

  /**
   * Cerrar notificación si está abierta
   */
  async closeNotification() {
    const closeButton = this.notificationAlert.locator('button[aria-label="Cerrar"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }

  /**
   * Scroll a un elemento específico
   */
  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Tomar screenshot para debugging con timestamp
   */
  async takeDebugScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ path: `./test-results/debug-${name}-${timestamp}.png` });
  }

  /**
   * Obtener el texto completo de la página para debugging
   */
  async getPageContent(): Promise<string> {
    return await this.page.content();
  }

  /**
   * Recargar la página
   */
  async reload() {
    await this.page.reload();
    await this.waitForLoadingToComplete();
  }
}

// ============================================================================
// EJEMPLO DE USO EN UN TEST
// ============================================================================

/**
 * Ejemplo de cómo usar esta página de referencia en un test:
 * 
 * ```typescript
 * import { test, expect } from '@playwright/test';
 * import { ReferencePageCommerce } from './ReferencePageTemplate-Commerce';
 * 
 * test('Example: Login Flow', async ({ page }) => {
 *   const CommercePage = new ReferencePageCommerce(page);
 *   
 *   // Navegar a login
 *   await CommercePage.goto();
 *   
 *   // Realizar login
 *   const username = process.env.TEST_USERNAME!;
 *   const password = process.env.TEST_PASSWORD!;
 *   await CommercePage.performLogin(username, password);
 *   
 *   // Validar que estamos en el dashboard
 *   const isLoggedIn = await CommercePage.isUserLoggedIn();
 *   expect(isLoggedIn).toBe(true);
 * });
 * 
 * test('Example: Search and Filter', async ({ page }) => {
 *   const CommercePage = new ReferencePageCommerce(page);
 *   
 *   // Ir a órdenes
 *   await CommercePage.goToOrders();
 *   
 *   // Buscar un orden
 *   const found = await CommercePage.searchAndValidateResults('ORD-12345');
 *   expect(found).toBe(true);
 *   
 *   // Aplicar filtro
 *   await CommercePage.applyTableFilter('pendiente');
 *   
 *   // Obtener notificación
 *   const message = await CommercePage.getNotificationMessage();
 *   console.log('Notification:', message);
 * });
 * ```
 */

// ============================================================================
// RESUMEN DE BUENAS PRÁCTICAS
// ============================================================================

/**
 * 1. ESTRUCTURA:
 *    ✓ Todos los localizadores en constructor
 *    ✓ Métodos organizados en secciones lógicas (Navegación, Interacción, Validación, etc.)
 *    ✓ Nombres descriptivos
 *
 * 2. LOCALIZADORES:
 *    ✓ Preferir getByRole() cuando sea posible (accesibilidad)
 *    ✓ Usar locator() para CSS selectores simples
 *    ✓ Evitar selectores complejos/frágiles
 *
 * 3. MÉTODOS:
 *    ✓ Una responsabilidad por método
 *    ✓ Nombres que describan claramente qué hacen
 *    ✓ Incluir esperas explícitas cuando sea necesario
 *    ✓ Manejar errores gracefully en validaciones
 *
 * 4. DOCUMENTACIÓN:
 *    ✓ Comentarios JSDoc para métodos complejos
 *    ✓ Describir el propósito y recomendaciones
 *    ✓ Incluir ejemplos de uso
 *
 * 5. SEGURIDAD:
 *    ✓ Usar variables de entorno para URLs y datos sensibles
 *    ✓ Usar secureFill() para contraseñas
 *    ✓ No hardcodear credenciales
 */
