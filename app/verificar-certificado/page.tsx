"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCertificateByCode } from "@/hooks/certificateAPI"
import { Certificate } from "@/types/CertificateType"
import { CheckCircle, XCircle, Search } from "lucide-react"

export default function VerificarCertificado() {
  const [certificateCode, setCertificateCode] = useState("")
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerification = async () => {
    if (!certificateCode.trim()) {
      setError("Por favor ingrese un código de certificado")
      return
    }

    setIsLoading(true)
    setError(null)
    setCertificate(null)

    try {
      const result = await getCertificateByCode(certificateCode.trim())
      if (result) {
        setCertificate(result)
      } else {
        setError("Certificado no encontrado. Verifique el código ingresado.")
      }
    } catch (error) {
      setError("Error al verificar el certificado. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No especificada"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Verificar Certificado
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ingrese el código único de su certificado para verificar su autenticidad
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">
                Verificación de Certificado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ingrese el código del certificado"
                  value={certificateCode}
                  onChange={(e) => setCertificateCode(e.target.value)}
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
                />
                <Button
                  onClick={handleVerification}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="bg-red-500/20 backdrop-blur-md border-red-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-red-400">
                  <XCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {certificate && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-green-500/20 backdrop-blur-md border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 text-center flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Certificado Verificado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                  <div>
                    <p className="text-sm text-gray-300">Estudiante:</p>
                    <p className="font-semibold">{certificate.users_permissions_user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Curso:</p>
                    <p className="font-semibold">{certificate.course.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Fecha de Finalización:</p>
                    <p className="font-semibold">{formatDate(certificate.finished_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Calificación:</p>
                    <p className="font-semibold">{certificate.qualification}%</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-300">Código del Certificado:</p>
                    <p className="font-mono font-semibold text-green-400 bg-green-500/20 p-2 rounded">
                      {certificate.certificateCode}
                    </p>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-300">
                    Este certificado ha sido verificado y es auténtico.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            ¿Necesita ayuda? Contacte a nuestro equipo de soporte
          </p>
        </div>
      </div>
    </div>
  )
}
