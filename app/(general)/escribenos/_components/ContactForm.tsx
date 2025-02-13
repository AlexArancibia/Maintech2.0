"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    asunto: 'Nueva Solicitud de Contacto'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        // Reset form if email was sent successfully
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '',asunto: 'Nueva Solicitud de Contacto' })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred while submitting the form." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className='container-section p-8 sm:p-16 bg-gray-100'>
      <div className="grid lg:grid-cols-2 gap-16 sm:gap-32 items-center content-section">
        {/* Image Section */}
        <div className="relative h-[600px] rounded-2xl overflow-hidden">
          <img
            src="/contact1.png"
            alt="Estudiante sonriente"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-orbitron">
              <span className="flex">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-pink-500">
                  <polygon points="8,4 18,12 8,20" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-pink-500 -ml-3">
                  <polygon points="8,4 18,12 8,20" />
                </svg>
              </span>
              <h2 className="text-3xl font-bold">
                Tu Futuro <span className="text-secondary">¡Empieza aqui!</span>
              </h2>
            </div>
          </div>

          {result.message && (
            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {result.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              name="name"
              placeholder="Apellidos y Nombres*"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="h-12 rounded-lg"
            />
            
            <Input
              type="email"
              name="email"
              placeholder="Correo electrónico*"
              required
              value={formData.email}
              onChange={handleChange}
              className="h-12 rounded-lg"
            />
            
            <Input
              type="tel"
              name="phone"
              placeholder="Teléfono celular*"
              required
              value={formData.telefono}
              onChange={handleChange}
              className="h-12 rounded-lg"
            />
            
            <Textarea
              name="message"
              placeholder="Ingresa tu mensaje*"
              required
              value={formData.mensaje}
              onChange={handleChange}
              className="min-h-[150px] rounded-lg resize-none"
            />

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 text-lg font-medium bg-pink-500 hover:bg-pink-600 text-white rounded-full"
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <polygon points="8,4 18,12 8,20" />
                  <polygon points="8,4 18,12 8,20" className="-ml-3" />
                </svg>
                {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
              </span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}