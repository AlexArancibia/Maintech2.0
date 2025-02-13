import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const transport = nodemailer.createTransport({
  host : process.env.MAIL_HOST,
  port : process.env.MAIL_PORT,
  secure : true,
  auth : {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  }, 
} as SMTPTransport.Options)


const createHtmlTemplate = (content: string): string => {
  const contentItems = content.split("\n").filter((item) => item.trim() !== "")
  const htmlContent = contentItems
    .map((item) => {
      const [key, value] = item.split(":").map((part) => part.trim())
      return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${key}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${value}</td>
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
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background-color: #00D1FF; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; margin-top: 20px; padding: 10px; background-color: #f9f9f9; font-size: 0.8em; color: #666; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Maintech</h1>
        </div>
        <div class="content">
          <table>
            ${htmlContent}
          </table>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático, por favor no responda a este correo.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

type SendEmailDto ={
  sender: Mail.Address,
  receipents: Mail.Address[],
  subject: string,
  message: string,
}

export const sendEmail = async (dto:SendEmailDto) => {
  const {sender,receipents,subject,message} = dto
  console.log('sendEmail function called with:', { sender, receipents, subject })
  
  try {
    const result = await transport.sendMail({
      from: sender,
      to: receipents,
      subject,
      html: createHtmlTemplate(message),
      text: message
    })
    console.log('Email enviado exitosamente:', result)
    return result
  } catch (error) {
    console.error('Error al enviar email:', error)
    throw error
  }
}