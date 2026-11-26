# Plan de automatizacion — Mach-Shopify

Generado por Nexus QA a partir de los casos aprobados y marcados como
automatizables. Formato consumible por el agente `playwright-test-generator`.

Cada test lleva una anotacion `nexus-qa-caso` con el id de su caso en Nexus QA.
Esta anotacion liga el test con el caso para que Nexus pueda actualizar el codigo mas adelante. No borres ni modifiques esta anotacion.

### 1. Onboarding y desinstalación

#### 1.1 TC-001 — [Onboarding y desinstalación] - [Camino Alterno] - Validar onboarding con llaves vacías, inválidas, cruzadas y válidas

**Precondition:** App Mach stage instalada en la tienda de staging y parado en la pantalla de onboarding ("Ingresa tu API Key de MACH para comercios y conecta tu tienda"); si la tienda ya estaba conectada, se ejecutó antes la desinstalación y reinstalación de la app para volver a esta pantalla.

**Steps:**
1. Dejar vacío el campo "Sandbox API Key", completar el campo "API Key" con una llave válida de modo Productivo y tocar "Conectar tienda" (datos: API Key válida de modo Productivo (provista fuera de la herramienta))
2. Completar ambos campos y cargar en el campo "API Key" una cadena que no corresponda a ninguna llave real, y tocar "Conectar tienda" (datos: Cadena de texto arbitraria que no es una llave real (ej.: "cualquier-cosa"))
3. Cargar en el campo "API Key" la llave real de modo Pruebas y en el campo "Sandbox API Key" la llave real de modo Productivo (invertidas), y tocar "Conectar tienda" (datos: Llave válida de modo Pruebas y llave válida de modo Productivo, invertidas respecto a su campo)
4. Cargar en el campo "API Key" la llave real de modo Productivo y en el campo "Sandbox API Key" la llave real de modo Pruebas, cada una en su campo correspondiente, y tocar "Conectar tienda" (datos: API Key válida de modo Productivo y Sandbox API Key válida de modo Pruebas, cada una en su campo correcto)

**Expected:**
- El formulario no avanza: no aparece mensaje de éxito ni se conecta la tienda
- Aparece el mensaje "La API Key es incorrecta." y el formulario permanece visible
- Aparece el mismo mensaje "La API Key es incorrecta." y el formulario permanece visible
- Aparece el mensaje "¡Hemos conectado tu tienda con MACH exitosamente!" con el botón "Ir a mi tienda"; la tienda queda conectada y Mach puede activarse en Configuración → Pagos

**Tipo:** E2E

#### 1.2 TC-002 — [Onboarding y desinstalación] - [Camino de Error] - Validar que dejar ambos campos vacíos impide conectar la tienda

**Precondition:** App Mach stage instalada y parado en la pantalla de onboarding, con los campos "API Key" y "Sandbox API Key" sin completar.

**Steps:**
1. Sin completar ningún campo, tocar "Conectar tienda"

**Expected:**
- El formulario no avanza: no se muestra el mensaje de conexión exitosa ni el de "La API Key es incorrecta.", y ambos campos quedan señalados como obligatorios

**Tipo:** E2E

#### 1.3 TC-003 — [Onboarding y desinstalación] - [Camino de Error] - Validar error al ingresar una llave válida con espacios adicionales al inicio o al final

**Precondition:** App Mach stage instalada y parado en la pantalla de onboarding, con ambas llaves válidas disponibles.

**Steps:**
1. Completar el campo "API Key" con la llave válida de modo Productivo agregando un espacio en blanco al inicio y al final del valor, completar "Sandbox API Key" con la llave válida de modo Pruebas, y tocar "Conectar tienda" (datos: Llave válida de modo Productivo con espacios adicionales al inicio y al final (ej.: " llave "); llave válida de modo Pruebas sin modificar)

**Expected:**
- Aparece el mensaje "La API Key es incorrecta." y el formulario permanece visible, sin conectar la tienda

**Tipo:** E2E

#### 1.4 TC-004 — [Onboarding y desinstalación] - [Camino Alterno] - Validar que se puede reintentar la conexión después de un error sin perder la posibilidad de completar el onboarding

**Precondition:** App Mach stage instalada y parado en la pantalla de onboarding, con ambas llaves válidas disponibles.

**Steps:**
1. Cargar una llave inventada en el campo "API Key" y una llave válida en "Sandbox API Key", y tocar "Conectar tienda" (datos: Cadena de texto arbitraria que no es una llave real (ej.: "cualquier-cosa"); Sandbox API Key válida de modo Pruebas)
2. Sin recargar la página, corregir el campo "API Key" con la llave válida de modo Productivo y tocar nuevamente "Conectar tienda" (datos: API Key válida de modo Productivo)

