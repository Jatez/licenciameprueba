# Licenciame — Setup de OAuth y Apps Externas (Manual definitivo)

> Última actualización: 2026-05-11
> Estado: validado en producción local con Instagram + TikTok conectados.

Este documento describe **exactamente** cómo crear las apps de Meta (Instagram + Facebook) y TikTok desde cero, qué se llena en cada paso y los errores comunes con su fix.

---

## Arquitectura general

```
       Usuario (browser)
              │
              │  http://localhost:8080  (Vite dev)
              ▼
       Frontend (React)  ── llama API ──▶  Backend (FastAPI :8000)
                                                │
                                                │ genera auth_url y redirige
                                                ▼
                           ┌──────────┬───────────┬──────────┐
                           ▼          ▼           ▼          ▼
                      Instagram   Facebook    TikTok     ACRCloud
                                                │
                       ngrok https tunnel ◀────┘
                       (gregory-quittable-tyra.ngrok-free.dev)
                                  │
                                  ▼
                            Backend callback
```

**Punto crítico:** Las URLs de callback **deben** ser HTTPS públicas. Por eso usamos ngrok con dominio reservado (`gregory-quittable-tyra.ngrok-free.dev`).

---

## 1. Meta (Instagram + Facebook)

### 1.1 Crear la app

1. https://developers.facebook.com/apps/ → **Crear app**
2. **Tipo de app**: **Negocios** ✅
   (NO consumidor — consumidor no soporta Instagram con Instagram Login)
3. **Detalles**: nombre cualquiera, email de contacto, vincula a tu portfolio comercial si tienes
4. **Casos de uso (Use case)**: marca **"Otro"** (filtro "Otros")
   ❌ NO marques "Administrar mensajes y contenido en Instagram" en este paso — eso predefine una plataforma incompatible y causa "Invalid platform app".
5. Termina el wizard.

> Resultado: app de tipo Negocios, sin productos preconfigurados, en modo Desarrollo.

### 1.2 Agregar el producto Instagram

1. Panel de la app → **Productos** → tarjeta **Instagram** → **Configurar**
2. Cuando te pregunte el setup, elige **"API setup with Instagram Login"**
3. Instagram crea automáticamente un **App ID hijo** y **App Secret hijo** distintos del Meta padre.
   👉 Estas son las credenciales que usa el flujo de Instagram, NO las del Meta padre.
4. Pestaña **"Business Login Settings"** → sección **OAuth Redirect URIs** → agrega exactamente:
   ```
   https://gregory-quittable-tyra.ngrok-free.dev/api/v2/auth/meta/callback
   ```
5. **Deauthorize Callback URL** y **Data Deletion Request URL**: puedes poner la misma URL para Desarrollo.
6. **Permisos** activos (sección "Permissions"):
   - `instagram_business_basic`
   - `instagram_business_manage_insights`
7. **Guardar.**

### 1.3 Agregar el producto Facebook Login (clásico)

1. Panel → **Productos → + Agregar producto** → busca **"Inicio de sesión con Facebook"** (sin "para empresas").
   - Si solo te aparece **"Facebook Login for Business"**, usa ese — pero NO necesitas crear "Configuración" interna; solo configurar "Settings".
2. Productos → **Inicio de sesión con Facebook → Configuración (Settings)**:
   - **Inicio de sesión del cliente de OAuth**: SÍ
   - **Inicio de sesión de OAuth web**: SÍ
   - **Aplicar HTTPS**: SÍ
   - **Usar modo estricto para URI de redireccionamiento**: SÍ
   - **URI de redireccionamiento de OAuth válidos**:
     ```
     https://gregory-quittable-tyra.ngrok-free.dev/api/v2/auth/meta/fb-callback
     ```
3. **Guardar.**

> Ignora el warning sobre "acceso avanzado para Facebook Login for Business". Con Acceso Estándar el login clásico funciona para todos los usuarios con rol en la app.

### 1.4 Configuración básica de la app padre

Menú izquierdo → **Configuración de la app → Básica**:

- **Dominios de la app**:
  ```
  gregory-quittable-tyra.ngrok-free.dev
  ```
- **URL de política de privacidad** (obligatoria): cualquiera funciona en Desarrollo, ej:
  ```
  https://gregory-quittable-tyra.ngrok-free.dev/privacy
  ```
- **Categoría**: Música o Empresas — cualquiera funciona.
- **Guardar cambios**

### 1.5 Agregar testers / roles

#### Para Instagram

1. **Roles de la app → Roles** → baja a sección **"Instagram Testers"**.
2. Click **"Add Instagram Testers"** → escribe el `@handle` de tu cuenta IG **sin la @**.
3. Acepta la invitación desde la app de Instagram:
   - Perfil → menú → Configuración → **Apps y sitios web** → pestaña **"Tester Invites"** → Accept.

#### Para Facebook

1. **Roles de la app → Roles** → sección **"Administradores"** o **"Desarrolladores"**.
2. Agrega tu cuenta FB por nombre o email.
3. Acepta en https://developers.facebook.com/settings/developer/requests/ o en la campana de notificaciones de Facebook.

### 1.6 Credenciales a llenar en `.env`

```env
# Instagram — usa el App ID HIJO del producto Instagram (no el Meta padre)
META_APP_ID=<id hijo de Instagram>
META_APP_SECRET=<secret hijo de Instagram>
META_REDIRECT_URI=https://gregory-quittable-tyra.ngrok-free.dev/api/v2/auth/meta/callback

# Facebook Login — usa el App ID PADRE del Meta
FB_APP_ID=<id del Meta padre>
FB_APP_SECRET=<secret del Meta padre>
META_FB_REDIRECT_URI=https://gregory-quittable-tyra.ngrok-free.dev/api/v2/auth/meta/fb-callback
```

