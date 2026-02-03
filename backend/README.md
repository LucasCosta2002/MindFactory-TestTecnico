<!-- Para una mejor lectura recomiendo: https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles

ctrl + shift + v, abre un markdown con estilos -->

# MindFactory Backend

Backend desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**.

## 📋 Requisitos previos

- Node.js (v18 o superior)
- pnpm (gestor de paquetes)
- PostgreSQL (o acceso a una base de datos PostgreSQL remota)
- Cuenta en Mailtrap (para el servicio de emails)

## 🚀 Instalación

Puedes levantar el backend de dos formas:

- **Tradicional (pnpm + Postgres local/remoto) - UTILZAR .env adjuntado**
- **Docker (recomendado si no quieres instalar Postgres local)**

### 1. Descargar el repositorio


### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

En el comprimido, copiar y pegar el contenido de .env dentro de las variables del proyecto
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos PostgreSQL
DATABASE_HOST=tu_host_de_base_de_datos
DATABASE_PORT=5432
DATABASE_USER=tu_usuario
DATABASE_PASS=tu_contraseña
DATABASE_NAME=nombre_de_tu_base_de_datos

# Configuración de Email (Mailtrap)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=tu_usuario_mailtrap
EMAIL_PASS=tu_contraseña_mailtrap

# JWT
JWT_SECRET=tu_clave_secreta_jwt

# Frontend URL (para los enlaces en emails)
FRONTEND_URL=http://localhost:5173
```

### 4. Ejecutar migraciones

Ejecuta las migraciones para crear las tablas y datos iniciales en la base de datos:

```bash
pnpm migration:run
```

> En Docker, usa `pnpm migration:run:prod` dentro del contenedor (ver sección Docker).

Esto creará un usuario demo con las siguientes credenciales:
- **Email**: `lucasdemo@demo.com`
- **Password**: `password123`
- **Username**: `usuariodemo`

También se crearán 2 posts de ejemplo asociados a este usuario.

## 📧 Configuración de Mailtrap

Para que el servicio de envío de emails funcione correctamente, necesitas crear una cuenta en **Mailtrap**:

### Pasos para configurar Mailtrap:

1. **Crear una cuenta**: Ve a [https://mailtrap.io/](https://mailtrap.io/).

2. **Acceder al Sandbox**: Una vez logueado, ve a **Email Testing** > **Inboxes**.

3. **Obtener credenciales SMTP**:
   - Haz clic en tu inbox (o crea uno nuevo)
   - Ve a la pestaña **SMTP Settings**
   - Selecciona **Nodemailer** en el dropdown de integraciones
   - Copia las credenciales:
     - `host`: sandbox.smtp.mailtrap.io
     - `port`: 2525
     - `user`: (tu usuario único)
     - `pass`: (tu contraseña única)

4. **Configurar en el proyecto**: Agrega estas credenciales en tu archivo `.env`:
   ```env
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=tu_usuario_mailtrap
   EMAIL_PASS=tu_contraseña_mailtrap
   ```


### Desarrollo
```bash
pnpm start:dev
```

### Producción
```bash
pnpm build
pnpm start:prod
```

### Debug
```bash
pnpm start:debug
```

## 🐳 Docker (opcional)

Si prefieres no instalar PostgreSQL local, puedes levantar todo con Docker Compose.

### Levantar servicios

Desde la raíz del repo (donde está `docker-compose.yml`):

```bash
docker compose up --build
```

### Ejecutar migraciones en Docker

```bash
docker compose exec backend pnpm migration:run:prod
```

### URLs

- Backend: `http://localhost:3000/api`
- Frontend: `http://localhost:5173`

## ✨ Funcionalidades principales

### 🔐 Autenticación completa
- Registro de usuarios con confirmación por email
- Login con JWT
- Recuperación de contraseña
- Guards de autenticación
- Endpoint `/auth/me` para datos del usuario autenticado

### 📝 Sistema de Posts
- Crear, leer, actualizar y eliminar publicaciones
- Paginación infinita con cursor
- Carga de hasta 5 imágenes por post
- Relación con usuarios (cada post tiene un autor)
- Solo el autor puede editar/eliminar sus posts
- Likes (dar/quitar like) y conteo por publicación

### 🖼️ Carga de Imágenes
- Soporte para JPG, JPEG, PNG, WebP
- Límite de 5MB por imagen
- Hasta 5 imágenes por post
- Almacenamiento local en `/uploads/posts/`
- Acceso público a las imágenes via HTTP

### 👤 Gestión de Usuarios
- Actualización de perfil
- Al obtener un usuario, incluye todos sus posts
- Búsqueda de usuarios por nombre o username
- Actualización de imagen de perfil

## 🗃️ Migraciones de Base de Datos

El proyecto usa **TypeORM migrations** para gestionar cambios en la estructura de la base de datos de forma controlada y versionada.

### ¿Qué son las migraciones?

Las migraciones son archivos que contienen instrucciones SQL para:
- Crear/modificar tablas
- Añadir/eliminar columnas
- Insertar datos iniciales (seeds)
- Aplicar cambios de forma reversible

### Comandos disponibles

```bash
# Ejecutar migraciones pendientes
pnpm migration:run

# Ejecutar migraciones en Docker (sin build)
pnpm migration:run:prod

# Revertir la última migración
pnpm migration:revert

# Revertir en Docker (sin build)
pnpm migration:revert:prod

# Generar migración automáticamente desde cambios en entidades
pnpm migration:generate

# Crear una migración vacía
pnpm migration:create
```

### Usuario Demo

Al ejecutar `pnpm migration:run`, se crea automáticamente un usuario de prueba:

