# Sistema CRUD de Gastos – Prueba Técnica Full Stack - Francisco Javier Gonzalez Fajardo

## Descripción General
Este proyecto consiste en el desarrollo de un **sistema web de gestión de gastos (CRUD)**, implementado como **prueba técnica Full Stack**, cuyo objetivo principal es demostrar la capacidad de diseñar, construir e integrar una aplicación completa de principio a fin, aplicando **buenas prácticas de desarrollo, arquitectura limpia y un flujo realista de uso**.

La aplicación permite a los usuarios **registrar, consultar, actualizar y eliminar gastos**, así como **analizar la información mediante reportes visuales y exportar los datos en distintos formatos**, simulando un escenario real de un sistema administrativo utilizado en entornos productivos.

Desde el punto de vista técnico, el proyecto refleja:
- Diseño de una **API REST estructurada y segura**.
- Integración eficiente entre **frontend y backend**.
- Uso de **paginación real, filtros dinámicos y validaciones en ambos extremos**.
- Implementación de **autenticación con control de acceso y roles**, asegurando que cada usuario solo interactúe con la información que le corresponde.
- Enfoque en **experiencia de usuario**, con estados de carga, mensajes claros y una interfaz responsiva.

La solución está construida con **NestJS y PostgreSQL en el backend**, y **Nuxt 3 (Vue 3) en el frontend**, tecnologías ampliamente utilizadas en proyectos modernos Full Stack.  
Se priorizó un código **tipado, modular y mantenible**, pensado para ser fácilmente escalable y adaptable a futuras necesidades como dashboards avanzados, CI/CD o despliegues en producción.

En conjunto, este proyecto no solo cumple los requisitos funcionales de la prueba técnica, sino que también demuestra una **visión integral del desarrollo Full Stack**, abordando arquitectura, seguridad, calidad de código y experiencia de usuario de manera equilibrada.

### Stack Tecnológico
- **Backend:** NestJS · PostgreSQL · TypeORM · TypeScript  
- **Frontend:** Nuxt 3 (Vue 3) · Nuxt UI · TypeScript  

El enfoque del proyecto prioriza:
- Código limpio y tipado
- Separación de responsabilidades
- Escalabilidad
- Seguridad básica aplicada correctamente

---

## Acceso a la Aplicación

El sistema cuenta con **autenticación obligatoria**.

🔹 Al ingresar directamente a:  
**http://localhost:3000**

El sistema **no permite realizar ninguna acción**, ya que el usuario no se encuentra autenticado.

🔹 Para utilizar la aplicación, se debe acceder primero a:  
**http://localhost:3000/login**

### Credenciales de prueba
- **Correo:** `admin@admin.com`
- **Contraseña:** `admin123`

Una vez autenticado, el usuario puede acceder al CRUD completo de gastos, reportes y exportaciones.  
Este comportamiento demuestra el **control de acceso, protección de rutas y manejo de sesión** tanto en frontend como en backend.

---

## Backend – API REST (NestJS)

### Tecnologías Utilizadas
- NestJS
- TypeORM
- PostgreSQL
- TypeScript
- class-validator
- JWT (autenticación)
- bcrypt (hash de contraseñas)
- Swagger / OpenAPI
- Docker (entorno local)

---

### Arquitectura y Diseño
La arquitectura del sistema fue diseñada con el objetivo de **mantener un código claro, escalable y fácil de mantener**, simulando un entorno de desarrollo profesional.

### Backend – Arquitectura Modular (NestJS)

En el backend se adoptó una **arquitectura modular**, aprovechando las características nativas de NestJS. Cada módulo encapsula una funcionalidad específica del sistema, lo que permite un crecimiento ordenado y reduce el acoplamiento entre componentes.

La estructura se divide principalmente en:

- **Controllers**
  - Responsables únicamente de recibir las solicitudes HTTP.
  - Validan la entrada mediante DTOs.
  - Delegan toda la lógica de negocio a los servicios.
  - Mantienen rutas simples y legibles.

- **Services**
  - Contienen la lógica de negocio principal.
  - Manejan el acceso a datos mediante TypeORM.
  - Reutilizan lógica común entre diferentes endpoints.
  - Facilitan la extensión de funcionalidades sin modificar controladores.

- **Entities**
  - Definen el modelo de datos y sus relaciones.
  - Mantienen sincronía entre la base de datos y el dominio de la aplicación.
  - Permiten generar automáticamente el esquema de la base de datos en desarrollo.

- **DTOs (Data Transfer Objects)**
  - Garantizan la validación y tipado de los datos entrantes.
  - Evitan que datos inválidos o incompletos lleguen a la lógica de negocio.
  - Mejoran la seguridad y la estabilidad del sistema.

Esta separación permite que el backend sea **predecible, testeable y fácil de comprender**
---

### Separación de Módulos

El sistema se organizó en módulos independientes:

- **Auth Module**
  - Maneja autenticación basada en JWT.
  - Controla login, logout y obtención del usuario autenticado.
  - Centraliza la lógica de seguridad.

- **Expenses Module**
  - Implementa el CRUD completo de gastos.
  - Aplica reglas de negocio y control de ownership.
  - Soporta filtros, paginación y exportaciones.

- **Reports Module**
  - Encargado del análisis de datos.
  - Realiza agregaciones directamente en la base de datos.
  - Evita cargar grandes volúmenes de datos en el frontend.

Esta organización facilita la **evolución del sistema**, permitiendo agregar nuevas funcionalidades (por ejemplo, notificaciones o auditorías) sin afectar el resto del código.

---

### Frontend – Arquitectura por Composición (Nuxt 3)

En el frontend se utilizó **Nuxt 3 con Vue 3 (Composition API)**, priorizando una arquitectura basada en **composición y reutilización de lógica**.

Las decisiones clave fueron:

