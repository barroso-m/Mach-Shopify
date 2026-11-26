# Automation Web - Template

Un template completo y estructurado para proyectos de automatización con **Playwright** (E2E y API testing). Utiliza este repositorio como base para clonar en nuevos proyectos y comenzar con la estructura y dependencias listas para instalar.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Primeros Pasos](#primeros-pasos)
- [Cómo Ejecutar los Tests](#cómo-ejecutar-los-tests)
- [Guías de Referencia](#guías-de-referencia)
- [Requisitos](#requisitos)

---

## 📌 Descripción General

Este template está diseñado para:
- ✅ Automatización de pruebas **E2E** (End-to-End) con Playwright
- ✅ Pruebas de **API** con manejo de solicitudes HTTP
- ✅ Generación de datos dinámicos con **Faker**
- ✅ Gestión segura de credenciales con variables de entorno (`.env`)
- ✅ Integración con herramientas de reporte (HTML y JUnit)
- ✅ Flujo de trabajo Git estructurado

---

## 📁 Estructura del Proyecto

```
Automation.Web.Template/
│
├── 📄 README.md                          # Este archivo
├── 📄 package.json                       # Configuración de dependencias y scripts
├── 📄 playwright.config.ts               # Configuración de Playwright
├── 📄 .env                               # Variables de entorno (no versionado)
├── 📄 .gitignore                         # Archivos a ignorar en Git
│
├── 📂 contextfiles/                      # Documentación y guías
│   └── Best-Practices.md                 # Estándares, convenciones y mejores prácticas
│
├── 📂 tests/                             # Raíz de los tests
│   ├── 📂 specs/                         # Archivos de especificación (.spec.ts)
│   │   ├── API/                          # Tests de API (API_*.spec.ts)
│   │   └── E2E/                          # Tests E2E (E2E_*.spec.ts)
│   │
│   ├── 📂 pages/                         # Page Objects (patrón recomendado)
│   │   ├── Commerce/                     # Page Objects para Commerce
│   │   │   ├── ReferencePageTemplate-Commerce.ts
│   │   │   └── *Page-Commerce.ts
│   │   └── Shipper/                      # Page Objects para Shipper
│   │       ├── ReferencePageTemplate-Shipper.ts
│   │       └── *Page-Shipper.ts
│   │
│   └── 📂 data/                          # Datos de prueba y referencias
│       ├── dataModelsReference.md        # Guía para generar datos dinámicos
│       └── fakerExamplePage.ts           # Ejemplo de uso de Faker
│
├── 📂 utils/                             # Utilidades compartidas
│   ├── secureFill.ts                     # Función para rellenar campos sensibles
│   └── zephyr-bulk-upload.js             # Integración con Zephyr (reportes)
│
├── 📂 playwright-report/                 # Reportes HTML generados
│
└── 📂 test-results/                      # Resultados de tests (XML, logs)
```

### 📝 Descripción de Carpetas Clave

| Carpeta | Propósito |
|---------|-----------|
| **contextfiles/** | Documentación interna con guías de estilo, convenciones y mejores prácticas |
| **tests/specs/** | Archivos de tests (.spec.ts) organizados por tipo: API, E2E |
| **tests/pages/** | Implementación del patrón Page Object para organizar y reutilizar selectores |
| **tests/data/** | Datos de prueba estáticos, ejemplos de Faker e interfaces de datos |
| **utils/** | Funciones reutilizables como `secureFill` para rellenar campos sin exponer datos |
| **playwright-report/** | Reportes HTML auto-generados después de ejecutar tests |

---

## 🛠️ Instalación y Configuración

### Requisitos
- **Node.js** >= 16.x
- **npm** >= 8.x

### Paso 1: Clonar el Template

```bash
git clone https://github.com/conexa-projects/Automation.Web.Template ./mi-proyecto
cd mi-proyecto
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instala:
- **@playwright/test**: Framework de pruebas automatizadas
- **@faker-js/faker**: Generador de datos realistas
- **dotenv**: Carga de variables de entorno
- **axios**: Cliente HTTP para APIs
- **jsonwebtoken**: Manejo de JWT
- **xml2js**: Procesamiento de XML
- **playwright-zephyr**: Integración con reportes

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copiar del archivo de ejemplo (si existe)
cp .env.example .env
```

Luego edita `.env` con tus valores:

```env
# URLs
COMMERCE_URL=https://tu-dominio-commerce.com
SHIPPER_URL=https://tu-dominio-shipper.com
ORDERS_API_URL=https://api.ejemplo.com/orders

# Credenciales (NUNCA hardcodear en código)
COMMERCE_VALID_USERNAME=usuario@ejemplo.com
COMMERCE_VALID_PASSWORD=tu_contraseña_segura
OCA_PASSWORD=contraseña_oca
X_ACCESS_TOKEN=tu_token_aqui
USER_ID=12345
X_USER_ID=67890

```

**⚠️ IMPORTANTE:** Nunca commits `.env` a Git. Se encuentra en `.gitignore` para proteger datos sensibles.

### Paso 4: Instalar Navegadores (Primera vez)

```bash
npx playwright install
```

---

## 🚀 Primeros Pasos

### 1. Familiarízate con las Mejores Prácticas

Lee la guía completa de estándares:

📖 [**contextfiles/Best-Practices.md**](contextfiles/Best-Practices.md)

Cubre:
- Nomenclatura de archivos (API_xx_, E2E_xx_)
- Estructura de casos de prueba
- Seguridad y gestión de credenciales
- Flujo de trabajo Git

### 2. Entiende la Generación de Datos

Consulta la guía para generar datos dinámicos:

📖 [**tests/data/dataModelsReference.md**](tests/data/dataModelsReference.md)

Incluye:
- Uso de Faker para datos realistas
- Carga de datos desde CSV y JSON
- Ejemplos prácticos

### 3. Revisa los Templates de Referencia

- 📄 [**tests/pages/Commerce/ReferencePageTemplate-Commerce.ts**](tests/pages/Commerce/ReferencePageTemplate-Commerce.ts) - Patrón Page Object para Commerce
- 📄 [**tests/pages/Shipper/ReferencePageTemplate-Shipper.ts**](tests/pages/Shipper/ReferencePageTemplate-Shipper.ts) - Patrón Page Object para Shipper
- 📄 [**tests/data/fakerExamplePage.ts**](tests/data/fakerExamplePage.ts) - Ejemplo de uso de Faker

---

## 🧪 Cómo Ejecutar los Tests

### Scripts Disponibles

```bash
# Ejecutar todos los tests (headless)
npm test

# Ejecutar tests en modo debug (con pausa)
npm run test:debug

# Ejecutar tests en modo headed (ver navegadores)
npm run test:headed

# Ejecutar tests en UI interactiva
npm run test:ui

# Ejecutar solo en Chrome
npm run test:chrome
npm run test:ui:chrome

# Ejecutar un archivo específico (ej: Login)
npm run test:login
```

### Ejecutar Tests Específicos

```bash
# Por archivo
npx playwright test tests/specs/E2E/E2E_Login.spec.ts

# Por tag
npx playwright test --grep @smoke

# Por proyecto
npx playwright test --project=chromium

# Con múltiples opciones
npx playwright test --headed --project=firefox --grep @regression
```

---

## 📊 Reportes

Después de ejecutar los tests, se generan automáticamente:

### HTML Report
```bash
npx playwright show-report
```

Abre un navegador con un reporte interactivo completo.

### Archivos de Resultados
- `playwright-report/index.html` - Reporte visual
- `test-results/` - Logs detallados de cada ejecución
- `results.xml` - Reporte JUnit para integración CI/CD

---

## 📚 Guías de Referencia

### Para Desarrolladores

| Tema | Archivo |
|------|---------|
| **Estándares y Convenciones** | [Best-Practices.md](contextfiles/Best-Practices.md) |
| **Generación de Datos** | [tests/data/dataModelsReference.md](tests/data/dataModelsReference.md) |
| **Ejemplo Faker** | [tests/data/fakerExamplePage.ts](tests/data/fakerExamplePage.ts) |
| **Template Page Object** | [tests/pages/Commerce/ReferencePageTemplate-Commerce.ts](tests/pages/Commerce/ReferencePageTemplate-Commerce.ts) |

### Para Convenciones

**Nomenclatura de Archivos:**
- Tests de API: `API_xx_{descripcion}.spec.ts` (ej: `API_01_Consultar_ventas.spec.ts`)
- Tests E2E: `E2E_xx_{descripcion}.spec.ts` (ej: `E2E_05_Login.spec.ts`)
- Page Objects: `{NombrePagina}Page-{Cliente}.ts` (ej: `LoginPage-Commerce.ts`)

**Estructura de Tests:**
- Dividir casos de prueba en múltiples `test()` bloques lógicos
- Un `test.describe()` por flujo o funcionalidad
- Usar `await test.step()` para pasos documentados

**Seguridad:**
- ✅ Usar `process.env` para datos sensibles
- ❌ Nunca hardcodear credenciales
- Usar función `secureFill()` de utils para campos de contraseña

---

## 🔄 Flujo de Trabajo Git

1. **Crear rama**: `git checkout -b feature/nombre-del-ticket` desde `main`
2. **Desarrollar e iterar**: Crear tests, Page Objects y utilidades
3. **Validar localmente**: Ejecutar `npm test` antes de push
4. **Push a remoto**: `git push origin feature/nombre-del-ticket`
5. **Pull Request**: Crear PR hacia `main` (requiere aprobación)
6. **Merge**: Solo después de validar tests en CI/CD

---

## 📦 Dependencias Principales

```json
{
  "devDependencies": {
    "@playwright/test": "^1.58.0",      // Framework de testing
    "@faker-js/faker": "^10.2.0",       // Generador de datos
    "dotenv": "^16.6.1",                // Variables de entorno
    "playwright-zephyr": "^1.2.0"       // Reporte de tests
  },
  "dependencies": {
    "axios": "^1.13.6",                 // Cliente HTTP
    "jsonwebtoken": "^9.0.3",           // Tokens JWT
    "xml2js": "^0.6.2",                 // Procesamiento XML
    "form-data": "^4.0.5"               // Manejo de multipart
  }
}
```

---

## 🎯 Próximos Pasos Recomendados

1. ✅ Instala todas las dependencias (`npm install`)
2. ✅ Configura `.env` con tus datos
3. ✅ Lee [Best-Practices.md](contextfiles/Best-Practices.md) completamente
4. ✅ Clona un archivo `.spec.ts` existente como base
5. ✅ Crea tu primer Page Object basado en los templates
6. ✅ Ejecuta un test con `npm test`
7. ✅ Revisa el reporte HTML: `npx playwright show-report`

---

## ❓ Preguntas Frecuentes

**P: ¿Dónde guardo credenciales?**  
R: En el archivo `.env` (no versionado). Accede con `process.env.VARIABLE_NAME`

**P: ¿Cómo creo nuevos tests?**  
R: Copia un `.spec.ts` existente y ajusta la nomenclatura. Usa los File Templates como referencia.

**P: ¿Cómo genero datos aleatorios?**  
R: Usa Faker. Revisa `tests/data/fakerExamplePage.ts` para ejemplos.

**P: ¿Qué es un Page Object?**  
R: Patrón que encapsula selectores y acciones de una página. Aumenta mantenibilidad y reutilización.

**P: ¿Cómo ejecuto solo un test?**  
R: `npx playwright test tests/specs/E2E/E2E_Login.spec.ts`

---

## 📞 Soporte

Para dudas sobre:
- **Convenciones**: Revisa [Best-Practices.md](contextfiles/Best-Practices.md)
- **Datos de prueba**: Consulta [tests/data/dataModelsReference.md](tests/data/dataModelsReference.md)
- **Playwright**: Oficial: https://playwright.dev/docs/intro

---

**Template versión 1.6.1** | Última actualización: 24 Junio 2026
