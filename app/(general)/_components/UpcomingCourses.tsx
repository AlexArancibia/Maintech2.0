"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useApiData } from "@/hooks/ApiContext"
import type { BasicCourse } from "@/types/CoursesType"
import { getImageUrl } from "@/lib/getImageUrl"

const convertToPeruTime = (date: Date): Date => {
  // Añadir 5 horas para GMT-5
  return new Date(date.getTime() + (5 * 60 * 60 * 1000))
}

const calculateCourseDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  // Convertir a fecha local sin hora para comparar solo fechas
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  
  const diffTime = endDay.getTime() - startDay.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return "1 día"
  } else if (diffDays === 1) {
    return "2 días"
  } else {
    return `${diffDays + 1} días`
  }
}

export default function UpcomingCourses() {
  const { basicCourses, isLoading } = useApiData()
  const [upcomingCourses, setUpcomingCourses] = useState<BasicCourse[]>([])
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto:"Información Proximos Cursos"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formResult, setFormResult] = useState<{ success?: boolean; message?: string }>({})

  useEffect(() => {
    if (basicCourses.length > 0) {
      const now = convertToPeruTime(new Date())
      const upcoming = basicCourses
        .filter((course) => {
          const courseStartDate = convertToPeruTime(new Date(course.start_date))
          return courseStartDate > now
        })
        .sort((a, b) => {
          const dateA = convertToPeruTime(new Date(a.start_date))
          const dateB = convertToPeruTime(new Date(b.start_date))
          return dateA.getTime() - dateB.getTime()
        })
        .slice(0, 10) // Get the next 4 upcoming courses
      setUpcomingCourses(upcoming)
    }
  }, [basicCourses])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormResult({})

    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setFormResult(data)

      if (data.success) {
        setFormData({ nombre: "", email: "", telefono: "",asunto:"Información Proximos Cursos" })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormResult({ success: false, message: `An error occurred: ${error}` })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-100">
      <div
        className="container-section rounded-tl-[100px] sm:rounded-tl-[150px] md:rounded-tl-[200px]"
        style={{
          backgroundImage: 'url("/upcoming.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="content-section flex flex-col lg:flex-row justify-between gap-8 py-12 lg:py-16 pt-24 lg:pt-32">
          {/* Left Column */}
          <div className="text-white space-y-6 flex flex-col justify-center">
            <h1 className="font-orbitron text-3xl font-normal sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
              Lo más
              <br />
              próximo a<br />
              <span className="font-bold">aperturar</span>
            </h1>
            <div className="w-fit bg-accent py-2 px-4 sm:px-6 text-base sm:text-lg md:text-xl rounded-full">
              Aprende con los mejores
            </div>
            <p className="text-gray-300 max-w-lg text-sm sm:text-base">
              Los próximos cursos virtuales que se abrirán próximamente ofrecen una excelente oportunidad para
              actualizar tus conocimientos en diversas áreas.
            </p>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 my-8 lg:my-12 w-full lg:w-[500px] xl:w-[600px]">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
              Informate de todas las novedades
            </h2>
            {formResult.message && (
              <div
                className={`p-4 rounded-lg mb-4 ${formResult.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {formResult.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                className="rounded-lg"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                className="rounded-lg"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                className="rounded-lg"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                className="w-full bg-[#00D1FF] hover:bg-[#00D1FF]/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </form>
          </div>
        </div>
        <div className="h-[50px] sm:h-[75px] md:h-[100px]"></div>
      </div>
      <div className="container-section">
        <div className="content-section pb-12 sm:pb-16 md:pb-20 -mt-[60px] sm:-mt-[90px] md:-mt-[120px]">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="shadow-none">
              {isLoading
                ? Array(4)
                    .fill(null)
                    .map((_, index) => (
                      <CarouselItem key={index} className="pl-4 md:pl-6 sm:basis-1/2 lg:basis-1/3">
                        <div className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col">
                          <div className="relative h-48 sm:h-56 md:h-64">
                            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                          </div>
                          <div className="p-4 sm:p-6 flex flex-col flex-grow">
                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                              <div className="bg-gray-200 rounded-lg p-2 text-center min-w-[50px] sm:min-w-[60px] animate-pulse">
                                <div className="h-6 w-8 bg-gray-300 mb-1"></div>
                                <div className="h-4 w-12 bg-gray-300"></div>
                              </div>
                              <div className="h-6 w-3/4 bg-gray-200 animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))
                : upcomingCourses.map((course, index) => (
                    <CarouselItem key={index} className="pl-4 md:pl-4 sm:basis-1/2 lg:basis-1/3 ">
                      <div className="bg-white rounded-xl   shadow-md h-full flex flex-col">
                        <div className="relative h-48 sm:h-56 md:h-64">
                          <img src={getImageUrl(course.image.url) || "/placeholder.svg"} alt={course.title} />
                        </div>
                        <div className="p-4 sm:p-6 flex flex-col flex-grow">
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 mt-4">
                            <div className="bg-[#F1536D] text-white rounded-lg p-2 text-center min-w-[50px] sm:min-w-[60px]">
                              <div className="text-base sm:text-lg font-bold">
                                {convertToPeruTime(new Date(course.start_date)).getDate()}
                              </div>
                              <div className="text-xs sm:text-sm">
                                {convertToPeruTime(new Date(course.start_date)).toLocaleString("default", { month: "short" })}
                              </div>
                            </div>
                            <div className="flex flex-col flex-grow">
                              <h3 className="font-bold text-base sm:text-lg text-gray-800">{course.title}</h3>
                              <h3 className="font-medium text-sm text-gray-600">
                                {course.category ? course.category.name : " "}
                              </h3>
                              
                              {/* Precio y duración */}
                              <div className="flex flex-col gap-1 mt-2">
                                {course.price === 0 ? (
                                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold w-fit">
                                    🎉 CURSO GRATUITO
                                  </div>
                                ) : (
                                  <div className="text-sm font-semibold text-blue-600">
                                    S/ {course.price.toFixed(2)}
                                  </div>
                                )}
                                <div className="text-xs text-gray-500">
                                  📅 Duración: {calculateCourseDuration(course.start_date, course.finish_date)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-5 md:-left-6" />
            <CarouselNext className="hidden sm:flex -right-4 sm:-right-5 md:-right-6" />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