- **Composables personalizados**
  - `useApi`: centraliza la configuración de peticiones HTTP.
  - `useExpenses`: encapsula la lógica del CRUD de gastos.
  - `useAuth`: gestiona autenticación y estado del usuario.

  Esto evita duplicar lógica y facilita cambios globales.

- **Componentes desacoplados**
  - Componentes visuales enfocados en UI.
  - Lógica de negocio fuera de las vistas.
  - Mayor legibilidad y mantenibilidad.

- **Manejo explícito de estados**
  - Estados de carga.
  - Estados vacíos.
  - Manejo de errores visibles para el usuario.

Este enfoque permite que el frontend sea **escalable, fácil de probar y consistente**, incluso a medida que crece la aplicación.

---

### Comunicación Frontend – Backend

La comunicación entre capas se realizó mediante una **API REST bien definida**, con:

- Rutas claras y consistentes.
- Prefijo global `/api`.
- Uso de `baseURL` para evitar conflictos de enrutamiento.
- Manejo centralizado de errores HTTP.

Además, se cuidó especialmente el **flujo de autenticación**, asegurando que:
- Las rutas protegidas no sean accesibles sin sesión activa.
- El estado de autenticación se sincronice correctamente entre frontend y backend.

---

En conjunto, la arquitectura y el diseño del sistema reflejan un enfoque **práctico y profesional**, priorizando claridad, calidad de código y una base sólida para evolucionar el proyecto en un entorno real.

---

### Modelo de Datos

El modelo de datos fue diseñado para representar un escenario realista de administración de gastos, priorizando **integridad referencial, escalabilidad y control de acceso por usuario**.  
La relación entre usuarios y gastos permite implementar reglas de negocio como **ownership** (cada usuario solo puede ver/gestionar sus propios registros) y, adicionalmente, habilita un rol administrador con acceso global.

---

### Entidad `User`

La entidad `User` representa a los usuarios del sistema y funciona como base para autenticación y autorización.

**Campos principales:**
- `id`: identificador único del usuario.
- `email`: correo único (utilizado como credencial de acceso).
- `passwordHash`: contraseña cifrada con `bcrypt` (nunca se almacena en texto plano).
- `role`: rol del usuario, con valores:
  - `user`: acceso únicamente a sus propios gastos.
  - `admin`: acceso a todos los gastos del sistema.

**Consideraciones de diseño:**
- El `email` se considera un identificador natural y debe ser **único**.
- El uso de `passwordHash` fortalece la seguridad del almacenamiento de credenciales.
- `role` permite escalar fácilmente a nuevos permisos en el futuro (por ejemplo: auditor, manager, etc.).

---

### Entidad `Expense`

La entidad `Expense` representa cada gasto registrado en el sistema.

**Campos principales:**
- `id`: identificador único del gasto.
- `description`: texto descriptivo del gasto (campo buscable).
- `amount`: monto numérico del gasto (mayor a 0).
- `date`: fecha del gasto/registro, utilizada para reportes y agrupaciones.
- `category`: categoría del gasto (valor controlado).
- `user`: relación obligatoria con `User`.

**Relación:**
- `User (1) → Expense (N)`  
  Un usuario puede tener **muchos gastos**, pero cada gasto pertenece a **un único usuario**.

**Motivos de esta relación:**
- Permite aplicar **ownership** (seguridad por registro).
- Evita registros “huérfanos” sin propietario.
- Facilita filtros, reportes y exportaciones por usuario.

---

### Categorías disponibles

Las categorías se manejan como un conjunto controlado de valores para garantizar consistencia en filtros, reportes y exportación:

- Food
- Transport
- Bills
- Shopping
- Health
- Entertainment
- Other

---

### Reglas de Integridad y Validación

Para garantizar consistencia en el modelo:
- Cada `Expense` debe estar asociado a un `User` (**relación obligatoria**).
- `amount` debe ser mayor a 0.
- `description` no puede ser vacío.
- `category` debe pertenecer al catálogo permitido.
- Los datos se validan con:
  - DTOs + `class-validator` en backend
  - `Zod` en frontend

---

### Impacto en Funcionalidad y Rendimiento

Este diseño habilita directamente:
- **Paginación real** en el listado de gastos por usuario.
- **Búsqueda** por descripción (`query`) sin comprometer la estructura.
- **Filtros** por categoría.
- **Reportes** eficientes agrupando por fecha/categoría desde la base de datos.
- **Exportaciones** reutilizando los mismos filtros del listado.

Además, al realizar agregaciones en backend (Reports), se evita enviar grandes volúmenes de datos al frontend, mejorando rendimiento y escalabilidad.

---

### Mejoras potenciales del modelo

- Normalizar categorías como entidad (`Category`) para permitir:
  - alta/baja/modificación de categorías
  - categorías personalizadas por usuario
- Agregar campos de auditoría:
  - `createdAt`, `updatedAt`
  - `deletedAt` (soft delete)
- Incorporar una entidad opcional `ExpenseTag` o `Tag` para clasificación flexible.
- Indexación en base de datos para mejorar búsqueda por `description` y filtros por `category`/`date`.

En conjunto, el modelo se mantiene **simple y alineado a la prueba técnica**, pero con una base sólida para crecer hacia un sistema más completo.

---

### Endpoints Principales

Todos los endpoints utilizan el prefijo `/api`.

| Método | Endpoint | Descripción |
|------|--------|------------|
| GET | /api/expenses | Listado con paginación y filtros |
| GET | /api/expenses/:id | Obtener gasto por ID |
| POST | /api/expenses | Crear gasto |
| PUT | /api/expenses/:id | Actualizar gasto |
| DELETE | /api/expenses/:id | Eliminar gasto |
| POST | /auth/login | Login |
| GET | /auth/me | Usuario autenticado |
| POST | /auth/logout | Logout |

