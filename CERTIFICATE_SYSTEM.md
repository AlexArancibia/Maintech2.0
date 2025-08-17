# Sistema de Certificados - MainTech

## Descripción General

El sistema de certificados permite a los usuarios generar certificados únicos al completar cursos al 100%. Cada certificado tiene un código único que puede ser verificado públicamente.

## Características Principales

### 1. Generación Automática de Certificados
- Los certificados se crean automáticamente cuando un usuario completa un curso al 100%
- Solo se crea una vez por usuario por curso
- Se almacena en la base de datos con todos los campos requeridos

### 2. Código Único de Certificado
- Cada certificado tiene un código único generado automáticamente
- Formato: `CERT-{timestamp}-{randomString}` (ej: `CERT-LM5FO78ZzGMAei7wngkaAp`)
- El código se muestra en el PDF del certificado
- Permite verificación pública de autenticidad

### 3. Campos del Certificado
- **course**: Relación con el curso completado
- **users_permissions_user**: Relación con el usuario que completó el curso
- **finished_date**: Fecha de finalización del curso
- **qualification**: Calificación (siempre 100% para certificados)
- **certificateCode**: Código único del certificado

## Flujo de Usuario

### 1. Completar Curso
- El usuario debe completar el 100% del curso
- El botón "Generar Certificado" aparece automáticamente

### 2. Generar Certificado
- Al hacer clic en "Generar Certificado":
  1. Se verifica si ya existe un certificado
  2. Si no existe, se crea en la base de datos
  3. Se genera el PDF con el código único
  4. Se descarga automáticamente

### 3. Acceso al Certificado
- Una vez generado, el usuario ve la información del certificado
- Puede copiar el código único
- Puede descargar el PDF nuevamente
- Puede verificar el certificado públicamente

## Verificación de Certificados

### Página de Verificación
- URL: `/verificar-certificado`
- Permite a cualquier persona verificar un certificado usando el código
- Muestra toda la información del certificado si es válido
- Accesible desde el footer del sitio

### Proceso de Verificación
1. Ingresar el código del certificado
2. El sistema busca en la base de datos
3. Si se encuentra, muestra la información completa
4. Si no se encuentra, muestra un mensaje de error

## Componentes del Sistema

### Frontend
- **CourseProgress.tsx**: Maneja la generación inicial del certificado
- **CertificateInfo.tsx**: Muestra información del certificado existente
- **certificateAPI.ts**: Hook para todas las operaciones de certificados
- **VerificarCertificado**: Página pública de verificación

### Backend (Strapi)
- **API de Certificados**: Endpoints para crear y consultar certificados
- **Esquema de Base de Datos**: Estructura de la tabla certificates
- **Relaciones**: Conexiones con cursos y usuarios

## Seguridad y Validación

### Validaciones
- Solo usuarios autenticados pueden generar certificados
- Solo se puede generar un certificado por curso por usuario
- Se verifica que el progreso sea 100% antes de permitir generación

### Prevención de Duplicados
- Verificación automática de certificados existentes
- Códigos únicos generados con timestamp y string aleatorio
- Relaciones únicas entre usuario y curso

## Uso del Sistema

### Para Usuarios
1. Completar curso al 100%
2. Hacer clic en "Generar Certificado"
3. Descargar PDF con código único
4. Compartir código para verificación

### Para Verificadores
1. Ir a `/verificar-certificado`
2. Ingresar código del certificado
3. Ver información completa del certificado
4. Confirmar autenticidad

## Mantenimiento

### Monitoreo
- Revisar logs de creación de certificados
- Verificar que no se dupliquen códigos
- Monitorear uso de la página de verificación

### Backup
- Los certificados se almacenan en la base de datos principal
- Considerar backup regular de la tabla certificates
- Mantener respaldo de los PDFs generados

## Consideraciones Técnicas

### Rendimiento
- Los certificados se generan bajo demanda
- La verificación es rápida gracias a índices en certificateCode
- Los PDFs se generan en el cliente para reducir carga del servidor

### Escalabilidad
- El sistema puede manejar múltiples certificados simultáneos
- Los códigos únicos evitan colisiones
- La estructura de base de datos es eficiente para consultas

## Troubleshooting

### Problemas Comunes
1. **Error al generar certificado**: Verificar progreso del curso y permisos de usuario
2. **Código no encontrado**: Verificar que el código esté correctamente copiado
3. **PDF no se descarga**: Verificar permisos del navegador y conexión a internet

### Logs Útiles
- Console del navegador para errores de generación
- Logs del servidor para errores de base de datos
- Network tab para verificar llamadas a la API
