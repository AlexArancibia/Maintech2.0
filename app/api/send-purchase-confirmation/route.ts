import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail.utils'

export async function POST(request: NextRequest) {
  try {
    console.log('📧 [API] /api/send-purchase-confirmation llamada')
    const body = await request.json()
    const { 
      userEmail, 
      userName, 
      courseTitle, 
      coursePrice, 
      paymentMethod,
      courseCategory,
      courseChapters,
      courseModality
    } = body
    
    console.log('📧 [API] Datos recibidos:', { 
      userEmail, 
      userName, 
      courseTitle, 
      coursePrice, 
      paymentMethod,
      courseCategory,
      courseChapters,
      courseModality
    });

    // Validar campos requeridos
    if (!userEmail || !userName || !courseTitle) {
      console.error('❌ [API] Faltan datos requeridos');
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    console.log('📧 [API] Enviando email de confirmación de compra...');
    
    // Formatear el precio
    const priceText = coursePrice && coursePrice > 0 ? `S/ ${coursePrice.toFixed(2)}` : 'Gratis';
    const paymentMethodText = paymentMethod || 'No especificado';
    
    // Crear mensaje mejorado con información de contacto
    const emailMessage = `
¡Bienvenido a MainTech! 🎉

Hola ${userName},

¡Tu inscripción ha sido confirmada exitosamente! Estamos emocionados de que hayas elegido aprender con nosotros.

📚 DETALLES DE TU CURSO:
• Curso: ${courseTitle}
• Categoría: ${courseCategory || 'General'}
• Modalidad: ${courseModality || 'Online'}
• Capítulos: ${courseChapters || 0}
• Precio: ${priceText}
• Método de pago: ${paymentMethodText}

🚀 PRÓXIMOS PASOS:
1. Accede a tu dashboard en maintech.com.pe
2. Encuentra tu curso en la lista de cursos comprados
3. Comienza a aprender con nuestro contenido de alta calidad
4. Completa el curso para obtener tu certificado

💡 RECURSOS DISPONIBLES:
• Acceso completo al contenido del curso
• Material de estudio descargable
• Soporte técnico especializado
• Certificado de finalización

📞 CONTÁCTANOS:
Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos:

• 📱 Teléfono: +51 953 804 859
• 📧 Email: contacto@maintech.com.pe
• 💬 WhatsApp: +51 953 804 859
• 🏢 Dirección: Valle Blanco Center, Oficina 18, Cerro Colorado, Arequipa

🌐 SÍGUENOS EN REDES SOCIALES:
• Facebook: facebook.com/MainTech.Latam/
• LinkedIn: linkedin.com/company/maintechlatam
• Instagram: instagram.com/maintech.pe/
• YouTube: youtube.com/@MainTech.latinoamérica
• TikTok: tiktok.com/@maintech.pe

¡Gracias por confiar en MainTech para tu desarrollo profesional!

Saludos cordiales,
El equipo de MainTech
maintech.com.pe
    `.trim();
    
    // Enviar email de confirmación de compra
    await sendEmail({
      sender: process.env.MAIL_FROM || 'noreply@maintech.com',
      recipients: [userEmail],
      subject: `¡Bienvenido a MainTech! Tu curso "${courseTitle}" está listo`,
      message: emailMessage
    })
    
    console.log('✅ [API] Email de confirmación enviado exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Email de confirmación enviado exitosamente'
    })

  } catch (error) {
    console.error('Error en API /api/send-purchase-confirmation:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al enviar email de confirmación' 
      },
      { status: 500 }
    )
  }
}