Filtros soportados:
- `page`
- `limit`
- `category`
- `query`

---

### Seguridad y Validaciones

La seguridad y la consistencia de datos fueron abordadas desde el diseño inicial, aplicando un enfoque de “defensa en profundidad”: **validación en frontend para mejorar UX** y **validación en backend para garantizar integridad y seguridad**, complementado con autenticación, control de acceso y protección de rutas.

---

### Validaciones en Backend (NestJS)

En el backend se implementó validación de entrada mediante **DTOs + class-validator**, lo que asegura que **ninguna petición inválida llegue a la lógica de negocio**.

Se validan reglas como:
- `description` obligatoria y no vacía.
- `amount` obligatorio y mayor a 0.
- `category` obligatorio y dentro del catálogo permitido.
- Tipos correctos (string, number, date) antes de procesar.

**Ventajas de este enfoque:**
- Protege la aplicación ante entradas maliciosas o inconsistentes.
- Garantiza integridad incluso si el frontend cambia o se usa otra app cliente (Postman, mobile, etc.).
- Reduce errores en producción y facilita la depuración.

Además, NestJS maneja correctamente el retorno de errores, generando respuestas HTTP coherentes (por ejemplo, 400 para validaciones).

---

### Validaciones en Frontend (Nuxt 3)

En el frontend se aplicaron validaciones con **Zod** antes de enviar los datos al backend, con el objetivo de:
- Evitar llamadas innecesarias al servidor.
- Mejorar la experiencia del usuario con feedback inmediato.
- Asegurar formularios consistentes (create/edit).

Ejemplos:
- Bloqueo de guardado si falta la descripción.
- Validación de monto > 0.
- Categoría obligatoria.
- Mensajes de error visibles en el modal.

Este doble enfoque (frontend + backend) reduce errores y ofrece una experiencia más sólida.

---

### Autenticación con JWT + Cookies httpOnly

Se implementó un flujo de autenticación basado en **JWT**, almacenado en **cookies httpOnly**, lo que aporta ventajas importantes:

- El token **no es accesible desde JavaScript**, reduciendo riesgo ante ataques XSS.
- El navegador administra automáticamente el envío de cookies en cada request (cuando corresponde).
- Se mantiene un flujo realista utilizado frecuentemente en aplicaciones web modernas.

Flujo implementado:
- `POST /auth/login` valida credenciales y genera token.
- El token se guarda en cookie `httpOnly`.
- `GET /auth/me` permite recuperar el usuario autenticado y su rol.
- `POST /auth/logout` limpia cookies y cierra sesión.

---

### Protección de Rutas y Acceso No Autorizado

La aplicación aplica control de acceso tanto en backend como en frontend:

#### Backend
- Endpoints protegidos requieren sesión válida.
- Si el token es inválido o no existe:
  - respuesta **401 Unauthorized**
- Se aplican guards para bloquear recursos protegidos.

#### Frontend
- La interfaz no permite operar el CRUD sin autenticación.
- Al abrir `http://localhost:3000`, si no existe sesión válida:
  - el usuario **no puede realizar acciones**
  - debe autenticarse en `/login`

Esto demuestra integración completa del flujo de seguridad, no solo un login aislado.

---

### Roles y Control de Ownership (Autorización)

Se implementó autorización basada en:
- Rol del usuario (`user` / `admin`)
- Propiedad del recurso (ownership)

Reglas aplicadas:
- **user:** solo puede ver/editar/eliminar sus propios gastos.
- **admin:** puede acceder y gestionar todos los gastos.

Este control evita que un usuario pueda manipular datos de otros incluso si intenta forzar un ID manualmente (por ejemplo desde Postman).

---

### Hash de Contraseñas y Buenas Prácticas

Las contraseñas se manejan de forma segura:
- Nunca se guardan en texto plano.
- Se almacenan como `passwordHash` usando **bcrypt**.
- Durante el login se compara:
  - contraseña ingresada vs hash almacenado

Esto es un estándar mínimo esperado en aplicaciones reales.

---

### CORS y Sesiones

Se configuró CORS para permitir comunicación con el frontend, habilitando:
- `credentials: true` (necesario para cookies)
- origen permitido (frontend local)

Esto garantiza que:
- la cookie se envíe correctamente en requests autenticados
- se eviten errores comunes de integración entre puertos distintos

---

### Manejo de Errores y Respuestas HTTP

Se implementó manejo consistente de errores:

- **400 Bad Request**: datos inválidos o validaciones fallidas
- **401 Unauthorized**: usuario no autenticado
- **403 Forbidden**: autenticado pero sin permisos (rol/ownership)
- **404 Not Found**: recurso inexistente
- **500 Internal Server Error**: error inesperado

Esto mejora la experiencia de consumo de API y facilita debugging.

---

En conjunto, la implementación muestra un flujo completo y realista de seguridad: **autenticación, autorización, validación, manejo de errores y protección por usuario**, alineado a buenas prácticas Full Stack.


---

## Frontend – Aplicación Web (Nuxt 3) 

### Tecnologías Utilizadas
- Nuxt 3
- Vue 3 (Composition API)
- Nuxt UI
- TypeScript
- Zod (validaciones)
- Bootstrap 5

---

### Estructura y Buenas Prácticas

La organización del proyecto fue pensada para que cualquier desarrollador (o evaluador) pueda entenderlo rápidamente, mantenerlo y extenderlo. Se priorizó una estructura clara, separación de responsabilidades y consistencia en el manejo de datos y estados.

---

### Frontend (Nuxt 3) – Estructura orientada a mantenibilidad

En el frontend se implementó una estructura basada en **Composition API** y el principio de “UI simple + lógica reutilizable”, evitando mezclar reglas de negocio con componentes visuales.

#### Uso de composables para lógica reutilizable
Se implementaron composables para encapsular responsabilidades:

