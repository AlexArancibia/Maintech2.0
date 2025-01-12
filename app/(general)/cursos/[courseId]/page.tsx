'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getImageUrl } from '@/lib/getImageUrl'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApiData } from '@/hooks/ApiContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCourseBySlug } from '@/hooks/coursesAPI'
import { BasicCourse, DetailedCourse } from '@/types/CoursesType'
import { Clock, Book, Award, ShoppingCart, Calendar } from 'lucide-react'
import Link from 'next/link'
import CourseCard from '@/components/CourseCard'
import TeacherCard from '@/components/TeacherCard'
import CertificationSection from '@/components/CertificateBanner'
import { IdConversion } from '@/lib/IdConvertion'
import api from '@/lib/axios'
import { useAuth } from '@/hooks/AuthContext'
import { CourseDetails } from './_components/CourseDetails'
import { CourseInfo } from './_components/CourseInfo'
import { ChapterInfo } from './_components/ChapterInfo'
 
type Params = {
  courseId: string
}

interface PostPurchase {
  data: {
    users_permissions_users: {
      connect: number[]
    }
  }
}

export default function CourseDetailsPage() {
  const { user, purchasedCourses } = useAuth()  
  const router = useRouter()
  const params = useParams<Params>()
  const { basicCourses, categories } = useApiData()
  const [isCoursePurchased, setIsCoursePurchased] = useState<boolean>(false)
  const [course, setCourse] = useState<DetailedCourse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    tipoDoc: '',
    numDoc: '',
    telefono: '',
    departamento: ''
  })

  async function handleBuy() {
    if (!user || !course) return
    const payload: PostPurchase = {
      data: {
        users_permissions_users: {
          connect: [user.id]
        }
      },
    }
    try {
      await api.put(`/api/courses/${course.documentId}`, payload)
      router.refresh()
      setIsCoursePurchased(true)
    } catch (error) {
      console.error("Error purchasing course:", error)
    }
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const fetchedCourse = await getCourseBySlug(params.courseId, true)
        if (fetchedCourse && 'chapters' in fetchedCourse) {
          setCourse(fetchedCourse)
          if (user) {
            const purchaseFound = purchasedCourses.find((item) => item.titleSlug === params.courseId)
            setIsCoursePurchased(!!purchaseFound)
          }
        } else {
          setError('Course not found or insufficient details')
        }
      } catch (err) {
        setError('Failed to fetch course details')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.courseId, user, purchasedCourses])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  if (isLoading) {
    return <CourseDetailsSkeleton />
  }

  if (error || !course) {
    return <div className="text-center text-red-500 mt-8">{error || 'Failed to load course'}</div>
  }

  return (
    <>
      <div className=" container-section bg-[url('/gradient7.jpg')] bg-cover">
        <div className="content-section py-10 sm:py-16" >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-16">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
    
                  <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                    {course.title}
                  </h1>
                </div>

 

                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-800">
                  <img 
                    src={getImageUrl(course.image.url)} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <CourseDetails course={course} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl text-center text-slate-800">
                    Solicitar información
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                          id="nombre"
                          placeholder="Nombre"
                          value={formData.nombre}
                          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          className='bg-gray-50'
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="primerApellido">Primer Apellido</Label>
                        <Input
                          id="primerApellido"
                          placeholder="Primer Apellido"
                          value={formData.primerApellido}
                          onChange={(e) => setFormData({...formData, primerApellido: e.target.value})}
                          className='bg-gray-50'
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="segundoApellido">Segundo Apellido</Label>
                      <Input
                        id="segundoApellido"
                        placeholder="Segundo Apellido"
                        value={formData.segundoApellido}
                        onChange={(e) => setFormData({...formData, segundoApellido: e.target.value})}
                        className='bg-gray-50'
                        />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className='bg-gray-50'
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tipoDoc">Tipo de Documento</Label>
                        <Select
                          value={formData.tipoDoc}
                          onValueChange={(value) => setFormData({...formData, tipoDoc: value})}
                          
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dni" className='bg-gray-50'>DNI</SelectItem>
                            <SelectItem value="ce" className='bg-gray-50'>Carnet de Extranjería</SelectItem>
                            <SelectItem value="pasaporte" className='bg-gray-50'>Pasaporte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numDoc">Nro. de documento</Label>
                        <Input
                          id="numDoc"
                          placeholder="Número de documento"
                          value={formData.numDoc}
                          onChange={(e) => setFormData({...formData, numDoc: e.target.value})}
                          className='bg-gray-50'
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono móvil</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="Teléfono móvil"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        className='bg-gray-50'
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento de residencia</Label>
                      <Select
                        value={formData.departamento}
                        onValueChange={(value) => setFormData({...formData, departamento: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lima">Lima</SelectItem>
                          <SelectItem value="arequipa">Arequipa</SelectItem>
                          <SelectItem value="cusco">Cusco</SelectItem>
                          <SelectItem value="trujillo">Trujillo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                      Enviar
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        
      </div>

      <div className="container-section  py-6 sm:py-16 sm:pb-0 bg-gray-100 ">
          <div className='content-section flex gap-12'>
            <div className="w-full sm:w-2/3   mx-auto sm:pr-12">
               <CourseInfo info={course.info} />
             
               <ChapterInfo chapters={course.chapters} />

              <section className=" mb-4 sm:mb-12 ">
                <h3 className="text-2xl font-semibold mb-10 text-gray-800">Cursos Relacionados</h3>
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {Array(6).fill(0).map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </div>
                ) : basicCourses.length > 0 ? (
                  <div className="grid lg:grid-cols-2 gap-6 sm:gap-6">
                    {basicCourses.map((basicCourse) => (
                      basicCourse.category?.name === course.category?.name && (
                        <Link key={basicCourse.documentId} href={`/curso/${basicCourse.titleSlug}`}>
                          <CourseCard course={basicCourse} />
                        </Link>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    No se encontraron cursos para la categoría seleccionada.
                  </p>
                )}
              </section>
            </div>

            <div className='hidden sm:flex sm:flex-col w-1/3 items-end ' >
              <TeacherCard teacher={course.teacher} />

              <div className=' my-4  max-w-[430px] flex w-full flex-col gap-6'>
                {!isCoursePurchased ? (
                  <Button onClick={handleBuy} className='w-full'>
                    Comprar Curso
                  </Button>
                ) : 
                <Link href={`/dashboard/cursos/${params.courseId}`}>
                  <Button
                    variant="outline"
                    className='   w-full transition-colors'
                  >
                    Ver Curso
                  </Button>
                </Link>}
              </div>
            </div>
          </div>
        </div>
       
    </>
  )
}

function CourseDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton  className="h-8 w-24 bg-slate-700 mb-2" />
            <Skeleton className="h-12 w-3/4 bg-slate-700 mb-4" />
            <Skeleton className="h-20 w-full bg-slate-700 mb-6" />
            <Skeleton className="w-full h-64 bg-slate-700 mb-6" />
            <div className="flex justify-between mb-8">
              <Skeleton className="h-10 w-24 bg-slate-700" />
              <Skeleton className="h-10 w-24 bg-slate-700" />
              <Skeleton className="h-10 w-24 bg-slate-700" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card className="bg-white">
              <CardHeader>
                <Skeleton className="h-6 w-36 bg-slate-200" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-10 w-full bg-slate-200" />
                ))}
                <Skeleton className="h-10 w-full bg-slate-200" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-slate-100 to-white py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 bg-slate-300 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-48" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

