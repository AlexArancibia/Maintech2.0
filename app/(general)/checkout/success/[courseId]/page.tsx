"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getImageUrl } from "@/lib/getImageUrl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getCourseBySlug } from "@/hooks/coursesAPI"
import type { DetailedCourse } from "@/types/CoursesType"
import { CheckCircle, ArrowRight, Play, BookOpen, Award, Home, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/AuthContext"

type Params = {
  courseId: string
}

export default function CheckoutSuccessPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams<Params>()
  const [course, setCourse] = useState<DetailedCourse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const fetchedCourse = await getCourseBySlug(params.courseId, true)
        
        if (fetchedCourse && "chapters" in fetchedCourse) {
          setCourse(fetchedCourse)
        } else {
          setError("Curso no encontrado")
        }
      } catch (err) {
        console.error("Error fetching course:", err)
        setError("Error al cargar el curso")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.courseId) {
      fetchData()
    }
  }, [params.courseId])

  // Check localStorage to see if email was already sent
  useEffect(() => {
    if (!user?.id || !params.courseId) return

    const storageKey = `course_confirmation_${user.id}_${params.courseId}`
    const hasEmailSent = localStorage.getItem(storageKey)
    
    if (hasEmailSent === 'true') {
      console.log('📧 [SUCCESS_PAGE] Email ya fue enviado anteriormente para este usuario y curso')
      setEmailSent(true)
    }
  }, [user?.id, params.courseId])

  // Send confirmation email when course is loaded and user is available
  useEffect(() => {
    const sendConfirmationEmail = async () => {
      if (!course || !user || emailSent) return

      try {
        console.log('📧 [SUCCESS_PAGE] Enviando email de confirmación de inscripción...')
        
        const response = await fetch('/api/send-purchase-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: user.email,
            userName: user.username || user.email,
            courseTitle: course.title,
            coursePrice: course.price || 0,
            paymentMethod: 'Inscripción exitosa',
            courseCategory: course.category?.name || 'Curso',
            courseChapters: course.chapters?.length || 0,
            courseModality: course.modality || 'Online'
          }),
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ [SUCCESS_PAGE] Email de confirmación enviado:', result)
          
          // Mark email as sent in localStorage
          const storageKey = `course_confirmation_${user.id}_${params.courseId}`
          localStorage.setItem(storageKey, 'true')
          
          // Set expiration date (optional: expires in 1 year)
          const expirationDate = new Date()
          expirationDate.setFullYear(expirationDate.getFullYear() + 1)
          localStorage.setItem(`${storageKey}_expires`, expirationDate.toISOString())
          
          setEmailSent(true)
        } else {
          console.error('❌ [SUCCESS_PAGE] Error al enviar email:', response.status)
        }
      } catch (error) {
        console.error('❌ [SUCCESS_PAGE] Error al enviar email de confirmación:', error)
      }
    }

    // Send email after a short delay to ensure page is fully loaded
    const timer = setTimeout(sendConfirmationEmail, 1000)
    
    return () => clearTimeout(timer)
  }, [course, user, emailSent, params.courseId])

  if (isLoading) {
    return <CheckoutSuccessSkeleton />
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="text-center text-destructive">
          <p className="text-xl mb-4">{error || "Curso no encontrado"}</p>
          <Link href="/cursos">
            <Button variant="outline" className="text-foreground border-border hover:bg-muted">
              Volver a Cursos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Success Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            ¡Compra Exitosa! 🎉
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Felicitaciones, has adquirido exitosamente el curso. Ya puedes comenzar a aprender.
          </p>
          {emailSent && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg inline-block">
              <p className="text-sm text-primary font-medium">
                ✉️ Email de confirmación enviado a {user?.email}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Course Details Card */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl text-card-foreground">
                  Detalles del Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-lg mx-auto sm:mx-0">
                    <img
                      src={getImageUrl(course.image.url) || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-2 sm:mb-3">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {course.category?.name}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {course.chapters?.length || 0} capítulos
                      </span>
                      <span className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        {course.modality}
                      </span>
                    </div>
                  </div>
                </div>

                {course.content && course.content.length > 0 && (
                  <div className="border-t border-border pt-4 sm:pt-6">
                    <h4 className="text-base sm:text-lg font-semibold text-card-foreground mb-3">
                      Información del Curso
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      Este curso incluye contenido detallado y material de estudio para tu aprendizaje.
                    </p>
                  </div>
                )}

                <div className="border-t border-border pt-4 sm:pt-6">
                  <h4 className="text-base sm:text-lg font-semibold text-card-foreground mb-4">
                    Lo que incluye tu compra:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-card-foreground text-sm">Acceso completo al curso</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="text-card-foreground text-sm">Certificado de finalización</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="text-card-foreground text-sm">Material de estudio</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <User className="w-5 h-5 text-primary" />
                      <span className="text-card-foreground text-sm">Soporte técnico</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps Card */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-card-foreground">
                  Próximos Pasos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-semibold text-xs sm:text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground text-sm sm:text-base">Accede a tu curso</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Ve al dashboard y encuentra tu curso en la lista
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-semibold text-xs sm:text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground text-sm sm:text-base">Comienza a aprender</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Navega por los capítulos y comienza tu aprendizaje
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-semibold text-xs sm:text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground text-sm sm:text-base">Obtén tu certificado</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Completa el curso para recibir tu certificado
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Ir al Dashboard
                    </Button>
                  </Link>
                  
                  <Link href={`/dashboard/cursos/${course.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      <Play className="w-4 h-4 mr-2" />
                      Comenzar Curso
                    </Button>
                  </Link>

                  <Link href="/cursos" className="w-full">
                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/50">
                      <Home className="w-4 h-4 mr-2" />
                      Ver Más Cursos
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutSuccessSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Success Header Skeleton */}
        <div className="text-center mb-8 sm:mb-12">
          <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6" />
          <Skeleton className="h-8 sm:h-10 w-64 sm:w-96 mx-auto mb-3 sm:mb-4" />
          <Skeleton className="h-5 sm:h-6 w-80 sm:w-2xl mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Course Details Card Skeleton */}
          <div className="lg:col-span-2">
            <Card className="bg-card border border-border">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <Skeleton className="h-6 sm:h-8 w-48 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl mx-auto sm:mx-0" />
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <Skeleton className="h-6 sm:h-8 w-3/4 mx-auto sm:mx-0" />
                    <Skeleton className="h-4 sm:h-5 w-1/3 mx-auto sm:mx-0" />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center sm:justify-start">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps Card Skeleton */}
          <div className="lg:col-span-1">
            <Card className="bg-card border border-border h-fit">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