- **`useApi`**
  - Centraliza la configuración de peticiones HTTP (baseURL, headers, manejo de errores).
  - Evita duplicar lógica al consumir endpoints.
  - Facilita cambios globales (por ejemplo, cambiar host/puerto, agregar headers o tokens).
  
- **`useExpenses`**
  - Encapsula el CRUD completo (list, create, update, remove).
  - Maneja parámetros del listado (page, limit, category, query).
  - Permite que la vista se mantenga limpia y enfocada en UI.

- **`useAuth`**
  - Maneja sesión del usuario (login, logout, `me`).
  - Centraliza estado de usuario y rol.
  - Evita repetir lógica de autenticación en múltiples páginas.

Este enfoque mejora:
- Reutilización de código
- Legibilidad
- Mantenibilidad
- Escalabilidad

---

### Manejo explícito de estados (UX + estabilidad)

Se implementó un manejo claro de estados en el frontend para ofrecer una experiencia sólida:

- **Loading states**
  - Indicadores mientras se cargan datos del backend.
  - Evita UI “congelada” o confusa.

- **Empty states**
  - Mensajes claros cuando no hay gastos disponibles o cuando un filtro no retorna resultados.

- **Error states**
  - Manejo de errores HTTP y mensajes visibles para el usuario.
  - Previene que fallos del backend rompan la interfaz.

Este manejo explícito ayuda a que el sistema se sienta estable y profesional.

---

### Tipado estricto y consistencia en datos

Se mantuvo el uso de **TypeScript** de forma consistente:

- Tipado para entidades (`Expense`, `ExpenseInput`, `ExpenseCategory`, `User`).
- Tipado en respuestas del backend (por ejemplo, respuesta paginada).
- Evita `any` y mantiene contratos claros entre frontend y backend.
- Facilita autocompletado, refactor y detección temprana de errores.

Esto reduce errores en runtime y mejora la calidad del desarrollo.

---

### Validación en formularios (prevención antes de enviar)

Los formularios de creación/edición de gastos validan datos antes de enviar al backend:

- Descripción obligatoria (no vacía / no solo espacios)
- Monto obligatorio y > 0
- Categoría obligatoria
- Fecha con formato válido cuando aplica

Beneficios:
- Menos requests inválidos
- Mejor experiencia de usuario
- Feedback inmediato en UI

---

### UI consistente y reutilización visual

Se integró un diseño consistente usando:
- **Nuxt UI** como base de componentes
- **Bootstrap 5** para layout, grids, tablas, cards y responsividad

Se priorizó:
- Layout responsive
- Componentes reutilizables (modales, botones, toasts)
- Interfaz limpia para evaluación rápida

---

### Backend – Buenas prácticas de desarrollo (NestJS)

Aunque esta sección corresponde a frontend, se mantuvieron buenas prácticas también en backend para coherencia del proyecto:

- Controladores delgados (solo orquestan)
- Lógica en servicios
- DTOs para validación y tipado
- Manejo consistente de excepciones HTTP
- Separación por módulos (Auth, Expenses, Reports)

---

### Flujo de datos coherente (contratos claros)

Se mantuvo un contrato claro entre frontend y backend:

- Endpoints con rutas consistentes (`/api/...`)
- Parámetros de filtros y paginación estandarizados
- Respuesta paginada con metadatos:
  - `data`
  - `total`
  - `page`
  - `limit`
  - `totalPages`

Esto facilita:
- Escalabilidad del listado
- Integración con reportes
- Reutilización para exportaciones

---

### Diseño pensado para escalar

Aunque es una prueba técnica, se dejó una base lista para crecer:

- Posibilidad de agregar nuevas vistas sin duplicar lógica
- Fácil incorporación de nuevos módulos (por ejemplo categorías dinámicas, auditoría)
- Preparación para agregar pruebas (unitarias/e2e)
- Preparación para CI/CD y despliegue

En conjunto, la estructura y buenas prácticas aplicadas reflejan un enfoque **profesional y orientado a equipo**, priorizando calidad de código, claridad, UX estable y facilidad de mantenimiento.


---

### Funcionalidades Principales 

El sistema implementa un conjunto de funcionalidades orientadas a cubrir un flujo realista de gestión de gastos, cuidando tanto la lógica de negocio como la experiencia de usuario. Cada funcionalidad fue diseñada para ser clara, predecible y coherente con el resto del sistema.

---

### Listado de gastos con paginación real

La vista principal muestra un listado de gastos en formato de tabla responsiva.  
El listado se obtiene desde el backend utilizando **paginación real**, evitando cargar grandes volúmenes de datos en el frontend.

- Consumo del endpoint `GET /api/expenses`
- Parámetros soportados:
  - `page`
  - `limit`
- Uso de metadatos devueltos por la API:
  - total de registros
  - página actual
  - total de páginas

Este enfoque mejora el rendimiento y permite escalar el sistema sin modificaciones importantes.

---

### Búsqueda por descripción

Se implementó un campo de búsqueda que permite filtrar los gastos por coincidencias en la descripción.

- El texto ingresado se envía como parámetro `query`.
- La búsqueda se realiza directamente en el backend.
- Permite filtrar resultados sin recargar la página.
- Funciona de forma combinada con paginación y filtros.

Esto facilita localizar gastos específicos de manera rápida y eficiente.

---

### Filtro por categoría

El sistema permite filtrar los gastos por categoría mediante un selector.

- Categorías disponibles:
  - Food
  - Transport
  - Bills
  - Shopping
  - Health
  - Entertainment
  - Other
- El valor seleccionado se envía como parámetro `category`.
- El filtro puede combinarse con búsqueda y paginación.

El uso de categorías controladas asegura consistencia en los datos y mejora los reportes posteriores.

---

### Limpieza de filtros

Se incluye una opción para restablecer todos los filtros aplicados.