- **Email**: `demo@example.com`
- **Password**: `password123`
- **Username**: `usuariodemo`

Este usuario incluye 2 posts de ejemplo para probar la funcionalidad.

### Importante

- La configuración actual tiene `synchronize: false` en TypeORM
- **Siempre usa migraciones** para cambios en producción
- Las migraciones se compilan antes de ejecutarse (requiere `pnpm build`)
- Los archivos de migración están en `src/database/migrations/`

| Script | Descripción |
|--------|-------------|
| `pnpm start` | Inicia la aplicación |
| `pnpm start:dev` | Inicia en modo desarrollo con hot-reload |
| `pnpm start:debug` | Inicia en modo debug |
| `pnpm start:prod` | Inicia la versión de producción |
| `pnpm build` | Compila el proyecto |
| `pnpm lint` | Ejecuta el linter |
| `pnpm format` | Formatea el código con Prettier |
| `pnpm test` | Ejecuta los tests unitarios |
| `pnpm test:e2e` | Ejecuta los tests end-to-end |
| `pnpm test:cov` | Ejecuta tests con cobertura |
| `pnpm migration:generate` | Genera una migración desde cambios en entidades |
| `pnpm migration:create` | Crea una migración vacía |
| `pnpm migration:run` | Ejecuta migraciones pendientes |
| `pnpm migration:revert` | Revierte la última migración |
| `pnpm migration:run:prod` | Ejecuta migraciones en Docker (sin build) |
| `pnpm migration:revert:prod` | Revierte migración en Docker (sin build) |

## 🌐 API Endpoints

La API usa el prefijo `/api` para todas las rutas.

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/register` | Registrar un nuevo usuario |
| POST | `/confirm-account` | Confirmar cuenta con token |
| POST | `/login` | Iniciar sesión |
| GET | `/me` | Datos del usuario autenticado |
| POST | `/forgot-password` | Solicitar restablecimiento de contraseña |
| POST | `/reset-password/:token` | Restablecer contraseña con token |

### Usuarios (`/api/user`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/:id` | Obtener usuario por ID (incluye sus posts) |
| GET | `/` | Buscar usuarios por `q` |
| PATCH | `/:id` | Actualizar datos del usuario |
| PATCH | `/:id/profile-image` | Actualizar imagen de perfil |

### Posts (`/api/posts`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/create` | Crear un nuevo post (soporta hasta 5 imágenes) |
| GET | `/` | Obtener todos los posts con paginación infinita |
| GET | `/:id` | Obtener un post por ID |
| POST | `/:id/like` | Dar like a un post |
| DELETE | `/:id/like` | Quitar like a un post |
| PATCH | `/:id` | Actualizar un post (agregar más imágenes) |
| DELETE | `/:id` | Eliminar un post |

🔒 = Requiere autenticación (JWT)

## 🗂️ Estructura del proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── decorators/          # Decoradores personalizados
│   ├── dto/                 # Data Transfer Objects
│   ├── guards/              # Guards de autenticación
│   ├── auth.controller.ts   # Controlador de auth
│   ├── auth.module.ts       # Módulo de auth
│   ├── IAuthService.ts      # Interfaz de controllers
│   └── auth.service.ts      # Servicio de auth
├── common/                  # Utilidades comunes
│   ├── multer/              # Configuración de uploads
│   ├── mailer/              # Servicio de emails
│   └── types/               # Tipos e interfaces
├── database/                # Configuración de base de datos
│   ├── migrations/          # Archivos de migraciones
│   ├── data-source.ts       # Configuración para TypeORM CLI
│   └── typeorm.config.ts    # Configuración de TypeORM
├── jwt/                     # Módulo de JWT
├── posts/                   # Módulo de publicaciones
│   ├── dto/                 # DTOs de posts
│   ├── entities/            # Entidad Post
│   ├── posts.controller.ts  # Controlador de posts
│   ├── IPostsService.ts     # Interfaz de controllers
│   ├── posts.module.ts      # Módulo de posts
│   └── posts.service.ts     # Servicio de posts
├── users/                   # Módulo de usuarios
│   ├── dto/                 # DTOs de usuarios
│   ├── entities/            # Entidad User
│   ├── users.controller.ts  # Controlador de users
│   ├── IUsersService.ts     # Interfaz de controllers
│   ├── users.module.ts      # Módulo de users
│   └── users.service.ts     # Servicio de users
├── utils/                   # Funciones utilitarias
├── app.module.ts            # Módulo principal
└── main.ts                  # Punto de entrada
```

## 🛠️ Tecnologías utilizadas

- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos
- **Nodemailer** - Envío de emails
- **JWT** - Autenticación con tokens
- **bcrypt** - Encriptación de contraseñas
- **class-validator** - Validación de DTOs
- **Multer** - Carga de archivos e imágenes

## 📝 Notas adicionales

- El servidor corre por defecto en el puerto `3000` (o el especificado en `PORT`)
- Se utiliza SSL para la conexión a la base de datos
- **Migraciones**: El proyecto usa `synchronize: false` y gestiona cambios mediante migraciones de TypeORM, pasarlo a true para pruebas en desarrollo
- Las imágenes subidas se almacenan en `/uploads/posts/` y son accesibles via `/uploads/posts/[filename]`
- Las imágenes de perfil se almacenan en `/uploads/users/`
- El directorio `uploads` está en `.gitignore` para no versionar archivos subidos. Esto deberia reemplazarse por un servicio en la nube
- Usuario demo disponible: `demo@example.com` / `password123` (creado automáticamente con `pnpm migration:run`)