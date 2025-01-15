'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/AuthContext'
import { getCoursesByStudent } from '@/hooks/coursesAPI'
import { BasicCourse, DetailedCourse } from '@/types/CoursesType'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, BookOpen, BadgeIcon as Certificate, Settings } from 'lucide-react'
import Link from 'next/link'
import PurchasedCourseCard from './_components/PurchasedCourseCard'
import { useApiData } from '@/hooks/ApiContext'

export default function DashboardPage() {
  const { user } = useAuth()
 
  const {purchasedCourses , isLoading} = useApiData()
 
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
 
      <div className='content-section '>
      <Tabs defaultValue="courses">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">
            <BookOpen className="mr-2 h-4 w-4" />
            Mis Cursos
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <Certificate className="mr-2 h-4 w-4" />
            Certificados
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Mis Cursos</CardTitle>
              <CardDescription>Aquí puedes ver todos tus cursos adquiridos.</CardDescription>
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
                  <AlertDescription>No se pudo obtener la información de los cursos. Por favor, intenta de nuevo más tarde.</AlertDescription>
                </Alert>
              ) : purchasedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedCourses.map((course) => (
                    <Link key={course.documentId} href={`/dashboard/cursos/${course.titleSlug}`}>
                      <PurchasedCourseCard key={course.id} course={course} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-8">No se encontraron cursos para este estudiante.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Mis Certificados</CardTitle>
              <CardDescription>Aquí puedes ver y descargar tus certificados obtenidos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido de certificados (por implementar)</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Cuenta</CardTitle>
              <CardDescription>Gestiona la configuración de tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido de configuración (por implementar)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
    </>
  )
}