**Expected:**
- Aparece el mensaje "La API Key es incorrecta." y el formulario permanece visible
- Aparece el mensaje "¡Hemos conectado tu tienda con MACH exitosamente!" con el botón "Ir a mi tienda" y la tienda queda conectada

**Tipo:** E2E

#### 1.5 TC-005 — [Onboarding y desinstalación] - [Camino Alterno] - Validar que acceder a la pantalla de onboarding con la tienda ya conectada no permite reconectar sin pasar antes por la desinstalación

**Precondition:** Tienda ya conectada a Mach mediante un onboarding previo exitoso.

**Steps:**
1. Intentar volver a abrir la pantalla de onboarding ("Ingresa tu API Key de MACH para comercios y conecta tu tienda") desde la app ya conectada, por ejemplo reabriendo la app desde el Dev Dashboard

**Expected:**
- No se presenta el formulario de carga de llaves en blanco para reconectar; la app lleva directamente a la configuración del medio de pago en Shopify, reflejando que la tienda ya está conectada

**Tipo:** E2E

#### 1.6 TC-001 — [Onboarding y desinstalación] - [Camino Feliz] - Desinstalar y reinstalar la app completando el onboarding correctamente

**Precondition:** La tienda de staging tiene la app Mach instalada y conectada (onboarding completo, medio de pago Mach activo con Modo de prueba encendido).

**Steps:**
1. En el admin de Shopify ir a "Apps", seleccionar la app de Mach y tocar "Desinstalar", confirmando la acción.
2. Desde el Dev Dashboard, volver a instalar la app Mach stage en la tienda y aceptar los permisos con "Install".
3. Sin completar el onboarding, abrir el checkout de la tienda de compras y elegir Mach como medio de pago.
4. Volver a la pantalla de onboarding y cargar los campos "API Key" y "Sandbox API Key", luego tocar "Conectar tienda". (datos: una API Key válida de modo Productivo y una Sandbox API Key válida de modo Pruebas, cada una en su campo (provistas fuera de la herramienta))
5. Tocar "Ir a mi tienda", activar el medio de pago Mach, encender "Modo de prueba" (Test mode) y tocar "Activar".
6. Abrir nuevamente el checkout de la tienda de compras.

**Expected:**
- La app queda desinstalada y el medio de pago Mach deja de estar disponible en la tienda.
- Se redirige a la pantalla de onboarding "Ingresa tu API Key de MACH para comercios y conecta tu tienda", con la tienda todavía sin conectar.
- El pago falla en el checkout de Shopify sin redirigir al checkout hospedado de Mach.
- Aparece el mensaje "¡Hemos conectado tu tienda con MACH exitosamente!" con el botón "Ir a mi tienda".
- El medio de pago Mach queda activo en modo de prueba.
- Mach vuelve a figurar como medio de pago disponible en el checkout.

**Tipo:** E2E

#### 1.7 TC-002 — [Onboarding y desinstalación] - [Camino de Error] - Intentar pagar con Mach mientras la tienda sigue desconectada tras la desinstalación

**Precondition:** La app de Mach fue desinstalada de la tienda y todavía no se reinstaló.

**Steps:**
1. Abrir el checkout de la tienda de compras con un producto en el carrito.
2. Intentar completar la compra con cualquier otro medio de pago disponible.

**Expected:**
- Mach no figura entre los medios de pago disponibles para elegir.
- La compra se procesa con normalidad por el medio alternativo, confirmando que solo Mach quedó inhabilitado y no el checkout completo.

**Tipo:** E2E

#### 1.8 TC-003 — [Onboarding y desinstalación] - [Camino de Error] - Usuario sin permisos de administrador intenta desinstalar la app Mach

**Precondition:** La tienda tiene la app Mach instalada y conectada, y existe un usuario de staff con acceso al admin de Shopify pero sin permiso para administrar aplicaciones.

**Steps:**
1. Iniciar sesión en el admin de Shopify con las credenciales de un usuario de staff sin permiso de gestión de aplicaciones. (datos: credenciales de un usuario de staff sin permiso para administrar apps)
2. Intentar navegar a "Apps" y acceder a la app de Mach para desinstalarla.
3. Abrir el checkout de la tienda de compras y verificar el medio de pago Mach.

**Expected:**
- El sistema no permite acceder a la opción "Desinstalar" (la sección de apps aparece restringida o sin la acción disponible), y la app de Mach permanece instalada y conectada.
- Mach sigue disponible como medio de pago, confirmando que la app no fue desinstalada.

**Tipo:** E2E

### 2. Pagos

#### 2.1 TC-001 — [Pagos] - [Camino Feliz] - Validar pago aprobado completando desde el Panel Mach

**Precondition:** Webhooks existentes en el Panel Mach (modo Pruebas y Productivo, dos modalidades); tienda conectada con el medio de pago Mach activo y Modo de prueba encendido en Shopify; Panel Mach staging abierto en otra pestaña con el switch en Pruebas; sin otras transacciones pendientes en el Historial de transacciones.

