import { sendEmail } from './mail.utils'
import Mail from 'nodemailer/lib/mailer'

interface WelcomeEmailData {
  username: string
  email: string
  isTeacher: boolean
}

const createWelcomeEmailTemplate = (data: WelcomeEmailData): string => {
  const { username, isTeacher } = data
  const userType = isTeacher ? 'profesor' : 'estudiante'
  const userTypeCapitalized = isTeacher ? 'Profesor' : 'Estudiante'
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>¡Bienvenido a Maintech!</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #ffffff; 
          border-radius: 16px; 
          overflow: hidden; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #00D1FF 0%, #0099CC 100%);
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 2.5em; 
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 1.1em;
          opacity: 0.9;
        }
        .content { 
          padding: 40px 30px; 
          background: #ffffff;
        }
        .welcome-message {
          font-size: 1.2em;
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
        }
        .user-info {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
          border-left: 4px solid #00D1FF;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #495057;
        }
        .value {
          color: #6c757d;
        }
        .next-steps {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
        }
        .next-steps h3 {
          color: #1976d2;
          margin-top: 0;
          font-size: 1.3em;
        }
        .step-list {
          list-style: none;
          padding: 0;
        }
        .step-list li {
          padding: 8px 0;
          position: relative;
          padding-left: 25px;
        }
        .step-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #4caf50;
          font-weight: bold;
          font-size: 1.1em;
        }
        .footer { 
          text-align: center; 
          padding: 30px; 
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          color: #6c757d; 
          font-size: 0.9em; 
        }
        .footer a {
          color: #00D1FF;
          text-decoration: none;
          font-weight: 600;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #00D1FF 0%, #0099CC 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          margin: 20px 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 209, 255, 0.3);
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 209, 255, 0.4);
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 12px;
          }
          .header, .content, .footer {
            padding: 20px;
          }
          .header h1 {
            font-size: 2em;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Bienvenido a Maintech!</h1>
          <p>Tu plataforma de aprendizaje tecnológico</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <p>¡Hola <strong>${username}</strong>! Nos complace darte la bienvenida a nuestra comunidad de aprendizaje.</p>
          </div>
          
          <div class="user-info">
            <div class="info-row">
              <span class="label">Tipo de cuenta:</span>
              <span class="value">${userTypeCapitalized}</span>
            </div>
            <div class="info-row">
              <span class="label">Usuario:</span>
              <span class="value">${username}</span>
            </div>
            <div class="info-row">
              <span class="label">Estado:</span>
              <span class="value">✅ Cuenta activada</span>
            </div>
          </div>
          
          <div class="next-steps">
            <h3>🎯 Próximos pasos para ti:</h3>
            ${isTeacher ? `
              <ul class="step-list">
                <li>Completa tu perfil de instructor</li>
                <li>Explora las herramientas de creación de cursos</li>
                <li>Comienza a crear contenido educativo</li>
                <li>Conecta con estudiantes</li>
              </ul>
            ` : `
              <ul class="step-list">
                <li>Explora nuestro catálogo de cursos</li>
                <li>Completa tu perfil de estudiante</li>
                <li>Inscríbete en tu primer curso</li>
                <li>Comienza tu viaje de aprendizaje</li>
              </ul>
            `}
          </div>
          
          <div style="text-align: center;">
            <a href="https://maintech.com.pe" class="cta-button">
              ${isTeacher ? 'Ir al Panel de Instructor' : 'Explorar Cursos'}
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Este es un mensaje automático de bienvenida.</p>
          <p>Si tienes alguna pregunta, no dudes en <a href="mailto:soporte@maintech.com.pe">contactarnos</a>.</p>
          <p>© 2024 Maintech. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

const createWelcomeEmailText = (data: WelcomeEmailData): string => {
  const { username, isTeacher } = data
  const userType = isTeacher ? 'profesor' : 'estudiante'
  
  return `
¡Bienvenido a Maintech!

Hola ${username},

Nos complace darte la bienvenida a nuestra comunidad de aprendizaje tecnológico.

Tipo de cuenta: ${userType}
Usuario: ${username}
Estado: Cuenta activada

Próximos pasos para ti:
${isTeacher ? `
- Completa tu perfil de instructor
- Explora las herramientas de creación de cursos
- Comienza a crear contenido educativo
- Conecta con estudiantes
` : `
- Explora nuestro catálogo de cursos
- Completa tu perfil de estudiante
- Inscríbete en tu primer curso
- Comienza tu viaje de aprendizaje
`}

Visita nuestra plataforma: https://maintech.com.pe

Si tienes alguna pregunta, no dudes en contactarnos: soporte@maintech.com.pe

© 2024 Maintech. Todos los derechos reservados.
  `.trim()
}

export const sendWelcomeEmail = async (data: WelcomeEmailData): Promise<void> => {
  try {
    const { username, email, isTeacher } = data
    
    const sender: Mail.Address = {
      name: 'Maintech',
      address: 'noreply@maintech.com.pe'
    }
    
    const recipients: Mail.Address[] = [{
      name: username,
      address: email
    }]
    
    const subject = `¡Bienvenido a Maintech, ${username}!`
    
    // Enviar correo de bienvenida
    await sendEmail({
      sender,
      receipents: recipients,
      subject,
      message: `Tipo de cuenta: ${isTeacher ? 'Profesor' : 'Estudiante'}\nUsuario: ${username}\nEmail: ${email}\nEstado: Cuenta activada\nFecha de registro: ${new Date().toLocaleDateString('es-ES')}`
    })
    
    console.log(`✅ Correo de bienvenida enviado exitosamente a ${email}`)
  } catch (error) {
    console.error('❌ Error al enviar correo de bienvenida:', error)
    throw error
  }
}

export const sendTeacherNotificationEmail = async (teacherData: {
  username: string
  email: string
  courseTitle?: string
}): Promise<void> => {
  try {
    const { username, email, courseTitle } = teacherData
    
    const sender: Mail.Address = {
      name: 'Maintech',
      address: 'noreply@maintech.com.pe'
    }
    
    const recipients: Mail.Address[] = [{
      name: username,
      address: email
    }]
    
    const subject = courseTitle 
      ? `Has sido asignado como instructor del curso: ${courseTitle}`
      : 'Has sido promovido a instructor en Maintech'
    
    const message = courseTitle 
      ? `Tipo de notificación: Asignación de curso\nUsuario: ${username}\nEmail: ${email}\nCurso asignado: ${courseTitle}\nFecha: ${new Date().toLocaleDateString('es-ES')}`
      : `Tipo de notificación: Promoción a instructor\nUsuario: ${username}\nEmail: ${email}\nNuevo rol: Instructor\nFecha: ${new Date().toLocaleDateString('es-ES')}`
    
    await sendEmail({
      sender,
      receipents: recipients,
      subject,
      message
    })
    
    console.log(`✅ Notificación de instructor enviada exitosamente a ${email}`)
  } catch (error) {
    console.error('❌ Error al enviar notificación de instructor:', error)
    throw error
  }
}