- Limpia búsqueda por texto.
- Restablece la categoría seleccionada.
- Regresa a la primera página del listado.

Esto permite al usuario volver rápidamente al estado inicial del sistema sin recargar la aplicación.

---

### Creación de gastos

El sistema permite registrar nuevos gastos mediante un modal dedicado.

- Campos requeridos:
  - Descripción
  - Monto
  - Categoría
- Campo opcional:
  - Fecha
- Validaciones aplicadas antes de enviar:
  - Descripción no vacía
  - Monto mayor a 0
  - Categoría obligatoria

Al guardar, se envía una petición `POST /api/expenses` y el listado se actualiza automáticamente.

---

### Edición de gastos

Cada gasto puede ser editado desde el listado.

- El modal se abre con los datos precargados.
- Permite modificar cualquier campo editable.
- La actualización se realiza con `PUT /api/expenses/:id`.
- Se muestran mensajes de éxito o error según el resultado.

Esto garantiza un flujo de edición claro y sin ambigüedades para el usuario.

---

### Eliminación con confirmación

Para prevenir eliminaciones accidentales, el sistema incorpora un paso de confirmación.

- Al seleccionar “Eliminar”, se muestra un modal de confirmación.
- El usuario puede cancelar o confirmar la acción.
- La eliminación se realiza mediante `DELETE /api/expenses/:id`.

Este patrón mejora la seguridad y la experiencia de usuario.

---

### Manejo de estados de la interfaz

La aplicación comunica claramente el estado del sistema en todo momento:

- Estado de carga mientras se obtienen datos.
- Estado vacío cuando no existen registros.
- Mensajes de error en caso de fallos de red o backend.
- Notificaciones visuales de éxito tras crear, editar o eliminar.

Esto evita confusión y hace que la aplicación se sienta estable y confiable.

---

### Control de acceso por autenticación

Todas las funcionalidades del CRUD están protegidas por autenticación.

- Sin sesión activa, el usuario no puede crear, editar ni eliminar gastos.
- El acceso se habilita únicamente después de iniciar sesión.
- El control se aplica tanto en frontend como en backend.

Esto demuestra un flujo completo de protección de funcionalidades y datos.

---

### Integración con reportes y exportaciones

Las funcionalidades principales del CRUD están integradas con:

- Reportes visuales por categoría y periodo.
- Exportación de datos en formatos CSV, Excel y PDF.
- Reutilización de filtros del listado para reportes y exportaciones.

De esta forma, el CRUD no se limita a operaciones básicas, sino que sirve como base para análisis y toma de decisiones.

---

En conjunto, las funcionalidades principales cubren un flujo completo de uso real, demostrando la implementación de un sistema CRUD robusto, bien estructurado y alineado a buenas prácticas Full Stack.


---

## Reportes y Gráficas 

El sistema incorpora un **módulo de reportes independiente** cuyo objetivo es transformar los datos del CRUD en información útil para análisis y toma de decisiones.  
Esta funcionalidad va más allá de un CRUD tradicional y demuestra la capacidad de **diseñar consultas agregadas, optimizar rendimiento y presentar información de forma clara en el frontend**.

---

### Diseño del módulo de reportes

Los reportes se implementaron como un **módulo separado** tanto a nivel de backend como de frontend, evitando mezclar lógica analítica con la lógica operativa del CRUD de gastos.

Este enfoque permite:
- Mantener el código organizado y desacoplado.
- Reutilizar el CRUD sin afectarlo.
- Escalar los reportes de forma independiente.

---

### Backend – Generación eficiente de reportes

En el backend se creó un módulo `Reports`, responsable exclusivamente del análisis de datos.

Las principales decisiones técnicas fueron:

- Uso de **QueryBuilder de TypeORM** para:
  - Realizar agregaciones directamente en la base de datos.
  - Evitar traer grandes volúmenes de registros al backend o frontend.
  - Mejorar el rendimiento y la escalabilidad.

- Uso de **fechas en formato UTC** para evitar inconsistencias por zona horaria.

- Reutilización de filtros ya existentes (categoría y rango de fechas).

---

### Endpoints de reportes

El módulo de reportes expone endpoints específicos para análisis:

- Total de gastos agrupados por **categoría**.
- Total de gastos agrupados por **periodo** (día o mes).

Los endpoints aceptan los siguientes parámetros:
- `from`: fecha inicial
- `to`: fecha final
- `groupBy`: tipo de agrupación (`day` o `month`)
- `category`: filtro opcional por categoría

Esto permite generar reportes flexibles sin modificar la lógica del frontend.

---

### Frontend – Visualización de datos

En el frontend se desarrolló una vista dedicada a reportes, accesible desde el encabezado del CRUD, al tratarse de una acción global sobre los datos.

Las gráficas permiten:
- Visualizar el total de gastos por categoría mediante gráfica de pastel.
- Analizar la evolución de gastos en el tiempo mediante gráficas por periodo.
- Cambiar filtros y ver los resultados de forma dinámica.

Se priorizó:
- Claridad visual.
- Interpretación rápida de los datos.
- Consistencia con la interfaz general del sistema.

---

### Integración con filtros y UX

Los reportes reutilizan el mismo concepto de filtros que el CRUD:

- Rango de fechas seleccionable.
- Categoría opcional.
- Tipo de agrupación configurable.

Esto permite al usuario:
- Analizar subconjuntos específicos de información.
- Comparar gastos por periodos.
- Obtener resultados coherentes con los datos del listado.

---

### Rendimiento y escalabilidad

El diseño del módulo de reportes fue pensado para un escenario real:

- Las agregaciones se realizan en base de datos.
- El frontend recibe únicamente datos procesados.
- Se minimiza el tráfico de información.
- Se evita duplicar lógica entre CRUD y reportes.

Este enfoque permite que los reportes sigan funcionando correctamente incluso con un volumen elevado de gastos.