**Steps:**
1. En el checkout de Shopify, seleccionar el medio de pago de Mach y tocar el botón "Pay now". (datos: carrito con cualquier producto, moneda CLP)
2. En el Panel Mach (modo Pruebas), abrir "Historial de transacciones" y, si la compra no aparece, tocar "Actualizar".
3. Tocar el botón "Completar pagos pendientes".
4. Volver a la pestaña del checkout de Mach y tocar el botón que ofrece volver al sitio.

**Expected:**
- Shopify redirige a la pestaña del checkout hospedado de Mach (checkout.somosmach.com/payment/…), que queda abierta.
- La compra aparece listada como "Compra desde Shopify" con estado "Pendiente".
- El estado de la transacción pasa a "Confirmado".
- Shopify muestra la Thank you page y la orden queda con estado de pago "Pagado", figurando Mach como método de pago en el detalle de la orden.

**Tipo:** E2E

#### 2.2 TC-002 — [Pagos] - [Camino de Error] - Validar que la orden queda pendiente en Shopify si falta el webhook de pago completado

**Precondition:** Tienda conectada con el medio de pago Mach activo y Modo de prueba encendido; en el Panel Mach modo Pruebas NO existe (o está deshabilitado) el webhook con el evento Pago completado para la URL del conector; sin otras transacciones pendientes.

**Steps:**
1. En el checkout de Shopify, seleccionar el medio de pago de Mach y tocar "Pay now". (datos: carrito con cualquier producto, moneda CLP)
2. En el Panel Mach, Historial de transacciones, confirmar que la compra figura como "Pendiente".
3. Tocar "Completar pagos pendientes".
4. Esperar varios minutos y revisar en el admin de Shopify la orden correspondiente en "Pedidos".

**Expected:**
- Shopify redirige al checkout hospedado de Mach.
- El estado de la transacción pasa a "Confirmado" en el Panel Mach.
- La orden permanece en "Pago pendiente" en Shopify pese a figurar "Confirmado" en el Panel Mach, confirmando que la causa es la ausencia del webhook y no un bug del conector.

**Tipo:** E2E

#### 2.3 TC-003 — [Pagos] - [Camino de Error] - Validar que Completar pagos pendientes aprueba todas las transacciones pendientes a la vez

**Precondition:** Webhooks configurados en el Panel Mach y tienda conectada con Modo de prueba encendido; posibilidad de iniciar al menos dos pagos con Mach en carritos distintos de la misma tienda.

**Steps:**
1. Iniciar un pago con Mach desde un primer carrito y dejar la pestaña del checkout de Mach abierta sin resolver. (datos: carrito con un producto cualquiera, moneda CLP)
2. Iniciar un segundo pago con Mach desde otro carrito distinto, también sin resolver. (datos: carrito con otro producto distinto al anterior, moneda CLP)
3. Tocar "Completar pagos pendientes".
4. Volver a la tienda desde cada una de las pestañas de checkout de Mach.

**Expected:**
- En el Panel Mach, Historial de transacciones, ambas compras figuran como "Pendiente".
- Las dos transacciones pendientes pasan a "Confirmado" al mismo tiempo, no solo la más reciente.
- Ambas órdenes correspondientes quedan como "Pagado" en Shopify, confirmando que el botón afecta a todas las transacciones pendientes y no permite resolver una sola de forma selectiva.

**Tipo:** E2E

#### 2.4 TC-004 — [Pagos] - [Camino Alterno] - Validar que reenviar manualmente el webhook resuelve una orden que quedó pendiente

**Precondition:** Existe una transacción en estado "Confirmado" en el Panel Mach cuya orden asociada permanece en "Pago pendiente" en Shopify por falta de entrega del webhook; el Panel Mach ofrece la opción de reenviar el webhook de esa transacción.

**Steps:**
1. En el Panel Mach, Historial de transacciones, ubicar la transacción "Confirmado" cuya orden sigue pendiente en Shopify.
2. Reenviar manualmente el webhook asociado a esa transacción desde el Panel Mach.
3. Revisar en el admin de Shopify, en "Pedidos", la orden correspondiente.

**Expected:**
- La orden pasa de "Pago pendiente" a "Pagado", confirmando que el reenvío manual del webhook resolvió el pago.

**Tipo:** E2E

#### 2.5 TC-001 — [Pagos] - [Camino de Error] - Validar pago fallado desde el Panel Mach

**Precondition:** Webhooks de Mach existentes en modo Pruebas y Productivo con las dos modalidades suscriptas; tienda conectada (onboarding OK); medio de pago Mach activo con Modo de prueba encendido en Shopify; Panel Mach staging abierto en otra pestaña con el switch en Pruebas; no hay otras transacciones pendientes en el Panel Mach.

