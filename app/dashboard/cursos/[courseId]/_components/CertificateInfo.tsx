"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Download, Copy, CheckCircle, Info, ExternalLink } from "lucide-react"
import { getCertificateByUserAndCourse } from "@/hooks/certificateAPI"
import { Certificate } from "@/types/CertificateType"
import type { DetailedCourse } from "@/types/CoursesType"
import type { User } from "@/types/StudentType"

interface CertificateInfoProps {
  user: User
  course: DetailedCourse
  onGenerateCertificate: () => void
}

export default function CertificateInfo({ user, course, onGenerateCertificate }: CertificateInfoProps) {
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const result = await getCertificateByUserAndCourse(user.id, course.id)
        setCertificate(result)
      } catch (error) {
        console.error("Error fetching certificate:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificate()
  }, [user.id, course.id])

  const copyToClipboard = async () => {
    if (certificate?.certificateCode) {
      try {
        await navigator.clipboard.writeText(certificate.certificateCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error("Error copying to clipboard:", error)
      }
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

  if (isLoading) {
    return (
      <Card className="mb-4 bg-black/30 border-none">
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-300/20 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300/20 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!certificate) {
    return null
  }

  return (
    <Card className="mb-4 bg-slate-800/40 border border-green-400/40 hover:bg-slate-800/60 hover:border-green-400/60 transition-all duration-200 shadow-lg backdrop-blur-sm rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Información compacta principal */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-green-400/20 rounded-full flex items-center justify-center ring-2 ring-green-400/30">
                <CheckCircle className="h-5 w-5 text-green-300" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-green-300 font-semibold text-sm truncate">
                  Certificado Obtenido
                </h3>
                <Badge variant="secondary" className="bg-green-400/20 text-green-200 border-green-400/40 text-xs px-2 py-0.5 font-medium">
                  {certificate.qualification}%
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="truncate font-mono text-gray-200">
                  {certificate.certificateCode.slice(0, 12)}...
                </span>
                <span className="text-green-400">•</span>
                <span className="truncate text-gray-300">
                  {formatDate(certificate.finished_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 ml-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-400 hover:text-green-300 hover:bg-green-500/20 px-2"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              
              <PopoverContent className="w-80 bg-gray-900/95 border-green-500/30 backdrop-blur-sm" align="end">
                <div className="space-y-4">
                  {/* Header del popover */}
                  <div className="flex items-center gap-2 pb-2 border-b border-green-500/30">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <h4 className="font-semibold text-green-400">Detalles del Certificado</h4>
                  </div>

                  {/* Información detallada */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Estudiante:</p>
                      <p className="text-white font-medium break-all">{certificate.users_permissions_user.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Curso:</p>
                      <p className="text-white font-medium">{certificate.course.title}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Calificación:</p>
                        <p className="text-green-400 font-semibold">{certificate.qualification}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Fecha:</p>
                        <p className="text-white font-medium text-xs">{formatDate(certificate.finished_date)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs mb-2">Código de Verificación:</p>
                      <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/30">
                        <code className="flex-1 text-green-400 text-xs font-mono break-all">
                          {certificate.certificateCode}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={copyToClipboard}
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/20 px-2 py-1 h-auto"
                        >
                          {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {copied ? "¡Copiado al portapapeles!" : "Haz clic en el ícono para copiar"}
                      </p>
                    </div>
                  </div>

                  {/* Botones de acción en el popover */}
                  <div className="flex gap-2 pt-2 border-t border-green-500/30">
                    <Button
                      onClick={onGenerateCertificate}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Descargar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                    >
                      <a href="/verificar-certificado" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Verificar
                      </a>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              onClick={onGenerateCertificate}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white px-3"
            >
              <Download className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Descargar</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}