---

### Relación con exportaciones

Los reportes están alineados con la funcionalidad de exportación:

- Los mismos filtros pueden aplicarse para exportar información.
- El backend reutiliza la lógica de consulta.
- Se mantiene consistencia entre lo que se visualiza y lo que se exporta.

---

### Valor agregado del módulo de reportes

La inclusión de reportes y gráficas demuestra:

- Capacidad para diseñar consultas agregadas complejas.
- Comprensión de rendimiento y optimización.
- Separación clara entre datos operativos y analíticos.
- Enfoque en uso real del sistema, más allá del CRUD básico.

Este módulo convierte al proyecto en una **aplicación de gestión con capacidades analíticas**, alineada con necesidades reales de sistemas administrativos modernos.

---

## Decisiones Técnicas Relevantes 

Las decisiones técnicas del proyecto se tomaron priorizando un equilibrio entre cumplimiento de requisitos, calidad de código, escalabilidad y realismo (como se esperaría en un entorno profesional). A continuación se describen los criterios más importantes.

---

### Arquitectura modular en backend (NestJS)

Se eligió una arquitectura modular para mantener el código organizado y escalable. La división por módulos (por ejemplo, `Auth`, `Expenses`, `Reports`, `Users`) permite:

- Encapsular responsabilidades por dominio funcional.
- Evitar acoplamiento innecesario entre capas.
- Facilitar mantenimiento y futuras extensiones (nuevos endpoints o reglas de negocio).
- Mejorar la legibilidad para evaluadores y equipos.

Este enfoque también habilita que futuras funcionalidades (auditoría, categorías dinámicas, notificaciones) se agreguen sin reestructurar el sistema.

---

### Controladores delgados y lógica en servicios

Se mantuvo el patrón de “controllers delgados”, donde el controlador:
- recibe la petición,
- valida datos (DTO),
- delega al servicio.

Mientras que el servicio:
- contiene reglas de negocio,
- centraliza la lógica de consulta y persistencia,
- reutiliza lógica entre endpoints.

Esto reduce duplicidad, mantiene consistencia y mejora la testabilidad.

---

### TypeORM por productividad y tipado consistente

TypeORM se utilizó por:
- integrarse de forma natural con NestJS,
- simplificar el mapeo de entidades a tablas,
- permitir consultas avanzadas con QueryBuilder,
- conservar tipado fuerte a lo largo del proyecto.

Además, se aprovechó para:
- generar el esquema en desarrollo,
- definir relaciones (`Expense -> User`) con integridad referencial,
- construir reportes mediante agregaciones en base de datos.

---

### Paginación real desde backend

Se implementó paginación real en backend en lugar de paginar en frontend. Esto se decidió por:

- mejorar rendimiento ante listados grandes,
- evitar cargar todos los registros en memoria del cliente,
- mantener consistencia de resultados cuando se aplican filtros,
- facilitar la escalabilidad en escenarios reales.

La API devuelve metadatos (`total`, `totalPages`, `page`, `limit`) para una navegación confiable.

---

### Filtros y búsqueda implementados a nivel API

Los filtros (`category`) y búsqueda (`query`) se resolvieron en backend para:

- asegurar consistencia entre UI y exportaciones/reportes,
- reducir procesamiento en frontend,
- permitir que cualquier consumidor de API tenga el mismo comportamiento,
- mantener una fuente única de verdad para la lógica de filtrado.

---

### Validación doble: frontend + backend

Se aplicó validación en ambos lados:

- Frontend (Zod): mejora UX y evita requests inválidos.
- Backend (DTO + class-validator): asegura integridad y seguridad.

Esta decisión reduce errores, evita datos corruptos y se alinea a buenas prácticas Full Stack.

---

### Autenticación con JWT almacenado en cookies httpOnly

La autenticación se implementó con JWT en cookies httpOnly por motivos de seguridad y realismo:

- El token no es accesible desde JavaScript (mitiga XSS).
- Se facilita el envío automático del token en cada request.
- Permite proteger rutas en backend y controlar acceso desde frontend.

Se implementaron endpoints típicos:
- `/auth/login`
- `/auth/me`
- `/auth/logout`

Esto demuestra un flujo completo de sesión y autorización.

---

### Autorización basada en roles y ownership de datos

Se incorporó un modelo realista de seguridad:
- Rol `user`: solo gestiona sus propios gastos.
- Rol `admin`: puede gestionar todos los gastos.

El control de ownership se aplica en backend para evitar bypass, incluso si un usuario intenta modificar IDs manualmente.  
Esta decisión refuerza la integridad y demuestra dominio de autorización en sistemas reales.

---

### Reportes agregados en base de datos (QueryBuilder)

Los reportes se implementaron agregando datos directamente en PostgreSQL mediante QueryBuilder, en lugar de traer datos al frontend y agruparlos allí.

Ventajas:
- Menor transferencia de datos.
- Mejor rendimiento con grandes volúmenes.
- Lógica analítica centralizada en backend.
- Resultados más consistentes y escalables.

Este diseño también permite que los reportes sean reutilizables para futuras exportaciones o dashboards.

---

### Exportaciones desde backend y descarga mediante Blob en frontend

La exportación en CSV/XLSX/PDF se implementó en backend por:
- consistencia con filtros y seguridad (ownership/roles),
- generación más controlada del formato,
- facilidad para enviar archivos directamente al cliente.

En frontend se utilizó descarga con `Blob` para asegurar:
- compatibilidad con archivos binarios,
- descarga correcta sin interferir con el router,
- una experiencia clara para el usuario.

---

### Comunicación robusta frontend–backend mediante baseURL

Se definió una estrategia clara de consumo de API usando `baseURL` (en lugar de navegación por router) para evitar problemas comunes como rutas duplicadas (`/api/api/...`) y asegurar coherencia entre entornos.

