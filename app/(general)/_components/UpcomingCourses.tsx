"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useApiData } from "@/hooks/ApiContext"
import type { BasicCourse } from "@/types/CoursesType"
import { getImageUrl } from "@/lib/getImageUrl"
import Link from "next/link"
import { convertToPeruTime, calculateDuration, isOlderThanOneDay, formatCourseDateSafe } from "@/lib/dateUtils"
import { useCurrency } from "@/hooks/CurrencyContext"

export default function UpcomingCourses() {
  const { basicCourses, isLoading } = useApiData()
  const { formatPrice } = useCurrency()
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
      const upcoming = basicCourses
        .filter((course) => {
          // Solo mostrar cursos que no sean más antiguos que un día antes
          return course.start_date && !isOlderThanOneDay(course.start_date)
        })
        .sort((a, b) => {
          if (!a.start_date || !b.start_date) return 0;
          const dateA = convertToPeruTime(a.start_date)
          const dateB = convertToPeruTime(b.start_date)
          if (!dateA || !dateB) return 0;
          return dateA.getTime() - dateB.getTime()
        })
        .slice(0, 10) // Get the next 10 upcoming courses
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
        <div className="content-section pb-12 sm:pb-16 md:pb-20 -mt-[40px] sm:-mt-[60px] md:-mt-[80px] relative z-10">
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
                          {/* Skeleton de imagen */}
                          <div className="relative h-48 sm:h-56 md:h-64 flex-shrink-0">
                            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                          </div>
                          
                          {/* Skeleton de contenido */}
                          <div className="p-4 sm:p-6 flex flex-col flex-grow min-h-0">
                            <div className="flex items-start gap-3 sm:gap-4">
                              {/* Skeleton de fecha */}
                              <div className="bg-gray-200 rounded-lg p-2 text-center min-w-[50px] sm:min-w-[60px] flex-shrink-0 animate-pulse">
                                <div className="h-6 w-8 bg-gray-300 mb-1"></div>
                                <div className="h-4 w-12 bg-gray-300"></div>
                              </div>
                              
                              {/* Skeleton de información */}
                              <div className="flex flex-col flex-grow min-w-0">
                                <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2"></div>
                                <div className="h-4 w-1/2 bg-gray-200 animate-pulse mb-3"></div>
                                <div className="h-4 w-2/3 bg-gray-200 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))
                : upcomingCourses.map((course, index) => (
                    <CarouselItem key={index} className="pl-4 md:pl-4 sm:basis-1/2 lg:basis-1/3 ">
                      <Link href={`/cursos/${course.titleSlug}`} className="block h-full">
                        <div className="bg-white rounded-xl shadow-md h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                          {/* Imagen del curso */}
                          <div className="relative h-48 sm:h-56 md:h-64 flex-shrink-0">
                            <img 
                              src={getImageUrl(course.image.url) || "/placeholder.svg"} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Contenido del card */}
                          <div className="p-4 sm:p-6 flex flex-col flex-grow min-h-0">
                            <div className="flex items-start gap-3 sm:gap-4">
                              {/* Fecha */}
                              <div className="bg-[#F1536D] text-white rounded-lg p-2 text-center min-w-[50px] sm:min-w-[60px] flex-shrink-0">
                                <div className="text-base sm:text-lg font-bold leading-tight">
                                  {course.start_date ? formatCourseDateSafe(course.start_date, { day: "numeric" }) : "?"}
                                </div>
                                <div className="text-xs sm:text-sm font-bold leading-tight">
                                  {course.start_date ? formatCourseDateSafe(course.start_date, { month: "short" }) : "TBD"}
                                </div>
                              </div>
                              
                              {/* Información del curso */}
                              <div className="flex flex-col flex-grow min-w-0">
                                <h3 className="font-bold text-base sm:text-lg text-gray-800 leading-tight mb-1 line-clamp-2">
                                  {course.title}
                                </h3>
                                <h4 className="font-medium text-sm text-gray-600 mb-2 line-clamp-1">
                                  {course.category ? course.category.name : "Sin categoría"}
                                </h4>
                                
                                {/* Precio y duración */}
                                <div className="flex flex-col gap-1 mt-auto">
                                  {course.price === 0 ? (
                                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold w-fit">
                                      🎉 GRATUITO
                                    </div>
                                  ) : (
                                    <div className="text-sm font-semibold text-blue-600">
                                      {formatPrice(course.price, course.priceUSD)}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500 line-clamp-1">
                                    📅 {course.start_date && course.finish_date ? calculateDuration(course.start_date, course.finish_date) : "Duración por confirmar"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
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

