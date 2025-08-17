"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/AuthContext"
import { useCurrency } from "@/hooks/CurrencyContext"
import type { DetailedCourse,   } from "@/types/CoursesType"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Users, Clock, Calendar, DollarSign, BookOpen, Banknote, CheckCircle, XCircle, Clock as ClockIcon, User, Settings } from "lucide-react"
import Link from "next/link"
import PurchasedCourseCard from "./_components/PurchasedCourseCard"
import AccountManagement from "./_components/AccountManagement"
import { useApiData } from "@/hooks/ApiContext"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { BasicUser } from "@/types/StudentType"
import { useSearchParams } from "next/navigation"
import { formatCourseStartDate, formatCourseEndDate } from "@/lib/dateUtils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { user } = useAuth()
  const { formatPrice } = useCurrency()
  const { purchasedCourses, isLoading, error: apiError, refreshPurchasedCourses } = useApiData()
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<{
    type: 'success' | 'error' | 'pending' | null
    message: string
    courseId?: string
  } | null>(null)
  const searchParams = useSearchParams()

  // Refrescar datos cuando el usuario cambie
  useEffect(() => {
    if (user?.email) {
      refreshPurchasedCourses()
    }
  }, [user?.email, refreshPurchasedCourses])

  // Manejar parámetros de URL de pagos
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const status = searchParams.get('status')
    const courseId = searchParams.get('courseId')
    const message = searchParams.get('message')

    if (success === 'payment_approved') {
      setPaymentStatus({
        type: 'success',
        message: '¡Pago exitoso! El curso ha sido agregado a tu cuenta.',
        courseId: courseId || undefined
      })
      // Refrescar cursos después de un pago exitoso
      setTimeout(() => {
        refreshPurchasedCourses()
      }, 1000)
    } else if (error === 'payment_failed') {
      setPaymentStatus({
        type: 'error',
        message: 'El pago no pudo ser procesado. Por favor, intenta de nuevo.',
        courseId: courseId || undefined
      })
    } else if (error === 'payment_rejected') {
      setPaymentStatus({
        type: 'error',
        message: 'El pago fue rechazado. Por favor, verifica tu información de pago.',
        courseId: courseId || undefined
      })
    } else if (status === 'payment_pending') {
      setPaymentStatus({
        type: 'pending',
        message: 'Tu pago está siendo procesado. Te notificaremos cuando esté listo.',
        courseId: courseId || undefined
      })
    } else if (error && message) {
      setPaymentStatus({
        type: 'error',
        message: decodeURIComponent(message),
        courseId: courseId || undefined
      })
    }

    // Limpiar el estado después de 10 segundos
    if (success || error || status) {
      setTimeout(() => {
        setPaymentStatus(null)
      }, 10000)
    }
  }, [searchParams, refreshPurchasedCourses])

  return (
    <>
      <div className="container-section p-4 sm:p-8 lg:p-16 h-[150px] sm:h-[180px] lg:h-[200px] bg-[url('/gradient4.jpg')] bg-cover bg-bottom">
        <div className="content-section">
          <header className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white leading-tight">
              Bienvenido, {user?.username}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-white">
              {user?.email}
            </p>
          </header>
        </div>
      </div>
      <div className="container-section p-4 sm:p-8 lg:p-16 bg-gray-50">
        <div className="content-section">
          {/* Alertas de estado de pago */}
          {paymentStatus && (
            <Alert className={`mb-4 sm:mb-6 ${
              paymentStatus.type === 'success' ? 'border-green-200 bg-green-50' :
              paymentStatus.type === 'error' ? 'border-red-200 bg-red-50' :
              'border-yellow-200 bg-yellow-50'
            }`}>
              {paymentStatus.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : paymentStatus.type === 'error' ? (
                <XCircle className="h-4 w-4 text-red-600" />
              ) : (
                <ClockIcon className="h-4 w-4 text-yellow-600" />
              )}
              <AlertTitle className={
                paymentStatus.type === 'success' ? 'text-green-800' :
                paymentStatus.type === 'error' ? 'text-red-800' :
                'text-yellow-800'
              }>
                {paymentStatus.type === 'success' ? 'Pago Exitoso' :
                 paymentStatus.type === 'error' ? 'Error en el Pago' :
                 'Pago Pendiente'}
              </AlertTitle>
              <AlertDescription className={
                paymentStatus.type === 'success' ? 'text-green-700' :
                paymentStatus.type === 'error' ? 'text-red-700' :
                'text-yellow-700'
              }>
                {paymentStatus.message}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-auto sm:h-10">
              <TabsTrigger value="courses" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Mis Cursos</span>
                <span className="sm:hidden">Cursos</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Mi Cuenta</span>
                <span className="sm:hidden">Cuenta</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab de Cursos */}
            <TabsContent value="courses">
              <Card>
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                    {user?.isTeacher ? "Mis Cursos Impartidos" : "Mis Cursos"}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {user?.isTeacher
                      ? "Aquí puedes ver todos los cursos que impartes y su información detallada."
                      : "Aquí puedes ver todos tus cursos adquiridos."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="space-y-3 sm:space-y-4">
                          <Skeleton className="h-48 sm:h-56 lg:h-64 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : apiError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{apiError}</AlertDescription>
                    </Alert>
                  ) : purchasedCourses.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No tienes cursos comprados</AlertTitle>
                      <AlertDescription>
                        Aún no has comprado ningún curso. Ve a la sección de cursos para explorar nuestras ofertas.
                      </AlertDescription>
                    </Alert>
                  ) : purchasedCourses.length > 0 ? (
                    <div className={`grid gap-4 sm:gap-6 ${
                      user?.isTeacher ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    }`}>
                      {purchasedCourses.map((course) =>
                        user?.isTeacher ? (
                          <TeacherCourseCard key={course.id} course={course as DetailedCourse} currentUserId={user.id} />
                        ) : (
                          <Link key={course.documentId} href={`/dashboard/cursos/${course.titleSlug}`}>
                            <PurchasedCourseCard course={course} />
                          </Link>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 mt-8">
                      No se encontraron cursos para este {user?.isTeacher ? "profesor" : "estudiante"}.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Cuenta */}
            <TabsContent value="account">
              <AccountManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

interface TeacherCourseCardProps {
  course: DetailedCourse
  currentUserId: number
}

function TeacherCourseCard({ course, currentUserId }: TeacherCourseCardProps) {
  const { formatPrice } = useCurrency()
  const students = course.users_permissions_users.filter((student) => student.id !== currentUserId)

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={course.id.toString()}>
        <AccordionTrigger className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2 sm:gap-0 text-left">
            <span className="text-base sm:text-lg lg:text-xl font-semibold">{course.title}</span>
            <span className="text-xs sm:text-sm text-muted-foreground">{course.category.name}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm sm:text-base">{students.length} estudiantes matriculados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm sm:text-base">Modalidad: {course.modality}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm sm:text-base">Inicio: {course.start_date ? formatCourseStartDate(course.start_date) : "Por confirmar"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm sm:text-base">Fin: {course.finish_date ? formatCourseEndDate(course.finish_date) : "Por confirmar"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Banknote className="h-4 w-4" />
                    <span className="text-sm sm:text-base">Precio: {course.price === 0 ? "GRATUITO" : formatPrice(course.price, course.priceUSD)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm sm:text-base">{course.chapters.length} capítulos</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Progreso general del curso</h4>
                  <Progress value={calculateCourseProgress(course, students)} className="w-full" />
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Promedio: {calculateCourseProgress(course, students).toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-6">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Progreso de estudiantes por capítulo</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Email</TableHead>
                        {course.chapters.map((chapter, index) => (
                          <TableHead key={chapter.id} className="text-xs sm:text-sm">Cap. {index + 1}</TableHead>
                        ))}
                        <TableHead className="text-xs sm:text-sm">Progreso Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="text-xs sm:text-sm">{student.email}</TableCell>
                          {course.chapters.map((chapter) => (
                            <TableCell key={chapter.id} className="text-center">
                              {isChapterCompleted(chapter, student) ? "✅" : "❌"}
                            </TableCell>
                          ))}
                          <TableCell className="w-24 sm:w-32">
                            <Progress value={calculateStudentProgress(course, student)} className="w-full mb-1" />
                            <span className="text-xs text-muted-foreground">
                              {calculateStudentProgress(course, student).toFixed(2)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function calculateCourseProgress(course: DetailedCourse, students: BasicUser[]): number {
  const totalProgress = course.chapters.reduce((sum, chapter) => {
    return (
      sum +
      chapter.user_progresses.filter(
        (progress) =>
          students.some((student) => student.id === progress.users_permissions_user?.id) && progress.isCompleted,
      ).length /
        students.length
    )
  }, 0)
  return (totalProgress / course.chapters.length) * 100
}

function calculateStudentProgress(course: DetailedCourse, student: BasicUser): number {
  const completedChapters = course.chapters.filter((chapter) => isChapterCompleted(chapter, student)).length
  return (completedChapters / course.chapters.length) * 100
}

function isChapterCompleted(chapter: DetailedCourse["chapters"][0], student: BasicUser): boolean {
  return chapter.user_progresses.some(
    (progress) => progress.users_permissions_user?.id === student.id && progress.isCompleted,
  )
}

