import { useState } from 'react'

interface EmailData {
  username: string
  email: string
  isTeacher?: boolean
  courseTitle?: string
}

interface EmailResponse {
  success: boolean
  message?: string
  error?: string
}

export const useEmailService = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendWelcomeEmail = async (data: EmailData): Promise<EmailResponse> => {
    setIsLoading(true)
    setError(null)

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

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar correo')
      }

      return {
        success: true,
        message: result.message
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Error al enviar correo de bienvenida'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }

  const sendTeacherNotificationEmail = async (data: EmailData): Promise<EmailResponse> => {
    setIsLoading(true)
    setError(null)

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

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar correo')
      }

      return {
        success: true,
        message: result.message
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Error al enviar notificación de instructor'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    sendWelcomeEmail,
    sendTeacherNotificationEmail,
    isLoading,
    error,
    clearError
  }
}






