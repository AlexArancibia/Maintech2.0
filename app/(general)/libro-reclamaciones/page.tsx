"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"

export default function LibroDeReclamaciones() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    curso: "",
    reclamacion: "",
    asunto: "Nueva Reclamación",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        setFormData({ nombre: "", email: "", telefono: "", curso: "", reclamacion: "", asunto: "Nueva Reclamación" })
      }
    } catch (error) {
      setResult({ success: false, message: "Ocurrió un error al enviar el formulario." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } },
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-12  ">
      <h1 className="text-4xl font-bold mb-8 text-center  ">Libro de Reclamaciones</h1>
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-800 text-white">
            <CardTitle className="text-2xl">Formulario de Reclamación</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {result.message && (
              <div
                className={`p-4 rounded-lg mb-6 ${result.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {result.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo*"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico*"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <Input
                type="tel"
                name="telefono"
                placeholder="Teléfono celular*"
                required
                value={formData.telefono}
                onChange={handleChange}
                className="w-full"
              />
              <Select name="curso" onValueChange={(value) => handleChange({ target: { name: "curso", value } })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mantenimiento-predictivo">Mantenimiento Predictivo Avanzado</SelectItem>
                  <SelectItem value="automatizacion-industrial">
                    Automatización Industrial y Control de Procesos
                  </SelectItem>
                  <SelectItem value="iot-industrial">IoT Industrial y Análisis de Datos</SelectItem>
                  <SelectItem value="robotica-avanzada">Robótica Avanzada en Entornos Industriales</SelectItem>
                  <SelectItem value="industria-4.0">Fundamentos de Industria 4.0</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                name="reclamacion"
                placeholder="Describe detalladamente tu reclamación aquí*"
                required
                value={formData.reclamacion}
                onChange={handleChange}
                className="w-full min-h-[150px]"
              />
              <Button
                type="submit"
                className="w-full   text-white h-12 text-lg font-medium rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "ENVIANDO..." : "ENVIAR RECLAMACIÓN"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gray-800 text-white">
            <CardTitle className="text-2xl">Proceso de Atención de Reclamaciones</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">
              En Maintech, valoramos profundamente tus comentarios y reclamaciones como oportunidades para mejorar
              nuestros servicios de formación en tecnologías industriales avanzadas. Nos comprometemos a atender todas
              las reclamaciones con la máxima seriedad y eficiencia, en un plazo máximo de 15 días hábiles. Nuestro
              proceso integral incluye:
            </p>
            <ol className="list-decimal list-inside space-y-4 mb-6">
              <li>
                <strong>Recepción y Registro:</strong> Cada reclamación es registrada inmediatamente en nuestro sistema,
                asignándole un número de seguimiento único.
              </li>
              <li>
                <strong>Análisis Detallado:</strong> Nuestro equipo especializado en calidad educativa realiza un
                análisis exhaustivo de cada caso, considerando todos los aspectos relevantes.
              </li>
              <li>
                <strong>Consulta con Expertos:</strong> Involucramos a los instructores y departamentos pertinentes para
                obtener una comprensión completa de la situación y explorar soluciones efectivas.
              </li>
              <li>
                <strong>Resolución Personalizada:</strong> Desarrollamos una solución personalizada para cada
                reclamación, asegurando que aborde adecuadamente las preocupaciones del estudiante.
              </li>
              <li>
                <strong>Respuesta al Estudiante:</strong> Comunicamos la resolución al estudiante de manera clara y
                detallada, asegurándonos de que todas sus inquietudes hayan sido atendidas satisfactoriamente.
              </li>
              <li>
                <strong>Implementación de Mejoras:</strong> Utilizamos la información recopilada para implementar
                mejoras sistemáticas en nuestros cursos, procesos y servicios de soporte al estudiante.
              </li>
              <li>
                <strong>Seguimiento:</strong> Realizamos un seguimiento posterior para asegurar la satisfacción del
                estudiante con la resolución proporcionada.
              </li>
            </ol>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 flex items-start">
              <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 mt-1" />
              <p>
                <strong className="font-semibold">Nota Importante:</strong> Tu satisfacción y aprendizaje efectivo son
                nuestra máxima prioridad. Utilizamos tus valiosos comentarios para mejorar continuamente nuestros cursos
                de mantenimiento industrial e Industria 4.0, asegurando que sigamos a la vanguardia de la formación en
                tecnologías industriales avanzadas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

