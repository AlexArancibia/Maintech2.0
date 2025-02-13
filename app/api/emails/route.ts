import { sendEmail } from "@/lib/mail.utils"
import { NextResponse } from "next/server"

// Función GET de prueba
export async function GET() {
  console.log("GET request received on /api/emails")
  return NextResponse.json({ message: "GET request to /api/emails is working" })
}

// Función POST existente
export async function POST(request: Request) {
  console.log("POST request received on /api/emails")

  try {
    const formData = await request.json()
    console.log("Received form data:", formData)

    const sender = {
      name: "Maintech",
      address: "contacto@maintech.com.pe",
    }

    const recipients = [
      {
        name: "Contact Form Recipient",
        address: "contacto@maintech.com.pe", // Replace with your actual contact email
      },
    ]

    // Construct email message from all form fields
    const messageBody = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")

    console.log("Preparing to send email")
    const result = await sendEmail({
      sender,
      receipents: recipients,
      subject: formData.asunto || "Nuevo Formulario de Contacto",
      message: messageBody,
    })

    console.log("Email sent, result:", result)

    return NextResponse.json({
      success: true,
      message: "Email enviado exitosamente",
      accepted: result.accepted,
    })
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ success: false, message: `Error sending email: ${error}` }, { status: 500 })
  } finally {
    console.log("API route handler completed")
  }
}

