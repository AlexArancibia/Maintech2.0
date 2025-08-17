/**
 * Funciones de prueba para la API de correos
 * Solo usar en desarrollo
 */

interface TestEmailData {
  username: string
  email: string
  isTeacher?: boolean
  courseTitle?: string
}

/**
 * Prueba la API de correos de bienvenida
 */
export const testWelcomeEmailAPI = async (data: TestEmailData) => {
  console.log('🧪 Probando API de correo de bienvenida...')
  
  try {
    const response = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'welcome',
        username: data.username,
        email: data.email,
        isTeacher: data.isTeacher || false
      }),
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ API de correo de bienvenida funcionando:', result)
      return { success: true, data: result }
    } else {
      console.error('❌ Error en API de correo de bienvenida:', result)
      return { success: false, error: result.error }
    }
    
  } catch (error) {
    console.error('❌ Error de conexión con API:', error)
    return { success: false, error: 'Error de conexión' }
  }
}

/**
 * Prueba la API de notificación de instructor
 */
export const testTeacherNotificationAPI = async (data: TestEmailData) => {
  console.log('🧪 Probando API de notificación de instructor...')
  
  try {
    const response = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'teacher-notification',
        username: data.username,
        email: data.email,
        courseTitle: data.courseTitle
      }),
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ API de notificación de instructor funcionando:', result)
      return { success: true, data: result }
    } else {
      console.error('❌ Error en API de notificación de instructor:', result)
      return { success: false, error: result.error }
    }
    
  } catch (error) {
    console.error('❌ Error de conexión con API:', error)
    return { success: false, error: 'Error de conexión' }
  }
}

/**
 * Prueba completa del sistema de correos
 */
export const testCompleteEmailSystem = async () => {
  console.log('🧪 Iniciando pruebas completas del sistema de correos...')
  
  const testCases = [
    {
      name: 'Correo de bienvenida para estudiante',
      data: { username: 'Juan Pérez', email: 'juan.perez@example.com', isTeacher: false },
      type: 'welcome' as const
    },
    {
      name: 'Correo de bienvenida para profesor',
      data: { username: 'María García', email: 'maria.garcia@example.com', isTeacher: true },
      type: 'welcome' as const
    },
    {
      name: 'Notificación de asignación de curso',
      data: { username: 'Carlos López', email: 'carlos.lopez@example.com', courseTitle: 'React Avanzado' },
      type: 'teacher-notification' as const
    },
    {
      name: 'Notificación de promoción',
      data: { username: 'Ana Rodríguez', email: 'ana.rodriguez@example.com' },
      type: 'teacher-notification' as const
    }
  ]
  
  const results = []
  
  for (const testCase of testCases) {
    console.log(`\n📧 Probando: ${testCase.name}`)
    
    let result
    if (testCase.type === 'welcome') {
      result = await testWelcomeEmailAPI(testCase.data)
    } else {
      result = await testTeacherNotificationAPI(testCase.data)
    }
    
    results.push({
      test: testCase.name,
      success: result.success,
      error: result.error
    })
    
    // Esperar un poco entre pruebas para no sobrecargar el servidor
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n📊 Resumen de pruebas:')
  const successfulTests = results.filter(r => r.success).length
  const totalTests = results.length
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${result.test}: ${result.success ? 'Exitoso' : result.error}`)
  })
  
  console.log(`\n🎯 Resultado: ${successfulTests}/${totalTests} pruebas exitosas`)
  
  if (successfulTests === totalTests) {
    console.log('🎉 ¡Todas las pruebas del sistema de correos fueron exitosas!')
  } else {
    console.log('⚠️ Algunas pruebas fallaron. Revisa los logs para más detalles.')
  }
  
  return results
}

/**
 * Función para probar desde la consola del navegador
 */
export const runEmailTests = () => {
  console.log('🚀 Sistema de pruebas de correos iniciado')
  console.log('Comandos disponibles:')
  console.log('- testWelcomeEmailAPI({ username: "Test", email: "test@example.com", isTeacher: false })')
  console.log('- testTeacherNotificationAPI({ username: "Test", email: "test@example.com", courseTitle: "Curso Test" })')
  console.log('- testCompleteEmailSystem()')
  console.log('- runEmailTests() - Muestra este mensaje')
}

// Ejemplo de uso (descomentar para probar):
/*
// Probar correo de bienvenida
testWelcomeEmailAPI({
  username: 'Usuario Test',
  email: 'test@example.com',
  isTeacher: false
})

// Probar notificación de instructor
testTeacherNotificationAPI({
  username: 'Profesor Test',
  email: 'profesor@example.com',
  courseTitle: 'Curso de Prueba'
})

// Probar todo el sistema
testCompleteEmailSystem()
*/

