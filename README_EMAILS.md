# Sistema de Correos Automáticos - Maintech

## 🚀 Funcionalidades Implementadas

### ✅ Correos de Bienvenida Automáticos
- **Para Estudiantes**: Reciben información sobre cursos disponibles y próximos pasos
- **Para Profesores**: Reciben información sobre herramientas de instructor y creación de contenido
- **Diseño Responsivo**: Plantillas HTML modernas con el estilo de Maintech

### ✅ Notificaciones de Instructor
- **Asignación de Cursos**: Notifica cuando se asigna un curso a un profesor
- **Cambio de Rol**: Notifica cuando un usuario es promovido a instructor

### ✅ Integración Automática
- **Registro de Usuarios**: Se envía automáticamente al registrarse
- **Checkout**: Se envía al crear cuenta durante la compra
- **Fallback Graceful**: No falla el registro si falla el envío del correo

## 📧 Tipos de Correos

### 1. Correo de Bienvenida para Estudiantes
```
Asunto: ¡Bienvenido a Maintech, [Nombre]!
Contenido:
- Información de la cuenta
- Próximos pasos: explorar cursos, completar perfil
- Botón CTA: "Explorar Cursos"
```

### 2. Correo de Bienvenida para Profesores
```
Asunto: ¡Bienvenido a Maintech, [Nombre]!
Contenido:
- Información de la cuenta
- Próximos pasos: completar perfil, crear cursos
- Botón CTA: "Ir al Panel de Instructor"
```

### 3. Notificación de Asignación de Curso
```
Asunto: Has sido asignado como instructor del curso: [Título del Curso]
Contenido:
- Información del curso asignado
- Fecha de asignación
- Próximos pasos para el instructor
```

### 4. Notificación de Promoción
```
Asunto: Has sido promovido a instructor en Maintech
Contenido:
- Confirmación del nuevo rol
- Acceso a herramientas de instructor
- Próximos pasos recomendados
```

## 🛠️ Configuración

### 1. Variables de Entorno
Crear archivo `.env.local`:
```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=tu-email@gmail.com
MAIL_PASSWORD=tu-contraseña-de-aplicacion
```

### 2. Configuración de Gmail
1. Habilitar verificación en dos pasos
2. Generar contraseña de aplicación
3. Usar esa contraseña en `MAIL_PASSWORD`

## 📁 Estructura de Archivos

```
lib/
├── mail.utils.ts          # Configuración SMTP y template base
├── welcomeEmails.ts       # Funciones de correos automáticos
└── testEmail.ts          # Funciones de prueba

app/
├── (general)/sign-on/     # Registro de usuarios
└── (general)/checkout/    # Creación de usuarios en checkout

documentation/
├── EMAIL_SETUP.md         # Configuración detallada
└── README_EMAILS.md       # Este archivo
```

## 🔧 Uso del Sistema

### Envío Automático (Recomendado)
Los correos se envían automáticamente en:
- Registro de usuarios (`/sign-on`)
- Creación de cuenta en checkout
- Cambios de rol de usuario

### Envío Manual
```typescript
import { sendWelcomeEmail, sendTeacherNotificationEmail } from '@/lib/welcomeEmails'

// Correo de bienvenida
await sendWelcomeEmail({
  username: 'Juan Pérez',
  email: 'juan@example.com',
  isTeacher: false
})

// Notificación de instructor
await sendTeacherNotificationEmail({
  username: 'María García',
  email: 'maria@example.com',
  courseTitle: 'React Avanzado'
})
```

## 🧪 Pruebas

### Probar Todo el Sistema
```typescript
import { testEmailSystem } from '@/lib/testEmail'

// Ejecutar en consola del navegador o en desarrollo
await testEmailSystem()
```

### Probar Correo Específico
```typescript
import { testSpecificEmail } from '@/lib/testEmail'

await testSpecificEmail(
  'welcome-student',
  'test@example.com',
  'Usuario Test'
)
```

## 🎨 Personalización

### Colores de Marca
Los colores principales de Maintech están en:
- **Primario**: `#00D1FF` (azul claro)
- **Secundario**: `#0099CC` (azul oscuro)
- **Gradientes**: Combinaciones de azules y púrpuras

### Modificar Contenido
Editar `lib/welcomeEmails.ts`:
- Mensajes de bienvenida
- Próximos pasos
- Información de contacto
- Logo y branding

### Modificar Estilo
Editar CSS en las funciones:
- Colores y gradientes
- Tipografías
- Espaciado y layout
- Responsive design

## 🚨 Solución de Problemas

### Correos no llegan
1. Verificar variables de entorno
2. Revisar carpeta de spam
3. Verificar logs en consola
4. Confirmar configuración SMTP

### Error de Autenticación
1. Usar contraseñas de aplicación (Gmail)
2. Verificar usuario y contraseña
3. Habilitar verificación en dos pasos

### Error de Conexión
1. Verificar host y puerto
2. Revisar firewall
3. Probar con otros proveedores SMTP

## 📊 Monitoreo

### Logs en Consola
El sistema registra:
- ✅ Envíos exitosos
- ❌ Errores de envío
- 📧 Detalles de cada correo

### Métricas Recomendadas
- Tasa de entrega exitosa
- Tiempo de entrega
- Errores por tipo
- Uso por tipo de correo

## 🔒 Seguridad

### Mejores Prácticas
- Usar contraseñas de aplicación
- No committear archivos `.env`
- Implementar rate limiting
- Validar direcciones de correo

### Para Producción
- Usar servicios de correo transaccional
- Implementar autenticación robusta
- Monitorear logs de seguridad
- Backup de configuraciones

## 📈 Próximas Mejoras

### Funcionalidades Planificadas
- [ ] Plantillas de correo personalizables
- [ ] Sistema de colas para envíos masivos
- [ ] Tracking de apertura y clics
- [ ] A/B testing de plantillas
- [ ] Integración con CRM

### Optimizaciones
- [ ] Caché de plantillas
- [ ] Compresión de imágenes
- [ ] CDN para assets
- [ ] Métricas en tiempo real

## 📞 Soporte

Para problemas o preguntas:
- Revisar `EMAIL_SETUP.md`
- Verificar logs en consola
- Contactar al equipo de desarrollo
- Crear issue en el repositorio

---

**Nota**: Este sistema está diseñado para ser robusto y no fallar si hay problemas con el envío de correos. Los usuarios siempre pueden registrarse exitosamente, independientemente del estado del sistema de correos.

