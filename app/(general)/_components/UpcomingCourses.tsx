'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Bookmark } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

const upcomingCourses = [
  {
    day: "1",
    month: "Feb",
    title: "CURSO INTERNACIONAL PREPARACIÓN EXAMEN",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&q=80",
    altText: "Group of people studying together at a table"
  },
  {
    day: "3",
    month: "Feb",
    title: "GESTIÓN POR PROCESOS Y MEJORA CONTINUA",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&q=80",
    altText: "Construction worker in safety gear on site"
  },
  {
    day: "9",
    month: "Ene",
    title: "MS PROJECT APLICADO A LA CONSTRUCCIÓN",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&q=80",
    altText: "Person working on a laptop with project management software"
  },
  {
    day: "1",
    month: "Oct",
    title: "CURSO INTERNACIONAL PREPARACIÓN EXAMEN",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&q=80",
    altText: "Group of people studying together at a table"
  }
]

export default function UpcomingCourses() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className="bg-gray-100">
      <div className="container-section rounded-tl-[100px] sm:rounded-tl-[150px] md:rounded-tl-[200px]"
        style={{
          backgroundImage: 'url("/upcoming.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        <div className="content-section flex flex-col lg:flex-row justify-between gap-8 py-12 lg:py-16 pt-24 lg:pt-32">
          {/* Left Column */}
          <div className="text-white space-y-6 flex flex-col justify-center">
            <h1 className="font-orbitron text-3xl font-normal sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
              Lo más<br/>
              próximo a<br/>
              <span className="font-bold">aperturar</span>
            </h1>
            <div className="w-fit bg-accent py-2 px-4 sm:px-6 text-base sm:text-lg md:text-xl rounded-full">
              Aprende con los mejores
            </div>
            <p className="text-gray-300 max-w-lg text-sm sm:text-base">
              Los próximos cursos virtuales que se abrirán próximamente ofrecen
              una excelente oportunidad para actualizar tus conocimientos en
              diversas áreas.
            </p>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 my-8 lg:my-12 w-full lg:w-[500px] xl:w-[600px]">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
              Informate de todas las novedades
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Nombre completo"
                className="rounded-lg"
              />
              <Input
                type="email"
                placeholder="Correo electrónico"
                className="rounded-lg"
              />
              <Input
                type="tel"
                placeholder="Teléfono"
                className="rounded-lg"
              />
              <Button 
                type="submit"
                className="w-full bg-[#00D1FF] hover:bg-[#00D1FF]/90 text-white"
              >
                Enviar
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
            <CarouselContent>
              {upcomingCourses.map((course, index) => (
                <CarouselItem key={index} className="pl-4 md:pl-6 sm:basis-1/2 lg:basis-1/3">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col">
                    <div className="relative h-48 sm:h-56 md:h-64">
                      <Image
                        src={course.image}
                        alt={course.altText}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="bg-[#F1536D] text-white rounded-lg p-2 text-center min-w-[50px] sm:min-w-[60px]">
                          <div className="text-base sm:text-lg font-bold">{course.day}</div>
                          <div className="text-xs sm:text-sm">{course.month}</div>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-800 flex-grow">
                          {course.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 text-gray-500 mt-auto">
                        <button className="hover:text-[#F1536D] transition-colors">
                          <Heart size={18} />
                        </button>
                        <button className="hover:text-[#F1536D] transition-colors">
                          <MessageCircle size={18} />
                        </button>
                        <button className="hover:text-[#F1536D] transition-colors">
                          <Bookmark size={18} />
                        </button>
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