> ⚠️ **Lección aprendida hoy:** Es muy común equivocarse y usar las credenciales del Meta padre para Instagram. Esto causa "Invalid platform app". Siempre verifica los IDs/secret del producto Instagram en su pantalla específica (no en Configuración → Básica).

---

## 2. TikTok

### 2.1 Crear la app

1. https://developers.tiktok.com/ → **Manage apps → Connect an app**
2. Llena nombre, descripción, categoría, logo.
3. Tipo de plataforma: **Web**

### 2.2 Configurar Login Kit

1. En la app → pestaña **Login Kit** → activar.
2. **Redirect URI**:
   ```
   https://gregory-quittable-tyra.ngrok-free.dev/api/v2/auth/tiktok/callback
   ```
   (sin slash final, https, sin espacios)
3. **Scopes**:
   - `user.info.basic`
   - `video.list`
4. Guardar.

### 2.3 URL Properties (verificación de dominio)

1. Pestaña **URL Properties** → **Add property**
2. Dominio: `gregory-quittable-tyra.ngrok-free.dev`
3. TikTok pide verificación: archivo `.txt` o meta tag.
   - **Método archivo**: descargas el `.txt` y lo subes a la raíz del backend para que sea servido en esa ruta.
   - **Método meta tag**: agregas un `<meta>` al `<head>` de tu frontend.

### 2.4 Sandbox / Testers

Mientras la app esté en **Sandbox** (estado por defecto):

1. Pestaña **Sandbox** → **Target users** o **Test users**
2. Agrega el `@handle` de tu cuenta TikTok personal
3. Acepta la invitación desde TikTok

### 2.5 Credenciales

Las credenciales de TikTok son **del nivel de la app**, no de un producto hijo (a diferencia de Instagram).
En Sandbox empiezan con `sbaw...`. En producción cambian a `aw...`.

```env
TIKTOK_CLIENT_KEY=<client_key>
TIKTOK_CLIENT_SECRET=<client_secret>
TIKTOK_REDIRECT_URI=https://gregory-quittable-tyra.ngrok-free.dev/api/v2/auth/tiktok/callback
```

---

## 3. ACRCloud (reconocimiento de audio)

1. https://console.acrcloud.com/ → crear cuenta
2. Crear un **Project** tipo "Audio Recognition" → "Music"
3. Copia: **Host**, **Access Key**, **Access Secret**.

```env
ACRCLOUD_HOST=identify-us-west-2.acrcloud.com
ACRCLOUD_ACCESS_KEY=<...>
ACRCLOUD_ACCESS_SECRET=<...>
```

> El proyecto actual ya viene con credenciales válidas que reconocen el catálogo global de ACRCloud.

---

## 4. Errores comunes y fix

### Meta / Instagram

| Error | Causa | Fix |
|---|---|---|
| **Invalid platform app** | App padre creada con use case erróneo (ej. "Administrar contenido"); o estás usando credenciales del Meta padre en lugar del Instagram hijo | Crear nueva app con use case "Other" + tipo Negocios + agregar producto Instagram aparte, usar credenciales hijas |
| **Rol de desarrollador insuficiente** | Cuenta IG no está añadida como Instagram Tester (o no aceptaste la invitación) | Roles → Instagram Testers → Add → aceptar desde IG |
| **Invalid Scopes: user_videos** | Scope deprecado por Meta | Quitar `user_videos` (ya no existe). Para acceso a videos usar Pages API |
| **URL Blocked** | Redirect URI no registrada o no exacta | Re-pegar URL exacta en OAuth Redirect URIs, sin slash final |
| **App no disponible** | Cuenta FB sin rol en app + modo Desarrollo | Roles → Admin/Developer → aceptar invitación |

### TikTok

| Error | Causa | Fix |
|---|---|---|
| **client_key (rojo)** | Client key incorrecto, redirect_uri mismatched, o dominio no verificado | Confirmar client_key del panel, redirect URI exacta, dominio verificado en URL Properties |
| **Invalid scope** | Scope no activado en Login Kit | Activar scope en Login Kit → guardar |
| **App not approved** | Cuenta TikTok no es target/test user de la app Sandbox | Sandbox → Target users → Add |

---

## 5. Cómo arrancar todo

```bash
cd "Licenciame Entregar"
./start.sh
```

Esto:
1. Recrea el venv del backend si es necesario (Python 3.12)
2. Arranca uvicorn en `:8000`
3. Arranca ngrok con el dominio reservado
4. Arranca Vite frontend en `:8080`
5. Abre el navegador

Login de prueba: `manager@acme.com / Manager123!`

---

## 6. Si cambias de dominio en el futuro

1. Edita un solo archivo: **`.env`** en la raíz de "Licenciame Entregar".
   Variables a cambiar:
   - `META_REDIRECT_URI`
   - `META_FB_REDIRECT_URI`
   - `TIKTOK_REDIRECT_URI`
   - `FRONTEND_URL`
   - `CORS_ORIGINS` (agregar el nuevo dominio)
2. Re-registrar las nuevas redirect URIs en:
   - Meta → producto Instagram (Business Login Settings)
   - Meta → producto Facebook Login (Settings)
   - TikTok → Login Kit + URL Properties
3. Reiniciar backend (`kill` del proceso uvicorn + `./start.sh`)

---

## 7. Credenciales actuales (ambiente local de desarrollo)

> Estas credenciales son **solo para desarrollo local**. NUNCA commitar a git público.

- **Meta App padre**: licenciame2 (ID 2814735772197661)
- **Instagram (hijo)**: ID 1698570457981827
- **Facebook Login**: mismo Meta padre 2814735772197661
- **TikTok (Sandbox)**: client_key sbaw52ffpzerfj0iq5