**Steps:**
1. En el checkout de Shopify, elegir el medio de pago de Mach y tocar el boton de pago ("Pay now") (datos: carrito con cualquier producto, moneda CLP)
2. En el Panel Mach, ir a "Historial de transacciones" y localizar la compra
3. Tocar el boton "Fallar pagos pendientes"
4. Volver a la pestana del checkout de Mach y seguir a la tienda con el boton de retorno

**Expected:**
- Shopify redirige al checkout hospedado de Mach (checkout.somosmach.com/payment/...). Dejar esa pestana abierta
- La compra aparece como "Compra desde Shopify" en estado "Pendiente" (si no aparece, tocar "Actualizar")
- La transaccion pasa a un estado fallido en el Panel Mach
- El comprador vuelve al checkout de Shopify con el pago rechazado y puede elegir otro medio de pago; no queda ninguna orden pagada en el admin de Shopify

**Tipo:** E2E

#### 2.6 TC-002 — [Pagos] - [Camino Alterno] - Validar que el comprador puede reintentar el pago con otro metodo tras un pago fallido con Mach

**Precondition:** Webhooks de Mach existentes en modo Pruebas y Productivo; tienda conectada; medio de pago Mach activo con Modo de prueba encendido; al menos otro metodo de pago habilitado en el checkout de la tienda; no hay otras transacciones pendientes en el Panel Mach.

**Steps:**
1. Iniciar un pago eligiendo Mach en el checkout de Shopify y tocar el boton de pago (datos: carrito con cualquier producto, moneda CLP)
2. En el Panel Mach, localizar la compra pendiente y tocar "Fallar pagos pendientes"
3. Volver a la tienda desde el checkout de Mach
4. Elegir un metodo de pago distinto a Mach y completar la compra (datos: datos de un metodo de pago alternativo habilitado (ej.: tarjeta de prueba))

**Expected:**
- Shopify redirige al checkout hospedado de Mach
- La transaccion pasa a estado fallido en el Panel Mach
- El comprador cae en el checkout de Shopify con el pago rechazado y la seleccion de metodo de pago disponible nuevamente
- La orden se crea y queda pagada con el metodo alternativo, sin rastro del intento fallido con Mach como pago exitoso

**Tipo:** E2E

#### 2.7 TC-003 — [Pagos] - [Camino de Error] - Validar que "Fallar pagos pendientes" afecta a todas las transacciones pendientes a la vez

**Precondition:** Webhooks de Mach existentes en modo Pruebas y Productivo; tienda conectada; medio de pago Mach activo con Modo de prueba encendido; posibilidad de generar al menos dos pagos pendientes simultaneos en el Panel Mach.

**Steps:**
1. Iniciar un primer pago eligiendo Mach en el checkout de Shopify y dejarlo en el checkout de Mach sin resolver (datos: carrito con cualquier producto, moneda CLP)
2. En otra sesion o pestana, iniciar un segundo pago eligiendo Mach y dejarlo tambien sin resolver (datos: carrito con otro producto, moneda CLP)
3. En el Panel Mach, tocar "Fallar pagos pendientes"
4. Volver a la tienda desde ambas pestanas de checkout de Mach

**Expected:**
- La transaccion queda "Pendiente" en el Panel Mach
- Una segunda transaccion queda "Pendiente" en el Panel Mach, de modo que hay dos pendientes a la vez
- Ambas transacciones pendientes pasan a estado fallido, no solo la que se queria fallar
- Los dos compradores vuelven al checkout de Shopify con el pago rechazado y ninguna de las dos ordenes queda pagada

**Tipo:** E2E

#### 2.8 TC-001 — [Pagos] - [Camino Feliz] - Validar que un pago sin resolver expira en el Panel Mach y la orden queda sin pagar en Shopify

**Precondition:** Webhooks de Pago completado, Pago expirado y Pago fallido existentes en el Panel Mach (modo Pruebas) para las dos modalidades; tienda conectada con onboarding OK; medio de pago Mach activo con "Modo de prueba" encendido en Shopify; Panel Mach staging abierto en otra pestaña con el switch en "Pruebas" y sin otras transacciones pendientes.

**Steps:**
1. En el checkout de Shopify, elegir el medio de pago de Mach y tocar "Pay now" (datos: cualquier producto en el carrito, moneda CLP)
2. Dejar esa pestaña abierta sin interactuar y, en el Panel Mach (modo Pruebas) → "Historial de transacciones", verificar que la compra aparezca como "Compra desde Shopify"
3. No tocar "Completar pagos pendientes" ni "Fallar pagos pendientes". Esperar y refrescar periódicamente el Historial de transacciones hasta que el estado cambie
4. Volver a la pestaña del checkout de Shopify (o reabrir el checkout de la tienda) y revisar el estado del pago y de la orden en el admin de Shopify → "Pedidos"

