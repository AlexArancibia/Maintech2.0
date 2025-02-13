"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/AuthContext"
import type { DetailedCourse,   } from "@/types/CoursesType"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Users, Clock, Calendar, DollarSign, BookOpen, Banknote } from "lucide-react"
import Link from "next/link"
import PurchasedCourseCard from "./_components/PurchasedCourseCard"
import { useApiData } from "@/hooks/ApiContext"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { BasicUser } from "@/types/StudentType"

export default function DashboardPage() {
  const { user } = useAuth()
  const { purchasedCourses, isLoading } = useApiData()
  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <div className="container-section p-8 sm:p-16 h-[200px] bg-[url('/gradient4.jpg')] bg-cover bg-bottom">
        <div className="content-section">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white">Bienvenido, {user?.username}</h1>
            <p className="text-xl text-muted-foreground text-white">{user?.email}</p>
          </header>
        </div>
      </div>
      <div className="container-section p-8 sm:p-16 bg-gray-50">
        <div className="content-section">
          <Card>
            <CardHeader>
              <CardTitle>{user?.isTeacher ? "Mis Cursos Impartidos" : "Mis Cursos"}</CardTitle>
              <CardDescription>
                {user?.isTeacher
                  ? "Aquí puedes ver todos los cursos que impartes y su información detallada."
                  : "Aquí puedes ver todos tus cursos adquiridos."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="space-y-4">
                      <Skeleton className="h-64 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : purchasedCourses.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Información no disponible</AlertTitle>
                  <AlertDescription>
                    No se pudo obtener la información de los cursos. Por favor, intenta de nuevo más tarde.
                  </AlertDescription>
                </Alert>
              ) : purchasedCourses.length > 0 ? (
                <div className={`grid ${user?.isTeacher ? "grid-cols-1" : "grid-cols-3"} gap-6`}>
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
  const students = course.users_permissions_users.filter((student) => student.id !== currentUserId)

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={course.id.toString()}>
        <AccordionTrigger>
          <div className="flex justify-between items-center w-full">
            <span className="text-xl font-semibold">{course.title}</span>
            <span className="text-sm text-muted-foreground">{course.category.name}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{students.length} estudiantes matriculados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Modalidad: {course.modality}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Inicio: {new Date(course.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Fin: {new Date(course.finish_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Banknote className="h-4 w-4" />
                    <span>Precio: ${course.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.chapters.length} capítulos</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Progreso general del curso</h4>
                  <Progress value={calculateCourseProgress(course, students)} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Promedio: {calculateCourseProgress(course, students).toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Progreso de estudiantes por capítulo</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      {course.chapters.map((chapter, index) => (
                        <TableHead key={chapter.id}>Cap. {index + 1}</TableHead>
                      ))}
                      <TableHead>Progreso Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.email}</TableCell>
                        {course.chapters.map((chapter) => (
                          <TableCell key={chapter.id}>{isChapterCompleted(chapter, student) ? "✅" : "❌"}</TableCell>
                        ))}
                        <TableCell>
                          <Progress value={calculateStudentProgress(course, student)} className="w-full" />
                          <span className="text-sm text-muted-foreground">
                            {calculateStudentProgress(course, student).toFixed(2)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
          students.some((student) => student.id === progress.users_permissions_user.id) && progress.isCompleted,
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
    (progress) => progress.users_permissions_user.id === student.id && progress.isCompleted,
  )
}

