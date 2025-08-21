"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { 
  FaUsers, 
  FaGraduationCap, 
  FaBriefcase, 
  FaBolt, 
  FaDesktop, 
  FaDollarSign 
} from "react-icons/fa"
import { useState } from "react"

const achievements = [
  {
    title: "Experiencia con +40 empresas",
    description: "del sector industrial a nivel LATAM",
    icon: FaUsers
  },
  {
    title: "Planes de formación",
    description: "a nivel LATAM",
    icon: FaGraduationCap
  },
  {
    title: "+500 trabajos",
    description: "a nivel LATAM",
    icon: FaBriefcase
  },
  {
    title: "+1.000 MW analizados en centrales de generación",
    description: "somos especialistas en Turbomaquinaria",
    icon: FaBolt
  },
  {
    title: "Plataforma virtual",
    description: "para gestión de reportes",
    icon: FaDesktop
  },
  {
    title: "USD Millones en ahorros a nuestros aliados",
    description: "en el ciclo de vida de sus activos físicos.",
    icon: FaDollarSign
  }
]

export function WhyChooseUsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % achievements.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + achievements.length) % achievements.length)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image - Positioned to show more left side */}
      <div className="absolute inset-0 bg-[url('/whybanner.jpg')] bg-cover bg-left bg-no-repeat"></div>
      
      {/* White to transparent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-transparent"></div>
      
      <div className="container-section relative z-10">
        <div className="content-section">
          {/* Header - Centered */}
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            ¿Por qué elegirnos?
          </h2>
          <span className="mt-2 block h-1 w-20 bg-accent mx-auto mb-12"></span>

          {/* Desktop Grid - Hidden on mobile */}
          <div className="hidden md:grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement, index) => (
              <Card key={index} className="border-none shadow-lg z-10">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-6 rounded-full p-3">
                    <achievement.icon className="w-16 h-16 text-primary" />
                  </div>
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Carousel - Visible only on mobile */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {achievements.map((achievement, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="border-none shadow-lg z-10">
                      <CardContent className="flex flex-col items-center p-6 text-center">
                        <div className="mb-6 rounded-full p-3">
                          <achievement.icon className="w-16 h-16 text-primary" />
                        </div>
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {achievement.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="w-10 h-10 p-0 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              {/* Dots indicator */}
              <div className="flex space-x-2">
                {achievements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="w-10 h-10 p-0 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Button 
              variant="outline"
              size="default"
              className="border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
              onClick={() => window.open("https://wa.me/51953804859?text=Me interesa conocer más sobre sus servicios", "_blank")}
            >
              Conecta con nosotros
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