Esto facilita:
- cambiar de entorno local a producción sin modificar múltiples archivos,
- mantener consistencia y simplicidad en requests,
- reducir errores durante la integración.

---

### Enfoque en mantenibilidad y escalabilidad

Aunque es una prueba técnica, se priorizó una base sólida:

- módulos independientes para crecer sin romper el sistema,
- lógica centralizada y reutilizable (services/composables),
- estructura fácil de entender para equipos,
- base lista para incorporar pruebas automatizadas, CI/CD y despliegue productivo.

---

En conjunto, estas decisiones muestran un enfoque Full Stack profesional: arquitectura clara, seguridad aplicada correctamente, rendimiento considerado y una integración completa entre capas.

---

## Retos Técnicos Enfrentados 

Durante el desarrollo se presentaron retos típicos de una implementación Full Stack real, especialmente en la integración entre capas, el control de acceso y el manejo de formatos de exportación. A continuación se describen los principales retos y cómo se resolvieron.

---

### Integración frontend–backend y consistencia de rutas

Uno de los retos principales fue garantizar que el frontend consumiera la API correctamente, ya que el backend utiliza un prefijo global `/api` y corre en un puerto distinto al frontend.

Problema identificado:
- Se generaban rutas duplicadas como `/api/api/expenses` o intentos de navegación del router hacia rutas que en realidad eran endpoints del backend.

Solución aplicada:
- Centralización del consumo de API mediante `baseURL`.
- Separación clara entre rutas de la aplicación (SPA) y rutas de backend (API REST).
- Manejo consistente de URLs a través de variables de entorno / runtime config.

Esto aseguró que todas las peticiones fueran predecibles y evitó errores difíciles de rastrear.

---

### Manejo correcto de autenticación en cookies (httpOnly)

Implementar autenticación con JWT en cookies httpOnly implicó retos relevantes, ya que no es un simple token en localStorage. Para que funcionara correctamente fue necesario alinear frontend, backend y configuración del navegador.

Retos específicos:
- Asegurar que las cookies se enviaran en cada request autenticado.
- Configurar `credentials` y CORS de forma compatible.
- Mantener el estado de sesión en frontend sin acceso directo al token.

Solución aplicada:
- Configuración de CORS con `credentials: true`.
- Endpoint `/auth/me` para sincronizar el estado del usuario en frontend.
- Protección de rutas y acciones para impedir operaciones sin sesión activa.

Esto permitió un flujo realista: el usuario no puede operar el sistema si no ha iniciado sesión.

---

### Control de ownership y autorización por rol

Un reto importante fue asegurar que los permisos no dependieran solo del frontend, sino que estuvieran garantizados en backend.

Riesgos a cubrir:
- Usuarios intentando editar/eliminar gastos de otros cambiando el ID manualmente.
- Acceso indebido a información con requests directos desde herramientas externas (Postman).

Solución aplicada:
- Validación de ownership en el backend (el gasto debe pertenecer al usuario autenticado).
- Lógica adicional para rol `admin`, permitiendo acceso global.
- Respuestas HTTP correctas (401/403) según el caso.

Esto elevó el proyecto de “CRUD básico” a un comportamiento alineado a sistemas reales.

---

### Paginación real con filtros combinados

La paginación real presentó complejidad adicional al combinar:
- paginación (`page`, `limit`)
- filtro por categoría (`category`)
- búsqueda por texto (`query`)

Retos específicos:
- Mantener consistencia entre la tabla y los metadatos (`totalPages`, `total`).
- Asegurar que al cambiar filtros se reinicie correctamente la navegación (por ejemplo, volver a página 1).
- Evitar resultados vacíos por quedarse en una página que ya no existe después de filtrar.

Solución aplicada:
- Backend devolviendo metadatos completos.
- Frontend reiniciando paginación al cambiar filtros/búsqueda.
- Unificación del consumo del listado en una sola función/recurso.

---

### Manejo de exportaciones y descargas de archivos

Exportar datos en CSV/XLSX/PDF fue un reto técnico importante porque implica:

- Generar archivos en backend con filtros aplicados.
- Evitar paginación (exportar “todo lo filtrado”).
- Enviar correctamente binarios al frontend.
- Descargar archivos desde el navegador sin romper la navegación SPA.

Retos específicos:
- Diferenciar requests normales (JSON) de requests de descarga (binarios).
- Manejar `Blob` correctamente en frontend.
- Asignar nombres dinámicos a archivos para mejorar la experiencia.

Solución aplicada:
- Exportación en backend reutilizando lógica de filtros del servicio.
- Descarga en frontend con `Blob` y creación de enlace temporal.
- Evitar que el router tratara endpoints de exportación como rutas de navegación.

---

### Agregaciones para reportes sin sobrecargar el frontend

Generar reportes y gráficas puede resolverse agrupando datos en frontend, pero esa estrategia no escala. El reto fue implementar reportes de forma eficiente.

Reto específico:
- Evitar traer todos los gastos al frontend para agruparlos.
- Mantener reportes rápidos incluso con muchos registros.

Solución aplicada:
- Agregaciones directamente en la base de datos con QueryBuilder.
- Endpoints específicos para reportes por categoría y por periodo.
- Envío al frontend únicamente del resultado agregado.

---

### Manejo de fechas y consistencia temporal

El manejo de fechas suele generar inconsistencias, especialmente al filtrar por rangos o agrupar por día/mes.

Reto:
- Evitar diferencias por zona horaria (UTC vs local).
- Asegurar consistencia entre filtros, reportes y exportaciones.

Solución aplicada:
- Normalización de manejo de fechas (UTC) en reportes.
- Parametrización clara (`from`, `to`, `groupBy`) para minimizar ambigüedad.

---

### Tipado estricto y librerías con typings incompletos