**Expected:**
- Shopify redirige al checkout hospedado de Mach (checkout.somosmach.com/payment/...)
- La transacción figura en estado "Pendiente"
- La transacción pasa a estado "Expirado"; anotar cuánto tiempo tardó en expirar
- Shopify rechaza el pago: la orden no queda pagada (no figura como "Pagado"); si el comprador vuelve a la tienda, cae en el checkout para intentar de nuevo

**Tipo:** E2E

#### 2.9 TC-002 — [Pagos] - [Camino de Error] - Validar que sin el webhook de Pago expirado configurado la orden queda "Pago pendiente" en Shopify aunque el Panel Mach la muestre "Expirado"

**Precondition:** Tienda conectada con onboarding OK y medio de pago Mach activo con "Modo de prueba" encendido; en el Panel Mach staging (modo Pruebas) el evento "Pago expirado" fue removido o desactivado de la suscripción del webhook, dejando el resto de los eventos intactos; sin otras transacciones pendientes.

**Steps:**
1. En el checkout de Shopify, elegir el medio de pago de Mach y tocar "Pay now" (datos: cualquier producto en el carrito, moneda CLP)
2. No interactuar con el pago ni con los botones del Panel. Esperar hasta que la transacción cambie de estado en el Historial de transacciones
3. Revisar en el admin de Shopify → "Pedidos" el estado de la orden asociada, pasados varios minutos desde la expiración

**Expected:**
- Shopify redirige al checkout hospedado de Mach y la transacción aparece "Pendiente" en el Historial de transacciones del Panel Mach
- La transacción pasa a "Expirado" en el Panel Mach
- La orden sigue mostrando "Pago pendiente" en Shopify pese a que el Panel Mach ya la muestra "Expirado"; esto confirma la falta del webhook y debe resolverse recreándolo antes de reportar como bug del conector

**Tipo:** E2E

#### 2.10 TC-001 — [Pagos] - [Camino Alterno] - Validar que la orden se apruebe cuando el comprador vuelve antes del webhook y luego se completa el pago

**Precondition:** Webhooks existentes en el Panel Mach (modo Pruebas y Productivo, dos modalidades), tienda conectada (onboarding OK), medio de pago Mach activo con Modo de prueba encendido en Shopify, Panel Mach staging abierto en otra pestana con el switch en Pruebas, y ninguna otra transaccion pendiente en el Panel.

**Steps:**
1. En el checkout de Shopify, elegir el medio de pago de Mach y tocar el boton Pay now (datos: un producto cualquiera en el carrito, moneda CLP)
2. En el Panel Mach (modo Pruebas), abrir Historial de transacciones y, si hace falta, tocar Actualizar
3. Sin completar ni fallar nada en el Panel, volver a la tienda desde el checkout de Mach usando el boton de retorno
4. En el Panel Mach, tocar Completar pagos pendientes
5. En el admin de Shopify, ir a Pedidos y abrir la orden generada en el paso 1

**Expected:**
- Shopify redirige al checkout hospedado de Mach (checkout.somosmach.com/payment/...)
- La compra aparece como Compra desde Shopify en estado Pendiente
- El comprador cae en el checkout de Shopify con el pago todavia sin resolver
- El estado de la transaccion pasa a Confirmado
- La orden figura con estado de pago Pagado y metodo Mach, pese a que el comprador habia vuelto a la tienda antes del aviso

**Tipo:** E2E

#### 2.11 TC-002 — [Pagos] - [Camino Alterno] - Validar que la orden quede rechazada cuando el comprador vuelve antes del webhook y luego se falla el pago desde el Panel

**Precondition:** Webhooks existentes en el Panel Mach (modo Pruebas y Productivo, dos modalidades), tienda conectada, medio de pago Mach activo con Modo de prueba encendido en Shopify, Panel Mach staging abierto en modo Pruebas, y ninguna otra transaccion pendiente en el Panel.

**Steps:**
1. En el checkout de Shopify, elegir el medio de pago de Mach y tocar Pay now (datos: un producto cualquiera en el carrito, moneda CLP)
2. En el Panel Mach, verificar que la compra aparece en Historial de transacciones como Compra desde Shopify en estado Pendiente
3. Sin completar ni fallar nada en el Panel, volver a la tienda desde el checkout de Mach
4. En el Panel Mach, tocar Fallar pagos pendientes
5. En el admin de Shopify, ir a Pedidos y revisar la orden generada en el paso 1

**Expected:**
- Shopify redirige al checkout hospedado de Mach
- La transaccion figura como Pendiente
- El comprador cae en el checkout de Shopify con el pago todavia sin resolver
- El estado de la transaccion pasa a un estado fallido
- La orden no queda pagada; el pago figura rechazado y, si el comprador reintenta el checkout, puede elegir otro medio de pago

**Tipo:** E2E

### 3. Reembolsos

#### 3.1 TC-001 — [Reembolsos] - [Camino Feliz] - Validar reembolso total dentro de los 5 minutos se procesa como anulación

