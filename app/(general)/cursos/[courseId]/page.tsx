"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getImageUrl } from "@/lib/getImageUrl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useApiData } from "@/hooks/ApiContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCourseBySlug } from "@/hooks/coursesAPI"
import type { DetailedCourse } from "@/types/CoursesType"
import { Phone } from "lucide-react"
import Link from "next/link"
import CourseCard from "@/components/CourseCard"
import api from "@/lib/axios"
import { useAuth } from "@/hooks/AuthContext"
import { CourseDetails } from "./_components/CourseDetails"
import { CourseInfo } from "./_components/CourseInfo"
import { ChapterInfo } from "./_components/ChapterInfo"
import Features from "./_components/CourseFeatures"
import { socialLinks } from "@/lib/social"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import TeacherCard from "@/components/TeacherCard"

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
  const [whatsappUrl, setWhatsappUrl] = useState<string>("")
  const [isCoursePurchased, setIsCoursePurchased] = useState<boolean>(false)
  const [course, setCourse] = useState<DetailedCourse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    tipoDoc: "",
    numDoc: "",
    telefono: "",
    pais: "",
    empresa: "",
    asunto: `Información Curso`, // Inicialmente sin título
  })

  const [enviando, setEnviando] = useState(false)
  const [resultadoEnvio, setResultadoEnvio] = useState<{ exito?: boolean; mensaje?: string } | null>(null)

  async function handleBuy() {
    if (!user || !course) return
    const payload: PostPurchase = {
      data: {
        users_permissions_users: {
          connect: [user.id],
        },
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
        if (fetchedCourse && "chapters" in fetchedCourse) {
          setCourse(fetchedCourse)
          if (user) {
            const purchaseFound = purchasedCourses.find((item) => item.titleSlug === params.courseId)
            setIsCoursePurchased(!!purchaseFound)
          }

          const message = encodeURIComponent(
            `Hola, me gustaría obtener más información sobre el curso: ${fetchedCourse?.title}.`,
          )
          setWhatsappUrl(`https://wa.me/${socialLinks.whatsapp}?text=${message}`)
        } else {
          setError("Course not found or insufficient details")
        }
      } catch (err) {
        setError("Failed to fetch course details")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.courseId, user, purchasedCourses])

  // Sincroniza el asunto cuando course cambie
  useEffect(() => {
    if (course && course.title) {
      setFormData((prev) => ({
        ...prev,
        asunto: `Información Curso ${course.title}`,
      }))
    }
  }, [course])

  const handleSubmit = async (e: React.FormEvent) => {
    
    console.log("CURSOOOO",course)
 
    e.preventDefault()
    setEnviando(true)
    setResultadoEnvio(null)

    // Asegura que el asunto esté actualizado justo antes de enviar
    const asuntoFinal = course && course.title ? `Información Curso ${course.title}` : "Información Curso"
    const formDataToSend = { ...formData, asunto: asuntoFinal }

    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()
      setResultadoEnvio({
        exito: true,
        mensaje: "Formulario enviado con éxito. Nos pondremos en contacto contigo pronto.",
      })

      // Limpiar el formulario después de un envío exitoso
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        tipoDoc: "",
        numDoc: "",
        telefono: "",
        pais: "",
        empresa: "",
        asunto: `Información Curso ${course?.title}`,
      })
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      setResultadoEnvio({
        exito: false,
        mensaje: "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
      })
    } finally {
      setEnviando(false)
    }
  }

  if (isLoading) {
    return <CourseDetailsSkeleton />
  }

  if (error || !course) {
    return <div className="text-center text-red-500 mt-8">{error || "Failed to load course"}</div>
  }

  return (
    <>
      <div className=" container-section  bg-gradient-to-br from-black via-sky-950 to-slate-950 bg-cover">
        <div className="content-section py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-16">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{course.title}</h1>
                </div>

                <div className="w-full rounded-lg overflow-hidden bg-slate-800">
                  <img
                    src={getImageUrl(course.image.url) || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-fit object-cover"
                  />
                </div>

                <CourseDetails course={course} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4">
                {/* Versión desktop - Card fijo */}
                <Card className="hidden lg:block bg-black/10 backdrop-blur-md border border-white/10 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-center text-white">Solicitar información</CardTitle>
                    <p className="text-center text-white/70 text-sm mt-2">
                      Completa el formulario y nos pondremos en contacto contigo
                    </p>
                  </CardHeader>
                  <CardContent>
                    {resultadoEnvio && (
                      <div
                        className={`p-4 rounded-lg mb-4 backdrop-blur-sm ${
                          resultadoEnvio.exito 
                            ? "bg-green-500/20 text-green-200 border border-green-500/30" 
                            : "bg-red-500/20 text-red-200 border border-red-500/30"
                        }`}
                      >
                        {resultadoEnvio.mensaje}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          id="nombre"
                          placeholder="Nombre"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Input
                          id="apellido"
                          placeholder="Apellido"
                          value={formData.apellido}
                          onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Correo Electrónico"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Select
                            value={formData.tipoDoc}
                            onValueChange={(value) => setFormData({ ...formData, tipoDoc: value })}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm focus:bg-white/15 focus:border-white/40">
                              <SelectValue placeholder="Documento" className="text-white/80" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800/95 backdrop-blur-md border-white/20">
                              <SelectItem value="dni" className="text-white hover:bg-white/10">
                                DNI
                              </SelectItem>
                              <SelectItem value="ce" className="text-white hover:bg-white/10">
                                Carnet de Extranjería
                              </SelectItem>
                              <SelectItem value="pasaporte" className="text-white hover:bg-white/10">
                                Pasaporte
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Input
                            id="numDoc"
                            placeholder="Número de documento"
                            value={formData.numDoc}
                            onChange={(e) => setFormData({ ...formData, numDoc: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Input
                          id="telefono"
                          type="tel"
                          placeholder="Teléfono móvil"
                          value={formData.telefono}
                          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Input
                          id="pais"
                          placeholder="País"
                          value={formData.pais}
                          onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Input
                          id="empresa"
                          placeholder="Empresa"
                          value={formData.empresa}
                          onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                          required={false}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-500 hover:to-blue-500 text-white backdrop-blur-sm border border-cyan-400/30 shadow-lg"
                        disabled={enviando}
                      >
                        {enviando ? "Enviando..." : "Enviar"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Versión móvil - Acordeón */}
                <div className="lg:hidden">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="contact-form" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline">
                        <div className="text-left">
                          <div className="text-lg font-semibold">Solicitar información</div>
                          <div className="text-sm text-white/70 font-normal">Completa el formulario y nos pondremos en contacto contigo</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Card className="bg-black/10 backdrop-blur-md border border-white/10 shadow-lg mt-2">
                          <CardContent className="pt-6">
                            {resultadoEnvio && (
                              <div
                                className={`p-4 rounded-lg mb-4 backdrop-blur-sm ${
                                  resultadoEnvio.exito 
                                    ? "bg-green-500/20 text-green-200 border border-green-500/30" 
                                    : "bg-red-500/20 text-red-200 border border-red-500/30"
                                }`}
                              >
                                {resultadoEnvio.mensaje}
                              </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="space-y-2">
                                <Input
                                  id="nombre-mobile"
                                  placeholder="Nombre"
                                  value={formData.nombre}
                                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                                />
                              </div>

                              <div className="space-y-2">
                                <Input
                                  id="apellido-mobile"
                                  placeholder="Apellido"
                                  value={formData.apellido}
                                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                                />
                              </div>

                              <div className="space-y-2">
                                <Input
                                  id="email-mobile"
                                  type="email"
                                  placeholder="Correo Electrónico"
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                                />
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                  <Select
                                    value={formData.tipoDoc}
                                    onValueChange={(value) => setFormData({ ...formData, tipoDoc: value })}
                                  >
                                    <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm focus:bg-white/15 focus:border-white/40">
                                      <SelectValue placeholder="Documento" className="text-white/80" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800/95 backdrop-blur-md border-white/20">
                                      <SelectItem value="dni" className="text-white hover:bg-white/10">
                                        DNI
                                      </SelectItem>
                                      <SelectItem value="ce" className="text-white hover:bg-white/10">
                                        Carnet de Extranjería
                                      </SelectItem>
                                      <SelectItem value="pasaporte" className="text-white hover:bg-white/10">
                                        Pasaporte
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Input
                                    id="numDoc-mobile"
                                    placeholder="Número de documento"
                                    value={formData.numDoc}
                                    onChange={(e) => setFormData({ ...formData, numDoc: e.target.value })}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Input
                                  id="telefono-mobile"
                                  type="tel"
                                  placeholder="Teléfono móvil"
                                  value={formData.telefono}
                                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                                />
                              </div>

                              <div className="space-y-2">
                                <Input
                                  id="pais-mobile"
                                  placeholder="País"
                                  value={formData.pais}
                                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                                />
                              </div>

                              <div className="space-y-2">
                                <Input
                                  id="empresa-mobile"
                                  placeholder="Empresa"
                                  value={formData.empresa}
                                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/80 backdrop-blur-sm focus:bg-white/15 focus:border-white/40"
                                  required={false}
                                />
                              </div>

                              <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-500 hover:to-blue-500 text-white backdrop-blur-sm border border-cyan-400/30 shadow-lg"
                                disabled={enviando}
                              >
                                {enviando ? "Enviando..." : "Enviar"}
                              </Button>
                            </form>
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className=" my-4  flex w-full flex-col gap-2">
                  {!isCoursePurchased ? (
                    <Link href={whatsappUrl}>
                      <Button
                        onClick={handleBuy}
                        className="w-full flex  text-green-50 gap-4 border-none shadow-md   bg-gradient-to-r from-green-500 to-green-700 hover:bg-green-700 hover:text-white"
                        variant="outline"
                      >
                        <Phone size={2} className="" />
                        Consultar por Whatsapp
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/dashboard/cursos/${params.courseId}`}>
                      <Button variant="outline" className="bg-primary text-white border-none shadow-md   w-full transition-colors">
                        Ver Curso
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-section  py-6 sm:py-8 sm:pb-0 bg-gray-100 ">
        <div className="content-section">
          <Features />
        </div>
        <div className="content-section flex gap-4">
          <div className="w-full p-6 border  transition-all shadow-none hover:shadow-none     bg-white/80 rounded-xl">
            <CourseInfo info={course.info} teacher={course.teacher} />

            <ChapterInfo chapters={course.chapters} />

            <section className=" mb-4 sm:mb-4 ">
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                </div>
              ) : (() => {
                const relatedCourses = basicCourses
                  .filter(basicCourse => basicCourse.titleSlug !== params.courseId)
                  .filter(basicCourse => basicCourse.category?.name === course.category?.name);
                if (relatedCourses.length === 0) return null;
                return (
                  <>
                    <h3 className="text-2xl font-semibold mb-10 text-gray-800">Cursos Relacionados</h3>
                    <div className="grid lg:grid-cols-3 gap-6 sm:gap-6">
                      {relatedCourses.map(basicCourse => (
                        <Link key={basicCourse.documentId} href={`/cursos/${basicCourse.titleSlug}`}>
                          <CourseCard course={basicCourse} />
                        </Link>
                      ))}
                    </div>
                  </>
                );
              })()}
            </section>
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
            <Skeleton className="h-8 w-24 bg-slate-700 mb-2" />
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

