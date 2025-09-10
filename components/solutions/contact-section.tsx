"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react"
import { useState } from "react"
import { useCardSection } from "@/hooks/CardSectionsContext"
import { socialLinks } from "@/lib/social"
import ShaderBackground from "./shader-background"

const services = [
  "Confiabilidad & Gestión Integral de Activos",
  "Servicios de Monitoreo de Condición de Activos CBM",
  "Tecnología de Monitoreo de Condición de Activos I4.0",
  "Analítica de Datos Aplicada a la Gestión Integral de Activos",
  "Tribología & Gestión de la Lubricación",
  "Purificación de Aceites Lubricantes",
  "Tecnología para Purificación de Aceites Lubricantes",
  "Planes de Formación"
]

const contactIcons = [Phone, Mail, MapPin]

export function ContactSection() {
  const { data: sections, loading, error } = useCardSection("z4q87za2zm8o2y1hiz0ouomo", { populateCard: true });
  const section = sections[0] || null;
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    servicio: "",
    mensaje: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.servicio || !formData.mensaje) {
      setResult({ 
        success: false, 
        message: 'Por favor, completa todos los campos requeridos (*)' 
      })
      return
    }
    
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          mensaje: `Empresa: ${formData.empresa || 'No especificada'}\nServicio de interés: ${formData.servicio}\n\nMensaje:\n${formData.mensaje}`,
          asunto: 'Nueva consulta de soluciones industriales'
        }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        // Reset form if email was sent successfully
        setFormData({ nombre: '', email: '', telefono: '', empresa: '', servicio: '', mensaje: '' })
      }
    } catch (error) {
      setResult({ success: false, message: "Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleServiceChange = (value: string) => {
    setFormData({
      ...formData,
      servicio: value
    })
  }

  return (
    <ShaderBackground>
      <section className="py-32 relative overflow-hidden">
        <div className="container-section relative z-10">
          <div className="content-section">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left Side - Title, Text, and Contact Data */}
              <div className="space-y-12">
                {/* Header */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                    ¿Listo para{" "}
                    <span className="text-accent">
                      transformar
                    </span>
                    <br />
                    tu empresa?
                  </h2>
                  <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-lg">
                    Nuestro equipo de expertos está listo para ayudarte a implementar soluciones 
                    de confiabilidad y gestión integral de activos que impulsen tu negocio.
                  </p>
                </div>

                {/* Contact Information - Dynamic from Strapi */}
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Información de contacto
                  </h3>
                  <div className="space-y-6">
                    {Array.isArray(section?.card) && section.card.map((card: any, idx: number) => {
                      const Icon = contactIcons[idx]
                      return (
                        <div key={card.id} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                            {Icon && <Icon className="w-5 h-5 text-accent" />}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-1">{card.title}</h4>
                            <p className="text-white/80 text-base">{card.subtitle}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="pt-8"></div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div>
                <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-10">
                    <h3 className="text-2xl font-bold text-gray-800 mb-8">
                      Solicita una consulta gratuita
                    </h3>
                    
                    {result.message && (
                      <div className={`p-4 rounded-lg mb-6 ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {result.message}
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="nombre" className="text-gray-700 font-medium">
                            Nombre completo *
                          </Label>
                          <Input
                            id="nombre"
                            name="nombre"
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                            className="mt-2 border-gray-300 focus:border-primary focus:ring-primary"
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-2 border-gray-300 focus:border-primary focus:ring-primary"
                            placeholder="tu@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="telefono" className="text-gray-700 font-medium">
                            Teléfono *
                          </Label>
                          <Input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            required
                            value={formData.telefono}
                            onChange={handleChange}
                            className="mt-2 border-gray-300 focus:border-primary focus:ring-primary"
                            placeholder="Tu teléfono"
                          />
                        </div>
                        <div>
                          <Label htmlFor="empresa" className="text-gray-700 font-medium">
                            Empresa
                          </Label>
                          <Input
                            id="empresa"
                            name="empresa"
                            type="text"
                            value={formData.empresa}
                            onChange={handleChange}
                            className="mt-2 border-gray-300 focus:border-primary focus:ring-primary"
                            placeholder="Nombre de tu empresa"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="servicio" className="text-gray-700 font-medium">
                          Servicio de interés *
                        </Label>
                        <Select onValueChange={handleServiceChange} value={formData.servicio} required>
                          <SelectTrigger className={`mt-2 focus:border-primary focus:ring-primary ${
                            !formData.servicio ? 'border-red-300' : 'border-gray-300'
                          }`}>
                            <SelectValue placeholder="Selecciona un servicio *" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service, index) => (
                              <SelectItem key={index} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!formData.servicio && (
                          <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="mensaje" className="text-gray-700 font-medium">
                          Mensaje *
                        </Label>
                        <Textarea
                          id="mensaje"
                          name="mensaje"
                          required
                          value={formData.mensaje}
                          onChange={handleChange}
                          rows={5}
                          className="mt-2 border-gray-300 focus:border-primary focus:ring-primary resize-none"
                          placeholder="Cuéntanos sobre tu proyecto y cómo podemos ayudarte..."
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ShaderBackground>
  )
}