**Precondition:** Existe una orden con un pago aprobado (confirmado en el Panel Mach) hace menos de 5 minutos, sin reembolsos previos.

**Steps:**
1. En el admin de Shopify, ir a "Pedidos" y abrir la orden con el pago recién aprobado
2. Tocar el botón "Reembolsar"
3. Ingresar en el campo de monto el total pagado de la orden (datos: monto total pagado en la orden (igual al monto cobrado))
4. Confirmar el reembolso
5. Ir al Panel Mach, con el switch en "Pruebas", a "Historial de transacciones", y ubicar la transacción correspondiente a la orden

**Expected:**
- La orden pasa a mostrar el estado "Reembolsado" en Shopify
- La transacción figura como reversa (anulación) y no como reembolso

**Tipo:** E2E

#### 3.2 TC-002 — [Reembolsos] - [Camino Alterno] - Validar que no se puede reembolsar nuevamente una orden ya reembolsada totalmente dentro de los 5 minutos

**Precondition:** Existe una orden con un reembolso total ya aplicado mediante una anulación (dentro de los 5 minutos de confirmado el pago).

**Steps:**
1. En el admin de Shopify, ir a "Pedidos" y abrir la orden ya reembolsada totalmente
2. Intentar iniciar un nuevo reembolso sobre la orden

**Expected:**
- No hay monto disponible para reembolsar (el campo de monto queda en cero o la opción de reembolso no está disponible), evitando un segundo llamado a Mach

**Tipo:** E2E

#### 3.3 TC-003 — [Reembolsos] - [Camino de Error] - Validar que el monto a reembolsar no puede superar el total pagado

**Precondition:** Existe una orden con un pago aprobado hace menos de 5 minutos, sin reembolsos previos.

**Steps:**
1. En el admin de Shopify, ir a "Pedidos" y abrir la orden con el pago aprobado
2. Tocar el botón "Reembolsar"
3. Ingresar en el campo de monto un valor mayor al total pagado de la orden (datos: un monto superior al total pagado (ej.: total pagado + 1000))
4. Intentar confirmar el reembolso

**Expected:**
- Shopify no permite confirmar el reembolso por ese monto: ajusta el valor al máximo disponible o muestra un mensaje de error, y no se genera ningún reembolso

**Tipo:** E2E

#### 3.4 TC-004 — [Reembolsos] - [Camino de Error] - Validar que un usuario sin permiso sobre pedidos no puede iniciar un reembolso

**Precondition:** Existe una orden con un pago aprobado hace menos de 5 minutos, y existe un usuario de staff de la tienda sin el permiso de administración de pedidos habilitado.

**Steps:**
1. Iniciar sesión en el admin de Shopify con las credenciales del usuario de staff sin permiso de pedidos (datos: credenciales de un usuario de staff sin permiso de administración de pedidos)
2. Intentar acceder a la sección "Pedidos" o abrir la orden pagada

**Expected:**
- El sistema deniega el acceso a la sección de pedidos, u oculta la opción "Reembolsar", impidiendo iniciar cualquier reembolso

**Tipo:** E2E

#### 3.5 TC-001 — [Reembolsos] - [Camino Feliz] - Validar reembolso total después de 5 minutos

**Precondition:** Existe una orden aprobada en Shopify cuyo pago fue confirmado en el Panel Mach (estado Confirmado) hace 5 minutos o más, y no tiene reembolsos previos.

**Steps:**
1. En el admin de Shopify, ir a Pedidos y abrir la orden aprobada
2. Tocar el botón Reembolsar
3. Ingresar como monto a reembolsar el total del pedido y confirmar la operación (datos: monto total del pedido (igual al monto cobrado))
4. Esperar unos segundos y revisar el estado de la orden en Shopify
5. En el Panel Mach (modo Pruebas), abrir el Historial de transacciones y ubicar la transacción de la orden

**Expected:**
- La orden queda en estado Reembolsado
- La transacción muestra el historial de devolución (reembolso, no reversa) por el monto total

**Tipo:** E2E

#### 3.6 TC-002 — [Reembolsos] - [Camino de Error] - Validar reembolso rechazado fuera de los 14 días corridos

**Precondition:** Existe una orden aprobada cuyo pago fue confirmado en el Panel Mach hace más de 14 días corridos y no tiene reembolsos previos.

**Steps:**
1. En el admin de Shopify, ir a Pedidos y abrir la orden con más de 14 días desde la confirmación del pago
2. Tocar Reembolsar, ingresar el monto total y confirmar (datos: monto total del pedido)
3. Revisar en el Panel Mach el estado de la transacción

**Expected:**
- Shopify muestra el reembolso como fallido
- La transacción no muestra un historial de devolución nuevo; el pago permanece sin cambios

**Tipo:** E2E

