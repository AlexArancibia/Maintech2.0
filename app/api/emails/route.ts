import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail.utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, mensaje, asunto } = body

    // Validar campos requeridos
    if (!nombre || !email || !telefono || !mensaje) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Formatear el mensaje para el email
    const emailMessage = `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nMensaje: ${mensaje}`

    // Enviar confirmación automática al usuario
    await sendEmail({
      sender: process.env.MAIL_FROM || 'noreply@maintech.com',
      recipients: [email], // Correo del usuario
      subject: 'Confirmación de mensaje - Maintech',
      message: `Confirmación de mensaje\n\nHemos recibido tu mensaje y nos pondremos en contacto contigo pronto.\n\nSaludos,\nEquipo Maintech`
    })

    // Enviar notificación a la empresa
    await sendEmail({
      sender: process.env.MAIL_FROM || 'noreply@maintech.com',
      recipients: [process.env.MAIL_TO || 'admin@maintech.com'],
      subject: `Nueva solicitud de contacto: ${nombre}`,
      message: emailMessage
    })

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.'
    })

  } catch (error) {
    console.error('Error en API /api/emails:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.' 
      },
      { status: 500 }
    )
  }
}
