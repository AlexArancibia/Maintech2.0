import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail, sendTeacherNotificationEmail } from '@/lib/welcomeEmails'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, username, email, isTeacher, courseTitle } = body

    // Validar datos requeridos
    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username y email son requeridos' },
        { status: 400 }
      )
    }

    let result

    if (type === 'welcome') {
      // Enviar correo de bienvenida
      await sendWelcomeEmail({
        username,
        email,
        isTeacher: isTeacher || false
      })
      result = { message: 'Correo de bienvenida enviado exitosamente' }
    } else if (type === 'teacher-notification') {
      // Enviar notificación de instructor
      await sendTeacherNotificationEmail({
        username,
        email,
        courseTitle
      })
      result = { message: 'Notificación de instructor enviada exitosamente' }
    } else {
      return NextResponse.json(
        { error: 'Tipo de correo no válido' },
        { status: 400 }
      )
    }

    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('Error en API send-welcome-email:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

