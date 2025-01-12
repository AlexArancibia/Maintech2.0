'use client'

import { getCoursesByStudent } from '@/hooks/coursesAPI'
import { BasicCourse } from '@/types/CoursesType'
import React, { useEffect, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import CourseCard from '@/components/CourseCard'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from 'next/link'
import { useAuth } from '@/hooks/AuthContext'

export default function StudentCoursesPage() {
  const {user} = useAuth() 
  const [studentCourses, setStudentCourses] = useState<BasicCourse[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true)
        const courses = await getCoursesByStudent(user!.email)
        setStudentCourses(courses)
      } catch (err) {
        setError("Error fetching courses. Please try again later.")
        console.error("Error fetching courses:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Mis Cursos</h1>

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
      ) : studentCourses === null ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Información no disponible</AlertTitle>
          <AlertDescription>No se pudo obtener la información de los cursos. Por favor, intenta de nuevo más tarde.</AlertDescription>
        </Alert>
      ) : studentCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentCourses.map((course) => (
            <Link key={course.documentId} href={`/dashboard/cursos/${course.titleSlug}`}>
            <CourseCard key={course.id} course={course} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No se encontraron cursos para este estudiante.</p>
      )}
    </div>
  )
}