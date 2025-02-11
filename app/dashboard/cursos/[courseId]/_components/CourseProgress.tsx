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

      // Add background color
      doc.setFillColor(248, 250, 252)
      doc.rect(0, 0, 297, 210, "F")

      // Add decorative shapes
      // Red shape
      doc.setFillColor(231, 111, 81)
      doc.circle(30, 30, 60, "F")

      // Purple shape
      doc.setFillColor(99, 44, 22)
      doc.circle(60, 60, 40, "F")

      // Add small decorative dots
      doc.setFillColor(252, 213, 197)
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 3; j++) {
          doc.circle(20 + i * 8, 180 + j * 8, 1, "F")
        }
      }

      // Add certificate content
      doc.setTextColor(76, 61, 101)

      // Title
      doc.setFontSize(28)
      doc.text("Certificado de reconocimiento", 150, 50, { align: "center" })

      // "Otorgado a" text
      doc.setFontSize(16)
      doc.text("Otorgado a", 150, 70, { align: "center" })

      // Student name
      doc.setFontSize(32)
      const safeUsername = getSafeText(user.username)
      doc.text(safeUsername, 150, 90, { align: "center" })

      // Course completion text
      doc.setFontSize(16)
      doc.text("Por completar exitosamente el curso:", 150, 110, { align: "center" })

      // Course name
      doc.setFontSize(20)
      const safeCourseTitle = getSafeText(course.title)
      doc.text(safeCourseTitle, 150, 125, { align: "center" })

      // Add signature line
      doc.setDrawColor(76, 61, 101)
      doc.line(100, 160, 200, 160)

      // Add signature text
      doc.setFontSize(12)
      if (course.teacher?.name) {
        const teacherName = getSafeText(course.teacher.name)
        doc.text(teacherName, 150, 170, { align: "center" })

        // Only add titulo if it exists
        if (course.teacher.titulo) {
          const teacherTitle = getSafeText(course.teacher.titulo)
          doc.text(teacherTitle, 150, 175, { align: "center" })
        }
      } else {
        // Fallback text if no teacher info is available
        doc.text("Instructor del curso", 150, 170, { align: "center" })
      }

      // Add date
      try {
        const currentDate = new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        doc.text(`Fecha: ${currentDate}`, 270, 190, { align: "right" })
      } catch (dateError) {
        // Fallback to basic date format if locale fails
        const simpleDate = new Date().toLocaleDateString()
        doc.text(`Fecha: ${simpleDate}`, 270, 190, { align: "right" })
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

