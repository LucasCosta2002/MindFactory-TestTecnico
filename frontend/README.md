# Frontend - MindFactory

## Resumen
Frontend en React + Vite + TypeScript con React Router, React Query, React Hook Form, Zod y TailwindCSS. Incluye módulos para autenticación, perfil de usuario y funcionalidades sociales (feed, detalle de post, explorar, likes, edición y eliminación).

## Variables de entorno
Crear un archivo `.env` con:

```
VITE_API_URL=http://localhost:3000/api
```

> Se usa `VITE_API_URL` para el cliente Axios y para construir URLs públicas de imágenes.

## Estructura del proyecto

```
src/
  App.tsx                 // Rutas principales
  main.tsx                // Entry
  NotFound.tsx            // 404
  axios/                  // Instancia Axios + interceptores
  auth/                   // Módulo Auth
  social/                 // Módulo Social (posts, feed, explore)
  user/                   // Módulo User (perfil, búsqueda)
  components/             // UI global y navegación
  hooks/                  // Hooks globales
  lib/                    // Utilidades (cn, etc.)
  types/                  // Zod schemas y types compartidos
  utils/                  // Helpers generales
```

### auth/
- `actions/`: llamadas HTTP a `/auth/*`.
- `hooks/`: lógica de auth (`useAuth`, `useAuthCheck`).
- `layout/`: layout de pantallas de autenticación.
- `pages/`: Login, Register, Forgot, Reset, ConfirmToken.
- `components/`: `ProtectedRoute` para rutas privadas.

### social/
- `actions/`: CRUD de posts, obtener posts por cursor, likes.
- `hooks/`: queries y mutations (React Query).
- `components/`: UI de posts, header, footer, modales de edición/eliminación.
- `layout/`: `SocialLayout`.
- `pages/`: Feed, Explore, Post detail.

### user/
- `actions/`: obtener usuario, buscar usuarios, actualizar datos e imagen.
- `hooks/`: queries y mutations del perfil y buscador.
- `components/`: header, banner, tabs, panel, etc.
- `pages/`: Profile.

### components/
- UI reutilizable y navegación (`Navigation`, `CustomNavigationMobile`, `UserSearch`).
- `ui/`: componentes shadcn (button, dialog, form, tabs, etc.).

### axios/
- Instancia `api` con `baseURL` en `VITE_API_URL`.
- Interceptor request agrega `Authorization: Bearer <token>`.
- Interceptor response limpia sesión y redirige a `/login` en 401.

## Ruteo
Definido en `App.tsx`:

- Público (AuthLayout):
  - `/login`
  - `/register`
  - `/confirm-account/:token`
  - `/forgot-password`
  - `/reset-password/:token`
- Privado (ProtectedRoute):
  - `/` (Feed)
  - `/explore`
  - `/post/:id`
  - `/profile/:id`

## Flujo de autenticación (Auth)

### Login
1. El usuario envía email/contraseña.
2. `loginAction` llama `POST /auth/login`.
3. `useAuth.login` guarda `token` y `user` en `localStorage`.
4. Rutas privadas usan `ProtectedRoute` para validar el token.

### Registro y confirmación
1. `registerAction` llama `POST /auth/register`.
2. Confirmación: `confirmAccountAction` llama `POST /auth/confirm-account` con token.

### Forgot/Reset Password
1. `forgotPasswordAction` envía email a `POST /auth/forgot-password`.
2. `resetPasswordAction` envía token + nueva contraseña a `POST /auth/reset-password/:token`.

### Validación de sesión
- `useAuthCheck` intenta `GET /auth/me` y, si falla, limpia `localStorage`.
- El interceptor de Axios también limpia sesión en 401 y redirige a `/login`.

## Flujo de usuario (User)

### Perfil
- Página `/profile/:id`.
- `useUser` obtiene datos con `getUserAction` (`GET /user/:id`).
- Se normalizan URLs de imágenes (perfil y posts) usando `VITE_API_URL`.

### Actualización de datos
- `updateUserAction` (`PATCH /user/:id`) para datos básicos.
- `updateProfileImageAction` (`PATCH /user/:id/profile-image`) usando `multipart/form-data`.
- `useUpdateUserMutation` invalida cache de React Query al completar.

### Búsqueda de usuarios
- `useUserSearch` aplica debounce y llama `GET /user?q=...`.
- Respuestas normalizadas con URLs absolutas para imágenes.

## Flujo social (Social)

### Feed + Exploración
- `useSocial` usa `useInfiniteQuery` con cursor para `/posts`.
- Parámetros: `cursor`, `limit`, `search`.
- `Explore` usa búsqueda con debounce; `Feed` lista general.

### Post detail
- `usePost` consulta `GET /posts/:id`.
- Normaliza URLs de imágenes y `profileImage` del autor.

### Crear post
- `createPostAction` envía `multipart/form-data` a `POST /posts/create`.
- Soporta `title`, `content` e `images[]`.
- Al completar, invalida `posts` y el usuario creador.

### Editar post
- `updatePostAction` envía `PATCH /posts/:id` con `multipart/form-data`.
- Permite `images[]` nuevas y `removeImages[]`.
- Invalida `posts`, `post/:id` y `user/:id`.

### Eliminar post
- `deletePostAction` llama `DELETE /posts/:id`.
- Invalida listas y el detalle del post.

### Likes
- `toggleLikeAction`:
  - `POST /posts/:id/like` (dar like)
  - `DELETE /posts/:id/like` (quitar like)
- Invalida queries de `posts`, `post/:id` y `user/:id`.

### Compartir
- En `PostFooter` hay un botón “WhatsApp” que abre:
  - `https://wa.me/?text=<url-del-post>`

## Manejo de tipos y validación
- `types/` contiene schemas Zod para Auth, User y Social.
- Las acciones validan respuestas del API antes de devolver datos a la UI.

## Estado y caché
- React Query administra el cache de listas, detalle y usuario.
- Mutations invalidan queries relacionadas para refrescar la UI.

## UI/UX
- TailwindCSS + componentes shadcn.
- Sonner para toasts.
- Framer Motion para animaciones suaves.

## Scripts útiles
```
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm test
```