#### 3.7 TC-003 — [Reembolsos] - [Camino Alterno] - Validar que no se puede reembolsar nuevamente una orden ya reembolsada totalmente

**Precondition:** Existe una orden que ya fue reembolsada en su totalidad mediante un reembolso procesado más de 5 minutos después de la confirmación del pago.

**Steps:**
1. En el admin de Shopify, ir a Pedidos y abrir la orden ya reembolsada en su totalidad
2. Intentar tocar el botón Reembolsar o acceder al formulario de reembolso

**Expected:**
- El botón Reembolsar no está disponible, o el monto máximo disponible para reembolsar muestra cero, impidiendo un nuevo reembolso

**Tipo:** E2E

#### 3.8 TC-001 — [Reembolsos] - [Camino Feliz] - Validar reembolso parcial después de 5 minutos

**Precondition:** Existe una orden aprobada mediante el flujo de pago aprobado, cuyo pago fue confirmado en el Panel Mach hace 5 minutos o más, y que no fue usada en otro caso de reembolso.

**Steps:**
1. En el Panel Mach (modo Pruebas), validar el estado de la transacción asociada a la orden y confirmar que el pago está en estado Confirmado y que transcurrieron 5 minutos o más desde esa confirmación
2. En el admin de Shopify, ir a Pedidos y abrir la orden precondición
3. Tocar Reembolsar y cargar un monto menor al total del pedido, luego confirmar (datos: monto parcial menor al total pagado (ej.: la mitad del total))
4. Esperar unos segundos y revisar el estado de la orden en Shopify
5. Revisar la transacción correspondiente en el Panel Mach

**Expected:**
- La orden pasa a estado "Reembolsado parcialmente" mostrando exactamente el monto parcial cargado
- El Panel Mach muestra un historial de devolución por el monto parcial, no una reversa

**Tipo:** E2E

#### 3.9 TC-002 — [Reembolsos] - [Camino Alterno] - Validar reembolsos parciales sucesivos hasta alcanzar el monto total

**Precondition:** Existe una orden aprobada cuyo pago fue confirmado hace 5 minutos o más, sobre la que todavía no se realizó ningún reembolso.

**Steps:**
1. En el admin de Shopify, abrir la orden precondición y tocar Reembolsar
2. Cargar un primer monto parcial menor al total y confirmar (datos: primer monto parcial (ej.: un tercio del total))
3. Volver a tocar Reembolsar sobre la misma orden y cargar un segundo monto parcial que, sumado al primero, siga siendo menor al total (datos: segundo monto parcial (ej.: otro tercio del total))
4. Revisar el historial de devolución en el Panel Mach
5. Reembolsar el monto restante hasta cubrir el total del pedido (datos: monto restante hasta completar el total)

**Expected:**
- La orden queda "Reembolsado parcialmente" reflejando el primer monto
- La orden sigue en "Reembolsado parcialmente" mostrando la suma de ambos montos
- El Panel Mach lista ambas devoluciones parciales por sus montos respectivos
- La orden pasa de "Reembolsado parcialmente" a "Reembolsado"

**Tipo:** E2E

#### 3.10 TC-003 — [Reembolsos] - [Camino de Error] - Validar reembolso parcial con monto mayor al total del pedido

**Precondition:** Existe una orden aprobada cuyo pago fue confirmado hace 5 minutos o más y que no tiene reembolsos previos.

**Steps:**
1. En el admin de Shopify, abrir la orden precondición y tocar Reembolsar
2. Intentar cargar en el campo de monto un valor mayor al total pagado de la orden (datos: monto superior al total del pedido (ej.: el total más un 20%))
3. Validar en el Panel Mach que no se generó ninguna devolución nueva

**Expected:**
- Shopify bloquea la operación o ajusta el campo, sin permitir confirmar un reembolso por un monto mayor al disponible
- La transacción en el Panel Mach no muestra cambios respecto del estado previo a este caso

**Tipo:** E2E

#### 3.11 TC-004 — [Reembolsos] - [Camino de Error] - Validar reembolso parcial con monto en cero

**Precondition:** Existe una orden aprobada cuyo pago fue confirmado hace 5 minutos o más.

**Steps:**
1. En el admin de Shopify, abrir la orden precondición y tocar Reembolsar
2. Dejar el campo de monto en cero o vacío y tocar el botón de confirmar reembolso (datos: monto igual a cero)
3. Validar en el Panel Mach que no se generó ninguna devolución

**Expected:**
- Shopify no permite confirmar el reembolso y muestra una validación indicando que el monto debe ser mayor a cero
- La transacción en el Panel Mach permanece sin cambios

**Tipo:** E2E

#### 3.12 TC-005 — [Reembolsos] - [Camino de Error] - Validar reembolso parcial sobre un pago que todavía no está CONFIRMED en Mach

