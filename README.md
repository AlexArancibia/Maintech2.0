# Maintech 2.0

Plataforma de cursos online con integración de pagos.

## Configuración de Mercado Pago

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Agrega estas variables a tu archivo `.env.local` existente:

```env
# Mercado Pago Configuration
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=tu_clave_secreta_de_webhook

# App Configuration (si no la tienes)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Nota:** Ya tienes configuradas las variables de Strapi (`NEXT_PUBLIC_STRAPI_ENDPOINT`, etc.)

### 3. Configurar Webhooks en Mercado Pago
1. Ve a tu cuenta de Mercado Pago Developer
2. Configura el webhook URL: `https://tu-dominio-ngrok.ngrok.io/api/payment/webhook`
3. Selecciona los eventos: `payment.created`, `payment.updated`
4. Copia la clave secreta y agrégala a `MERCADOPAGO_WEBHOOK_SECRET`

### 4. Ejecutar el proyecto
```bash
npm run dev
```

## Funcionalidades

### Sistema de Pagos
- ✅ Integración completa con Mercado Pago
- ✅ Modo test para desarrollo
- ✅ Webhooks para confirmación automática
- ✅ Manejo de pagos exitosos, fallidos y pendientes
- ✅ Enlace automático de cursos después del pago

### Flujo de Pago
1. Usuario selecciona curso y método de pago
2. Se crea preferencia de pago en Mercado Pago
3. Se abre nueva pestaña para completar el pago
4. Webhook recibe confirmación y enlaza el curso
5. Usuario es redirigido al dashboard con confirmación

## Estructura de Archivos

```
lib/
├── mercadopago.ts          # Funciones de integración con Mercado Pago
└── axios.ts               # Configuración de cliente HTTP

app/api/payment/
├── create-preference/     # Crear preferencias de pago
├── webhook/              # Manejar webhooks de Mercado Pago
├── success/              # Pagos exitosos
├── failure/              # Pagos fallidos
└── pending/              # Pagos pendientes

app/(general)/checkout/
└── [courseId]/           # Página de checkout
```

## Modo Test vs Producción

### Modo Test (Desarrollo)
- Usa credenciales de sandbox
- Simula pagos automáticamente
- No requiere tarjeta real

### Modo Producción
- Usa credenciales reales
- Abre pestaña de Mercado Pago
- Procesa pagos reales
- Webhooks para confirmación

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```
