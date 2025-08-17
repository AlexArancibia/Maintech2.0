# Configuración del Sistema de Correos Automáticos

Este documento explica cómo configurar el sistema de correos automáticos para Maintech.

## 🏗️ Arquitectura del Sistema

El sistema está diseñado para funcionar correctamente con Next.js:

- **API Routes**: Manejan el envío de correos desde el servidor
- **Hooks del Cliente**: Proporcionan una interfaz limpia para el frontend
- **Separación de Responsabilidades**: El cliente nunca importa módulos del servidor

### Estructura de Archivos
```
app/
├── api/
│   └── send-welcome-email/
│       └── route.ts          # API route para envío de correos
├── (general)/
│   ├── sign-on/              # Registro de usuarios
│   └── checkout/             # Creación de usuarios en checkout
hooks/
└── useEmailService.ts        # Hook para manejo de correos
lib/
├── mail.utils.ts             # Configuración SMTP (solo servidor)
└── welcomeEmails.ts          # Funciones de correos (solo servidor)
types/
└── email.d.ts                # Tipos TypeScript para nodemailer
```

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
# Configuración del servidor de correo
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=tu-email@gmail.com
MAIL_PASSWORD=tu-contraseña-de-aplicacion

# Otras configuraciones
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Configuración de Gmail

Para usar Gmail como servidor SMTP:

1. **Habilitar la verificación en dos pasos** en tu cuenta de Google
2. **Generar una contraseña de aplicación**:
   - Ve a la configuración de tu cuenta de Google
   - Seguridad > Verificación en dos pasos
   - Contraseñas de aplicación
   - Genera una nueva contraseña para "Correo"
3. **Usa esa contraseña** en la variable `MAIL_PASSWORD`

## Otros Proveedores de Correo

### Outlook/Hotmail
```bash
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USER=tu-email@outlook.com
MAIL_PASSWORD=tu-contraseña
```

### SendGrid
```bash
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASSWORD=tu-api-key-de-sendgrid
```

## Funcionalidades Implementadas

### 1. Correo de Bienvenida Automático
- Se envía cuando un usuario se registra
- Diferencia entre profesores y estudiantes
- Diseño responsivo y atractivo
- Incluye próximos pasos personalizados

### 2. Notificación de Instructor
- Se envía cuando se asigna un curso a un profesor
- Notifica cambios de rol de usuario

### 3. Plantillas HTML Personalizadas
- Diseño moderno con gradientes
- Colores de marca de Maintech (#00D1FF)
- Responsive design para móviles
- Fallback a texto plano

### 4. Arquitectura Robusta
- API routes para envío desde servidor
- Hooks del cliente para interfaz limpia
- Manejo de errores graceful
- No falla el registro si falla el correo

## Uso del Sistema

### En el Frontend (Componentes React)

```typescript
import { useEmailService } from '@/hooks/useEmailService'

const MyComponent = () => {
  const { sendWelcomeEmail, isLoading, error } = useEmailService()
  
  const handleRegistration = async () => {
    const result = await sendWelcomeEmail({
      username: 'Juan Pérez',
      email: 'juan@example.com',
      isTeacher: false
    })
    
    if (result.success) {
      console.log('Correo enviado exitosamente')
    } else {
      console.error('Error:', result.error)
    }
  }
  
  return (
    <button onClick={handleRegistration} disabled={isLoading}>
      {isLoading ? 'Enviando...' : 'Registrar'}
    </button>
  )
}
```

### En el Backend (API Routes)

```typescript
import { sendWelcomeEmail } from '@/lib/welcomeEmails'

export async function POST(request: NextRequest) {
  const { username, email, isTeacher } = await request.json()
  
  try {
    await sendWelcomeEmail({ username, email, isTeacher })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al enviar correo' }, { status: 500 })
  }
}
```

## Archivos del Sistema

- `app/api/send-welcome-email/route.ts` - API route para envío de correos
- `hooks/useEmailService.ts` - Hook del cliente para manejo de correos
- `lib/mail.utils.ts` - Configuración del transportador SMTP
- `lib/welcomeEmails.ts` - Funciones para correos de bienvenida
- `types/email.d.ts` - Tipos TypeScript para nodemailer
- `next.config.ts` - Configuración de webpack para módulos del servidor

## Pruebas

Para probar el sistema:

1. Configura las variables de entorno
2. Inicia el servidor de desarrollo
3. Registra un nuevo usuario
4. Verifica que llegue el correo de bienvenida
5. Revisa los logs en la consola del servidor

## Solución de Problemas

### Error de Módulo 'fs' no encontrado
- **Causa**: Intentar importar módulos del servidor en el cliente
- **Solución**: Usar el hook `useEmailService` en lugar de importar directamente
- **Verificar**: Que `next.config.ts` tenga la configuración de webpack

### Error de Autenticación
- Verifica que `MAIL_USER` y `MAIL_PASSWORD` sean correctos
- Asegúrate de usar contraseñas de aplicación para Gmail

### Error de Conexión
- Verifica que `MAIL_HOST` y `MAIL_PORT` sean correctos
- Asegúrate de que el firewall no bloquee la conexión

### Correos no llegan
- Revisa la carpeta de spam
- Verifica los logs en la consola del servidor
- Confirma que el servidor SMTP esté funcionando

## Personalización

### Cambiar Colores
Modifica las variables CSS en `welcomeEmails.ts`:
```typescript
// Color principal de Maintech
const primaryColor = '#00D1FF'
const secondaryColor = '#0099CC'
```

### Cambiar Contenido
Edita las funciones en `welcomeEmails.ts` para personalizar:
- Mensajes de bienvenida
- Próximos pasos
- Información de contacto
- Logo y branding

## Seguridad

- Nunca commits archivos `.env` al repositorio
- Usa contraseñas de aplicación en lugar de contraseñas principales
- Considera usar servicios de correo transaccional para producción
- Implementa rate limiting para evitar spam
- Las API routes están protegidas por defecto en Next.js

## Monitoreo y Logs

### Logs del Servidor
Los correos se registran en la consola del servidor:
```
✅ Correo de bienvenida enviado exitosamente a usuario@email.com
❌ Error al enviar email: Error de autenticación SMTP
```

### Logs del Cliente
El hook proporciona estado de carga y errores:
```typescript
const { isLoading, error, clearError } = useEmailService()
```

## Para Producción

### Consideraciones de Escalabilidad
- Implementar colas de correos (Redis, Bull)
- Usar servicios de correo transaccional (SendGrid, Mailgun)
- Implementar rate limiting y throttling
- Monitorear métricas de entrega

### Configuración de Seguridad
- Variables de entorno en el servidor de producción
- HTTPS obligatorio
- Validación de entrada en API routes
- Logs de auditoría para correos enviados