**Precondition:** Existe una orden aprobada cuyo pago fue confirmado como COMPLETED hace 5 minutos o más, pero que en el Panel Mach todavía no muestra el estado CONFIRMED.

**Steps:**
1. En el Panel Mach, verificar el estado de la transacción asociada a la orden precondición y confirmar que todavía no figura como CONFIRMED
2. En el admin de Shopify, abrir la orden y tocar Reembolsar con un monto menor al total, luego confirmar (datos: monto parcial menor al total (ej.: la mitad del total))
3. Anotar en el reporte el estado exacto del pago en el Panel Mach y la hora en que se intentó el reembolso

**Expected:**
- Shopify muestra el reembolso como fallido en lugar de "Reembolsado parcialmente"
- Queda documentado el estado del pago (distinto de CONFIRMED) y la hora, para la consulta abierta sobre el paso COMPLETED → CONFIRMED

**Tipo:** E2E

#### 3.13 TC-006 — [Reembolsos] - [Camino de Error] - Validar reembolso parcial fuera de la ventana de 14 días

**Precondition:** Existe una orden aprobada cuyo pago fue confirmado hace más de 14 días corridos y que no tiene reembolsos previos.

**Steps:**
1. En el admin de Shopify, abrir la orden precondición y tocar Reembolsar
2. Cargar un monto menor al total del pedido y confirmar el reembolso (datos: monto parcial menor al total (ej.: la mitad del total))
3. Revisar el Panel Mach para la transacción correspondiente

**Expected:**
- Shopify muestra el reembolso como fallido
- El Panel Mach no muestra ninguna devolución nueva asociada a esta solicitud

**Tipo:** E2E

#### 3.14 TC-001 — [Reembolsos] - [Camino Alterno] - Validar comportamiento de reembolso parcial dentro de los 5 minutos

**Precondition:** Existe una orden aprobada mediante el flujo de pago aprobado, confirmada en el Panel Mach hace menos de 5 minutos.

**Steps:**
1. Ir al admin de Shopify, seccion Pedidos, y abrir la orden aprobada reciente
2. Tocar Reembolsar y cargar un monto menor al total del pedido (datos: monto menor al total pagado (ej.: la mitad del total))
3. Confirmar el reembolso
4. Verificar de inmediato el estado de la orden en Shopify y el estado de la transaccion en el Panel Mach, Historial de transacciones

**Expected:**
- El sistema procesa la solicitud sin error de validacion de formulario
- Si el Panel Mach muestra el pago reversado por el monto total mientras Shopify muestra 'Reembolsado parcialmente', se documenta como hallazgo a reportar por la discrepancia entre lo que ve el comercio y lo que paso con el dinero; si Mach rechaza la operacion y Shopify muestra el reembolso como fallido, se documenta como comportamiento coherente con la regla de negocio

**Tipo:** E2E

#### 3.15 TC-002 — [Reembolsos] - [Camino Alterno] - Validar reintento del mismo reembolso parcial dentro de los 5 minutos

**Precondition:** Existe una orden aprobada hace menos de 5 minutos sobre la que ya se disparo un reembolso parcial (exitoso o fallido) desde Shopify.

**Steps:**
1. En el admin de Shopify, sobre la misma orden donde ya se solicito un reembolso parcial, intentar reembolsar nuevamente por el mismo monto (datos: mismo monto parcial usado en el intento anterior)
2. Confirmar el reembolso
3. Revisar el estado final de la orden en Shopify y la transaccion en el Panel Mach

**Expected:**
- El estado de la orden en Shopify no cambia respecto al resultado del primer intento y en el Panel Mach no aparece un nuevo movimiento adicional por el mismo monto

**Tipo:** E2E

#### 3.16 TC-003 — [Reembolsos] - [Camino de Error] - Validar reembolso parcial por un monto mayor al total del pedido

**Precondition:** Existe una orden aprobada, con cualquier antiguedad, aun no reembolsada.

**Steps:**
1. Ir al admin de Shopify, seccion Pedidos, y abrir la orden aprobada
2. Tocar Reembolsar e ingresar un monto mayor al total pagado (datos: monto superior al total del pedido (ej.: total + 1))
3. Intentar confirmar el reembolso

**Expected:**
- Shopify muestra un error de validacion y no permite confirmar el reembolso por un monto mayor al disponible

**Tipo:** E2E

#### 3.17 TC-004 — [Reembolsos] - [Camino de Error] - Validar reembolso con monto vacio o en cero

**Precondition:** Existe una orden aprobada, con cualquier antiguedad, aun no reembolsada.

**Steps:**
1. Ir al admin de Shopify, seccion Pedidos, y abrir la orden aprobada
2. Tocar Reembolsar y dejar el campo de monto vacio o en cero
3. Intentar confirmar el reembolso

**Expected:**
- Shopify no permite confirmar la accion de reembolso y muestra un error de validacion del monto

**Tipo:** E2E
