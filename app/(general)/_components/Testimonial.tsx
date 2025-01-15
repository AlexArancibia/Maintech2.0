'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from "@/components/ui/card"
import { motion , AnimatePresence } from "motion/react"

const testimonials = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
    name: "Carlos Rodriguez",
    role: "Ingeniero Industrial",
    testimonial: "Los cursos de MainTech han sido fundamentales para mi desarrollo profesional. La calidad de la enseñanza y el contenido práctico superaron mis expectativas."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80",
    name: "Juan Pérez",
    role: "Gerente de Proyectos",
    testimonial: "Gracias a la formación recibida, pude implementar mejoras significativas en mi empresa. Los instructores son verdaderos expertos en su campo."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    name: "Ana Martinez",
    role: "Directora de Operaciones",
    testimonial: "La flexibilidad de los cursos online y la atención personalizada hacen de MainTech la mejor opción para profesionales que buscan especializarse."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
    name: "Miguel Torres",
    role: "Consultor Senior",
    testimonial: "El nivel de profundidad de los cursos y la red de profesionales que he conocido han transformado mi carrera por completo."
  }, 
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
    name: "Laura Sánchez",
    role: "Especialista en Calidad",
    testimonial: "La metodología práctica y los casos de estudio reales me permitieron aplicar inmediatamente lo aprendido en mi trabajo diario."
  }
]

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextTestimonial = useCallback(() => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }, [])

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextTestimonial, 3000)
      return () => clearInterval(interval)
    }
  }, [isPaused, nextTestimonial])

  const handleTestimonialClick = (index: number) => {
    setActiveTestimonial(index)
    setIsPaused(true)
  }

  return (
    <div className='bg-gray-100'>
      <div className="container-section relative py-16 min-h-[600px] flex justify-center items-center rounded-tr-[100px] sm:rounded-tr-[150px] md:rounded-tr-[250px]"
        style={{
          backgroundImage: 'url("/testimonio.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        <div className="content-section text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 md:mb-16">
            Testimonios
          </h2>

          {/* Mobile Testimonial */}
          <div className="md:hidden mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-white overflow-hidden mb-4">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white text-lg mb-4 px-4">
                  "{testimonials[activeTestimonial].testimonial}"
                </p>
                <p className="text-white font-semibold">
                  {testimonials[activeTestimonial].name}
                </p>
                <p className="text-white/80 text-sm">
                  {testimonials[activeTestimonial].role}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center space-x-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleTestimonialClick(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeTestimonial ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Ver testimonio ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Testimonial */}
          <div className="hidden md:block">
            <div className="relative flex justify-center items-center mb-4">
              {/* Connector lines */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[2px] bg-white/30" />
              
              <div className="relative flex items-center justify-between w-full max-w-4xl">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    onClick={() => handleTestimonialClick(index)}
                    className={`relative transition-all duration-300 ${
                      index === activeTestimonial ? 'z-10' : 'z-0'
                    }`}
                    aria-label={`Ver testimonio de ${testimonial.name}`}
                  >
                    <div
                      className={`rounded-full border-4 ${
                        index === activeTestimonial 
                          ? 'border-white scale-100' 
                          : 'border-white/50 scale-90 hover:border-white hover:scale-95'
                      } overflow-hidden transition-all duration-300 ${
                        index === activeTestimonial ? 'w-32 h-32' : 'w-20 h-20'
                      }`}
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-2xl mx-auto text-center"
                >
                  <p className="text-white text-lg mb-4">
                    "{testimonials[activeTestimonial].testimonial}"
                  </p>
                  <p className="text-white font-semibold">
                    {testimonials[activeTestimonial].name}
                  </p>
                  <p className="text-white/80 text-sm">
                    {testimonials[activeTestimonial].role}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

