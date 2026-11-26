import { Page, expect } from '@playwright/test';
import { PanelMachLoginPage } from '../pages/Commerce/PanelMachLoginPage-Commerce';
import { PanelMachTransaccionesPage } from '../pages/Commerce/PanelMachTransaccionesPage-Commerce';

/**
 * Abre el Historial de transacciones del Panel Mach staging en modo Pruebas.
 * Si la sesión guardada no tiene token (o venció), hace login con las credenciales del .env.
 * El login del panel no tiene doble factor ni Cloudflare, así que se puede automatizar siempre.
 */
export async function abrirPanelMachEnPruebas(page: Page): Promise<PanelMachTransaccionesPage> {
  const transacciones = new PanelMachTransaccionesPage(page);
  await page.goto(process.env.COMMERCE_PANEL_MACH_TRANSACCIONES_URL || '');
  // Sin sesión, la SPA redirige a /auth/sign-in.
  await page.waitForURL(/\/(payments|auth\/sign-in)/);
  const login = new PanelMachLoginPage(page);
  const necesitaLogin = await Promise.race([
    login.emailInput.waitFor({ state: 'visible', timeout: 15_000 }).then(() => true),
    transacciones.pageTitle.waitFor({ state: 'visible', timeout: 15_000 }).then(() => false),
  ]);
  if (necesitaLogin) {
    await login.login(process.env.COMMERCE_PANEL_MACH_USERNAME || '', process.env.COMMERCE_PANEL_MACH_PASSWORD || '');
    // Si Cognito falla (p. ej. "PreTokenGeneration failed"), el panel muestra el snackbar de error.
    const resultado = await Promise.race([
      page.waitForURL((u) => !u.pathname.startsWith('/auth/'), { timeout: 30_000 }).then(() => 'ok'),
      login.errorSnackbar.waitFor({ state: 'visible', timeout: 30_000 }).then(() => 'error'),
    ]);
    if (resultado === 'error') {
      throw new Error(`Login del Panel Mach rechazado por el backend de Mach: ${await login.errorSnackbar.innerText()}`);
    }
    await page.goto(process.env.COMMERCE_PANEL_MACH_TRANSACCIONES_URL || '');
  }
  await transacciones.pageTitle.waitFor({ state: 'visible' });
  await transacciones.asegurarModoPruebas();
  return transacciones;
}
