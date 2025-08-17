import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
  host : process.env.MAIL_HOST,
  port : process.env.MAIL_PORT,
  secure : true,
  auth : {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  }
})


const createHtmlTemplate = (content: string): string => {
  const contentItems = content.split("\n").filter((item) => item.trim() !== "")
  const htmlContent = contentItems
    .map((item) => {
      const [key, value] = item.split(":").map((part) => part.trim())
      if (!key || !value) return ''
      return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 30%;">${key}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${value}</td>
      </tr>
    `
    })
    .join("")

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mensaje de Maintech</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #00D1FF 0%, #0099CC 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Maintech</h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">El Futuro del Mantenimiento Tecnológico</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px;">
          <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Información del Mensaje</h2>
          <table style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
            ${htmlContent}
          </table>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; background-color: #f3f4f6; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Este es un mensaje automático, por favor no responda a este correo.</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">© 2024 Maintech. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

type SendEmailDto ={
  sender: string,
  receipents: string[],
  subject: string,
  message: string,
}

export const sendEmail = async (dto:SendEmailDto) => {
  const {sender,receipents,subject,message} = dto
  
  console.log('📧 [EMAIL] Iniciando envío de correo...')
  console.log('📧 [EMAIL] Destinatarios:', receipents)
  console.log('📧 [EMAIL] Asunto:', subject)
  console.log('📧 [EMAIL] Remitente:', sender)
  
  try {
    console.log('📧 [EMAIL] Configurando transporte...')
    console.log('📧 [EMAIL] Host:', process.env.MAIL_HOST)
    console.log('📧 [EMAIL] Puerto:', process.env.MAIL_PORT)
    console.log('📧 [EMAIL] Usuario:', process.env.MAIL_USER)
    
    const result = await transport.sendMail({
      from: sender,
      to: receipents,
      subject,
      html: createHtmlTemplate(message),
      text: message
    })
    
    console.log('✅ [EMAIL] Correo enviado exitosamente!')
    console.log('✅ [EMAIL] Message ID:', result.messageId)
    console.log('✅ [EMAIL] Respuesta del servidor:', result.response)
    return result
    
  } catch (error) {
    console.error('❌ [EMAIL] Error al enviar correo:')
    if (error instanceof Error) {
      console.error('❌ [EMAIL] Tipo de error:', error.constructor.name)
      console.error('❌ [EMAIL] Mensaje:', error.message)
      console.error('❌ [EMAIL] Stack:', error.stack)
    } else {
      console.error('❌ [EMAIL] Error desconocido:', error)
    }
    throw error
  }
}