Mantener TypeScript estricto puede introducir fricción cuando se usan librerías con typings parciales o inexistentes.

Reto:
- Evitar usar `any` para no perder calidad ni seguridad de tipos.

Solución aplicada:
- Tipado explícito en funciones clave y estructuras de respuesta.
- Mantener contratos claros entre frontend y backend.
- Resolver integraciones sin desactivar reglas globales de tipado

---

##  Posibles Mejoras a Futuro 

Aunque el sistema cumple los requisitos de la prueba técnica y presenta un flujo completo Full Stack, existen varias mejoras que podrían implementarse para llevarlo a un nivel más cercano a producción. Estas mejoras se agrupan por área para visualizar claramente su impacto.

---

### Seguridad y autenticación

1. **Refresh tokens y renovación de sesión**
   - Implementar refresh tokens para evitar que el usuario tenga que iniciar sesión nuevamente cuando el access token expire.
   - Rotación de tokens para mejorar seguridad y reducir riesgo ante robo de sesión.

2. **Rate limiting en endpoints sensibles**
   - Aplicar throttling en `/auth/login` para mitigar intentos de fuerza bruta.
   - Limitar llamadas repetitivas en reportes/exportaciones para evitar abuso.

3. **Políticas de contraseñas**
   - Reglas mínimas de complejidad (longitud, caracteres, etc.).
   - Bloqueo temporal tras varios intentos fallidos.

4. **Hardening para producción**
   - Headers de seguridad (Helmet).
   - Configuración estricta de cookies (SameSite, Secure en HTTPS).
   - Validación de origen y configuración CORS por entorno.

---

### Experiencia de usuario (UX) y frontend

1. **Mejoras en navegación y accesibilidad**
   - Mejor accesibilidad (ARIA, focus management en modales).
   - Atajos de teclado y mejoras de navegación en tabla.

2. **Filtros avanzados**
   - Ordenamiento por columnas (monto, fecha, categoría).
   - Filtros adicionales: rango de monto, múltiples categorías, etiquetas.

3. **Estados más detallados**
   - Skeleton loaders en tabla.
   - Mensajes de error accionables (por ejemplo, “Sesión expirada, vuelve a iniciar”).

4. **Gestión de perfil**
   - Pantalla de perfil con datos del usuario y rol.
   - Cambio de contraseña y cierre de sesiones activas.

---

### Reportes y analítica

1. **Dashboards más completos**
   - Comparativas mes a mes.
   - Top categorías por gasto.
   - Promedio diario/mensual.
   - Resúmenes rápidos (total del mes actual, variación vs mes anterior).

2. **Reportes personalizados**
   - Guardar configuraciones de reportes (“Mis reportes”).
   - Exportar reportes con el mismo formato de filtros aplicados.

3. **Mejoras visuales**
   - Más tipos de gráficas (barras, líneas, stacked).
   - Tooltips informativos y leyendas mejoradas.

4. **Optimización de consultas**
   - Índices en columnas clave (`userId`, `date`, `category`, `description`) para mejorar rendimiento.
   - Agregaciones materializadas si el volumen crece significativamente.

---

### Exportaciones y documentos

1. **Plantillas más profesionales**
   - PDF con encabezados, totales, resumen por categoría, y estilos consistentes.
   - Exportación en XLSX con hojas separadas (detalle + resumen).

2. **Exportaciones asíncronas**
   - Para grandes volúmenes, generar archivos en segundo plano y notificar al usuario cuando estén listos.
   - Almacenamiento temporal y descarga mediante URL segura.

3. **Historial de exportaciones**
   - Registro de exportaciones realizadas (fecha, usuario, filtros usados).
   - Re-descarga sin regenerar el archivo.

---

### Base de datos y modelo de datos

1. **Categorías dinámicas**
   - Normalizar `Category` como entidad para permitir CRUD de categorías.
   - Categorías personalizadas por usuario o por rol.

2. **Auditoría y trazabilidad**
   - `createdAt`, `updatedAt`
   - `deletedAt` (soft delete)
   - Historial de cambios (quién modificó qué y cuándo).

3. **Optimización y consistencia**
   - Constraints a nivel DB (unique, not null, check amount > 0).
   - Mejor control de formato y persistencia de fechas.

---

### Calidad de código y pruebas

1. **Pruebas unitarias y de integración**
   - Unit tests para services (reglas de negocio, filtros, ownership).
   - Integración para endpoints principales.
   - Validación de errores esperados (401/403/404).

2. **Pruebas end-to-end**
   - Flujos completos: login → CRUD → reportes → exportaciones.
   - Validación del comportamiento desde el frontend.

3. **Documentación técnica extendida**
   - Diagrama de arquitectura.
   - Ejemplos de requests/responses.
   - Guía de despliegue en entornos (dev/staging/prod).

---

### DevOps y despliegue

1. **Pipeline CI/CD**
   - Automatizar instalación, build y pruebas en cada push.
   - Validación de formato y tipado.
   - Deploy automático a un entorno de staging.

2. **Despliegue en nube**
   - Contenerización completa con Docker Compose (frontend + backend + DB).
   - Despliegue en servicios como Render, Railway, AWS o DigitalOcean.
   - Variables de entorno por entorno y secretos gestionados correctamente.

3. **Observabilidad**
   - Logs estructurados (pino/winston) con contexto.
   - Métricas y monitoreo básico.
   - Alertas ante errores frecuentes.

---

## Tiempo de Desarrollo Aproximado /*

| Área | Tiempo |
|----|----|
| Diseño de arquitectura | 2 h |
| Backend | 8–10 h |
| Frontend | 8–10 h |
| Reportes y gráficas | 3–4 h |
| Exportaciones | 3 h |
| Ajustes y correcciones | 2–3 h |
| Documentación | 1–2 h |

**Total estimado:** 28 – 34 horas

---