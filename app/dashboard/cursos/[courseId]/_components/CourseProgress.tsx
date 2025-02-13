"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { DetailedCourse } from "@/types/CoursesType"
import type { User } from "@/types/StudentType"
import { useState } from "react"
import jsPDF from "jspdf"

interface CourseProgressProps {
  progress: number
  user: User
  course: DetailedCourse
}

export default function CourseProgress({ progress, user, course }: CourseProgressProps) {
  const [isGenerating, setIsGenerating] = useState(false)

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

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/certificado.jpg-JOmZX0BKrM5FO78ZzGMAei7wngkaAp.jpeg"
      })

      doc.addImage(img, "JPEG", 0, 0, 297, 210)

      // Add student name
      doc.setFontSize(32)
      doc.setTextColor(51, 51, 51)
      const safeUsername = getSafeText(course.title)
      doc.text(safeUsername, 150, 90, { align: "center" })

      // Add course name
      doc.setFontSize(20)
      const safeCourseTitle = getSafeText(user.username)
      doc.text(safeCourseTitle, 150, 125, { align: "center" })

      // Add date
      doc.setFontSize(12)
      try {
        const currentDate = new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        doc.text(`${course.finish_date}`, 270, 190, { align: "right" })
      } catch (dateError) {
        const simpleDate = new Date().toLocaleDateString()
        doc.text(`${simpleDate}`, 270, 190, { align: "right" })
      }

      // Save the PDF with safe filename
      const safeFilename = `certificado_${safeUsername.replace(/[^a-z0-9]/gi, "_")}_${safeCourseTitle.replace(/[^a-z0-9]/gi, "_")}.pdf`
      doc.save(safeFilename.toLowerCase())
    } catch (error) {
      console.error("Error generating certificate:", error)
      alert(`Error al generar el certificado: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="mb-6 shadow-none border-none bg-black/30 bg-opacity-25">
      <CardHeader>
        <CardTitle className="text-white">Progreso del Curso</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-white/80 mt-2">{Math.round(progress)}% completado</p>
        {progress === 100 && (
          <Button
            className="bg-gradient-to-br from-secondary to-primary mt-4 h-8"
            onClick={handleCertificate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generando..." : "Generar Certificado"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

