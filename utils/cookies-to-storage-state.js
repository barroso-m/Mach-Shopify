/**
 * Convierte cookies exportadas desde Chrome (extensión Cookie-Editor, formato JSON)
 * al formato storageState de Playwright.
 *
 * Uso:
 *   node utils/cookies-to-storage-state.js cookies1.json [cookies2.json ...]
 *
 * Cada archivo es la exportación de un sitio (admin.shopify.com, accounts.shopify.com,
 * mach-stage.myshopify.com, pay-staging.somosmach.com...). Se combinan todos en
 * playwright/.auth/session.json (o en STORAGE_STATE_PATH), que NO se versiona.
 */
const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Uso: node utils/cookies-to-storage-state.js cookies1.json [cookies2.json ...]');
  process.exit(1);
}

const SAME_SITE = { no_restriction: 'None', none: 'None', lax: 'Lax', strict: 'Strict' };
const out = path.resolve(__dirname, '..', process.env.STORAGE_STATE_PATH || 'playwright/.auth/session.json');

// Si ya existe una sesión, se le suman las cookies nuevas (las repetidas se reemplazan).
const state = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : { cookies: [], origins: [] };
const key = c => `${c.name}|${c.domain}|${c.path}`;
const byKey = new Map(state.cookies.map(c => [key(c), c]));

for (const file of files) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const list = Array.isArray(raw) ? raw : raw.cookies || [];
  for (const c of list) {
    const cookie = {
      name: c.name,
      value: c.value,
      domain: c.hostOnly ? c.domain.replace(/^\./, '') : c.domain,
      path: c.path || '/',
      expires: c.session || !c.expirationDate ? -1 : Math.floor(c.expirationDate),
      httpOnly: !!c.httpOnly,
      secure: !!c.secure,
      sameSite: SAME_SITE[String(c.sameSite).toLowerCase()] || 'Lax',
    };
    // Chrome exige secure en las cookies SameSite=None.
    if (cookie.sameSite === 'None') cookie.secure = true;
    byKey.set(key(cookie), cookie);
  }
}

state.cookies = [...byKey.values()];
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(state, null, 2));
const dominios = [...new Set(state.cookies.map(c => c.domain))].sort();
console.log(`Sesión guardada en ${out}: ${state.cookies.length} cookies de ${dominios.join(', ')}`);
