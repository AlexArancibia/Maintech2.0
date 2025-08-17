import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail.utils'

export async function POST(request: NextRequest) {
  try {
    console.log('📧 [API] /api/send-course-welcome llamada');
    const body = await request.json()
    const { userEmail, userName, courseTitle } = body
    
    console.log('📧 [API] Datos recibidos:', { userEmail, userName, courseTitle });

    // Validar campos requeridos
    if (!userEmail || !userName || !courseTitle) {
      console.error('❌ [API] Faltan datos requeridos');
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    console.log('📧 [API] Enviando email de bienvenida...');
    
    // Enviar email de bienvenida al curso
    await sendEmail({
      sender: process.env.MAIL_FROM || 'noreply@maintech.com',
      receipents: [userEmail],
      subject: `¡Bienvenido al curso: ${courseTitle}!`,
      message: `Bienvenido al curso\n\nHola ${userName},\n\n¡Bienvenido al curso "${courseTitle}"!\n\nTu inscripción ha sido confirmada y ya tienes acceso al contenido.\n\n¡Comienza tu aprendizaje ahora!\n\nSaludos,\nEquipo Maintech`
    })
    
    console.log('✅ [API] Email enviado exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Email de bienvenida enviado exitosamente'
    })

  } catch (error) {
    console.error('Error en API /api/send-course-welcome:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al enviar email de bienvenida' 
      },
      { status: 500 }
    )
  }
}
