"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { DetailedCourse } from "@/types/CoursesType"
import type { User } from "@/types/StudentType"
import { useState, useEffect } from "react"
import jsPDF from "jspdf"
import { createCertificate, getCertificateByUserAndCourse, generateUniqueCertificateCode } from "@/hooks/certificateAPI"
import CertificateInfo from "./CertificateInfo"

interface CourseProgressProps {
  progress: number
  user: User
  course: DetailedCourse
}

export default function CourseProgress({ progress, user, course }: CourseProgressProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasCertificate, setHasCertificate] = useState(false)

  useEffect(() => {
    let isMounted = true;
    
    const checkCertificate = async () => {
      try {
        // Validar que user y course tengan IDs válidos
        if (!user?.id || !course?.id) {
          console.log("User ID or Course ID not available yet")
          return
        }
        
        const existingCertificate = await getCertificateByUserAndCourse(user.id, course.id)
        if (isMounted) {
          setHasCertificate(!!existingCertificate)
        }
      } catch (error) {
        console.error("Error checking certificate:", error)
        if (isMounted) {
          setHasCertificate(false)
        }
      }
    }

    if (progress === 100 && user?.id && course?.id) {
      checkCertificate()
    }

    return () => {
      isMounted = false;
    };
  }, [progress, user?.id, course?.id])

  // Validar que los datos necesarios estén disponibles - MOVED AFTER HOOKS
  if (!user?.id || !course?.id) {
    return (
      <Card className="mb-4 shadow-none border-none bg-black/30 bg-opacity-25 rounded-lg">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300/20 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleCertificate = async () => {
    setIsGenerating(true)

    try {
      // Validate required data
      if (!user?.username) {
        throw new Error("Nombre de usuario no disponible")
      }

      if (!course?.title) {
        throw new Error("Título del curso no disponible")
      }

      // Validar que user y course tengan IDs válidos
      if (!user?.id || !course?.id) {
        throw new Error("ID de usuario o curso no disponible")
      }

      // Additional safety check
      if (!user || !course) {
        throw new Error("Datos de usuario o curso no disponibles")
      }

      // Check if certificate already exists
      const existingCertificate = await getCertificateByUserAndCourse(user.id, course.id)
      
      if (existingCertificate) {
        // Certificate already exists, just generate PDF
        await generateCertificatePDF(user, course, existingCertificate.certificateCode)
        return
      }

      // Generate unique certificate code
      const certificateCode = generateUniqueCertificateCode()

      // Create certificate in database
      const certificateData = {
        course: course.id,
        users_permissions_user: user.id,
        finished_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        qualification: 100, // Assuming 100% completion for certificate
        certificateCode: certificateCode
      }

      await createCertificate(certificateData)
      setHasCertificate(true)

      // Generate PDF with the new certificate code
      await generateCertificatePDF(user, course, certificateCode)

    } catch (error) {
      console.error("Error generating certificate:", error)
      alert(`Error al generar el certificado: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateCertificatePDF = async (user: User, course: DetailedCourse, certificateCode: string) => {
    // Helper function to safely get text
    const getSafeText = (text: string | null | undefined): string => {
      return text?.toString().trim() || ""
    }

    // Create new document
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    // Load and add certificate template
    const img = new Image()
    img.crossOrigin = "anonymous"

    // Use category's custom certificate image if available, otherwise use default
    const certificateImageUrl = course.category?.certificate_img?.url || 
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/certificado.jpg-JOmZX0BKrM5FO78ZzGMAei7wngkaAp.jpeg"

    console.log("Course category:", course.category)
    console.log("Certificate image from category:", course.category?.certificate_img)
    console.log("Using certificate image URL:", certificateImageUrl)

    // Load image with proper error handling
    let imageLoaded = false
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (!imageLoaded) {
          console.log("Image loading timeout, using default image")
          img.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/certificado.jpg-JOmZX0BKrM5FO78ZzGMAei7wngkaAp.jpeg"
        }
      }, 10000) // 10 second timeout

      img.onload = () => {
        imageLoaded = true
        clearTimeout(timeout)
        resolve(true)
      }

      img.onerror = () => {
        console.error("Error loading certificate image, using default")
        clearTimeout(timeout)
        img.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/certificado.jpg-JOmZX0BKrM5FO78ZzGMAei7wngkaAp.jpeg"
        // Wait for default image to load
        img.onload = () => {
          imageLoaded = true
          resolve(true)
        }
      }

      img.src = certificateImageUrl
    })

    // Verify image dimensions
    if (img.width === 0 || img.height === 0) {
      throw new Error("La imagen del certificado no se cargó correctamente")
    }

    doc.addImage(img, "JPEG", 0, 0, 297, 210)

    // Add student name
    doc.setFontSize(32)
    doc.setTextColor(51, 51, 51)
    const safeUsername = getSafeText(user.username)
    doc.text(safeUsername, 150, 90, { align: "center" })

    // Add course name
    doc.setFontSize(20)
    const safeCourseTitle = getSafeText(course.title)
    doc.text(safeCourseTitle, 150, 125, { align: "center" })

    // Add certificate code
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(`Código: ${certificateCode}`, 150, 160, { align: "center" })

    // Add date
    doc.setFontSize(12)
    try {
      const currentDate = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Lima"
      })
      doc.text(`${currentDate}`, 270, 190, { align: "right" })
    } catch (dateError) {
      const simpleDate = new Date().toLocaleDateString('es-ES', { timeZone: 'America/Lima' })
      doc.text(`${simpleDate}`, 270, 190, { align: "right" })
    }

    // Save the PDF with safe filename
    const safeFilename = `certificado_${safeUsername.replace(/[^a-z0-9]/gi, "_")}_${safeCourseTitle.replace(/[^a-z0-9]/gi, "_")}.pdf`
    doc.save(safeFilename.toLowerCase())
  }

  // If user has a certificate, show CertificateInfo component
  if (hasCertificate) {
    return (
      <CertificateInfo 
        user={user} 
        course={course} 
        onGenerateCertificate={handleCertificate}
      />
    )
  }

  return (
    <Card className="mb-4 shadow-none border-none bg-black/30 bg-opacity-25 rounded-lg">
      <CardContent className="p-4 space-y-3">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Progreso actual</span>
            <span className="text-lg font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>
          
          <Progress 
            value={progress} 
            className="w-full h-2 bg-gray-700/50" 
          />
          
          <p className="text-sm text-gray-400 text-center">
            {progress === 100 
              ? "¡Felicidades! Has completado el curso 🎉" 
              : `${100 - Math.round(progress)}% restante para completar`
            }
          </p>
        </div>

        {/* Certificate Generation Section */}
        {progress === 100 && (
          <div className="pt-3 border-t border-gray-600/30">
            <div className="text-center space-y-3">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-green-400">
                  🎓 ¡Certificado Disponible!
                </h3>
                <p className="text-sm text-gray-300">
                  Genera tu certificado oficial para demostrar tus conocimientos.
                </p>
              </div>
              
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleCertificate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>📜 Generar Certificado</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Progress Info for incomplete courses */}
        {progress < 100 && (
          <div className="pt-3 border-t border-gray-600/30">
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Necesitas completar el {100 - Math.round(progress)}% restante para obtener tu certificado
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

