

//BEWARE: This can hide passwords in HTML report (good!),
//but if you "download" a trace file attached to it, unzip it and search the folder for your password
//you will find it.


import { test, Locator } from '@playwright/test';

/**
 * Llena un campo de forma segura.
 * En los reportes aparecerá como "Fill ******"
 * En los logs técnicos (Trace Viewer) aparecerá el texto en Base64 (ej: "c2VjcmV0bw==")
 */

export async function secureFill(locator: Locator, secretValue: string) {
  // 1. El título del paso será explícitamente "******"
  await test.step(`Fill ******`, async () => {
    
    // 2. Codificamos el secreto a Base64 para que no viaje en texto plano en los logs
    const b64 = Buffer.from(secretValue).toString('base64');

    // 3. Usamos evaluate para inyectarlo directo al DOM
    await locator.evaluate((node, encodedSecret) => {
      const input = node as HTMLInputElement;
      
      // 4. Decodificamos DENTRO del navegador (atob es nativo de JS en browser)
      input.value = atob(encodedSecret);
      
      // 5. Disparamos eventos para que la app detecte el cambio (React/Angular/Vue)
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true })); // A veces necesario para validaciones
      
    }, b64); // Pasamos el valor codificado
  });
}