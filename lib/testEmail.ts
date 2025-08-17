import { sendWelcomeEmail, sendTeacherNotificationEmail } from './welcomeEmails'

/**
 * Función de prueba para verificar el sistema de correos
 * Solo usar en desarrollo
 */
export const testEmailSystem = async () => {
  console.log('🧪 Iniciando pruebas del sistema de correos...')
  
  try {
    // Prueba 1: Correo de bienvenida para estudiante
    console.log('📧 Probando correo de bienvenida para estudiante...')
    await sendWelcomeEmail({
      username: 'Juan Pérez',
      email: 'juan.perez@example.com',
      isTeacher: false
    })
    console.log('✅ Correo de estudiante enviado correctamente')
    
    // Prueba 2: Correo de bienvenida para profesor
    console.log('📧 Probando correo de bienvenida para profesor...')
    await sendWelcomeEmail({
      username: 'María García',
      email: 'maria.garcia@example.com',
      isTeacher: true
    })
    console.log('✅ Correo de profesor enviado correctamente')
    
    // Prueba 3: Notificación de asignación de curso
    console.log('📧 Probando notificación de asignación de curso...')
    await sendTeacherNotificationEmail({
      username: 'Carlos López',
      email: 'carlos.lopez@example.com',
      courseTitle: 'Desarrollo Web con React'
    })
    console.log('✅ Notificación de curso enviada correctamente')
    
    // Prueba 4: Notificación de promoción a instructor
    console.log('📧 Probando notificación de promoción...')
    await sendTeacherNotificationEmail({
      username: 'Ana Rodríguez',
      email: 'ana.rodriguez@example.com'
    })
    console.log('✅ Notificación de promoción enviada correctamente')
    
    console.log('🎉 Todas las pruebas del sistema de correos fueron exitosas!')
    
  } catch (error) {
    console.error('❌ Error en las pruebas del sistema de correos:', error)
    throw error
  }
}

/**
 * Función para probar un correo específico
 */
export const testSpecificEmail = async (
  type: 'welcome-student' | 'welcome-teacher' | 'course-assignment' | 'promotion',
  email: string,
  username: string,
  courseTitle?: string
) => {
  console.log(`🧪 Probando correo tipo: ${type}`)
  
  try {
    switch (type) {
      case 'welcome-student':
        await sendWelcomeEmail({
          username,
          email,
          isTeacher: false
        })
        break
        
      case 'welcome-teacher':
        await sendWelcomeEmail({
          username,
          email,
          isTeacher: true
        })
        break
        
      case 'course-assignment':
        if (!courseTitle) {
          throw new Error('Se requiere courseTitle para este tipo de correo')
        }
        await sendTeacherNotificationEmail({
          username,
          email,
          courseTitle
        })
        break
        
      case 'promotion':
        await sendTeacherNotificationEmail({
          username,
          email
        })
        break
        
      default:
        throw new Error(`Tipo de correo no válido: ${type}`)
    }
    
    console.log(`✅ Correo ${type} enviado correctamente a ${email}`)
    
  } catch (error) {
    console.error(`❌ Error enviando correo ${type}:`, error)
    throw error
  }
}

// Ejemplo de uso (descomentar para probar):
/*
// Probar todo el sistema
testEmailSystem().catch(console.error)

// Probar un correo específico
testSpecificEmail(
  'welcome-student',
  'tu-email@example.com',
  'Tu Nombre'
).catch(console.error)
*/

