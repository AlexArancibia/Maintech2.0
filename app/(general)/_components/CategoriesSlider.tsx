'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const courses = [
  {
    title: "MANTENIMIENTO PREDICTIVO",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop",
    link: "/cursos",
    description: "Introducción al Mantenimiento Predictivo, Análisis de Vibraciones, Lubricación y más"
  },
  {
    title: "GESTIÓN DE PROYECTOS",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=600&fit=crop",
    link: "/cursos",
    description: "Planificación y Programación, Metodologías Ágiles, PMO para Mantenimiento"
  },
  {
    title: "INDUSTRIA 4.0",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
    link: "/cursos",
    description: "Big Data, Machine Learning, IoT en Gestión de Activos"
  },
  {
    title: "GESTIÓN DE ACTIVOS",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    link: "/cursos/gestion-activos",
    description: "ISO 55000, Evaluación de Riesgos, TPM"
  },
  {
    title: "INGENIERÍA DE CONFIABILIDAD",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop",
    link: "/cursos",
    description: "FMEA/FMECA, Diseño para Confiabilidad, Simulación de Procesos"
  },
  {
    title: "CALIDAD Y MEJORA",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
    link: "/cursos",
    description: "Lean Maintenance, 5S, Six Sigma en Mantenimiento"
  },
  {
    title: "SEGURIDAD INDUSTRIAL",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
    link: "/cursos",
    description: "Prevención de Riesgos, Seguridad en Equipos Críticos"
  },
  {
    title: "CERTIFICACIONES",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    link: "/cursos",
    description: "CMRP, MLA I/II, MMP, Normas ISO"
  },
  {
    title: "MINERÍA Y MANUFACTURA",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&h=600&fit=crop",
    link: "/cursos",
    description: "Mantenimiento en Minería, Equipos Pesados, Manufactura"
  },
  {
    title: "TRANSFORMACIÓN DIGITAL",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    link: "/cursos",
    description: "IA, Machine Learning, Automatización de Procesos"
  }
]

export default function CoursesSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  return (
    <div className="container-section py-16 pt-8 bg-gray-100">
      <div className="content-section">
      <h2 className="mb-12 z-10 text-center text-3xl font-bold text-gray-800">
          Nuestras Especialidades
          <span className="mt-2 block h-1 w-20 bg-pink-500 mx-auto"></span>
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className=" ">
            {courses.map((course, index) => (
              <CarouselItem key={index} className="    basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4  ">
                <Card className=" overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={800}
                        height={600}
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                    </div>
                    <div className="relative p-4 pt-8">
                      <Image
                        src="/blue 1.png"
                        alt="Background pattern"
                        layout="fill"
                        objectFit="cover"
                        className=" "
                      />
                      <div className="relative z-10 min-h-[160px]  flex flex-col justify-between">
                        <div className="">
                        <div className="relative mb-4 bg-gradient-to-r from-[#4A1B7F] to-[#F1536D] p-2 pr-3 rounded-full">
                          <h2 className="font-orbitron text-base text-white">
                            {course.title}
                          </h2>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30" />
                        </div>
                        <p className="text-white/80 text-sm line-clamp-2 ml-2 mb-4">
                          {course.description}
                        </p>
                        </div>
                        <Link 
                          href={course.link}
                          className="flex items-center justify-end gap-2 text-white/90 hover:text-white text-sm transition-colors"
                        >
                          Explora nuestros cursos
                          <ArrowRight size={16} className="transform -rotate-45" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-12 top-1/2" />
              <CarouselNext className="absolute -right-12 top-1/2" />
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex justify-center gap-4 mt-6 md:hidden">
              <CarouselPrevious className="static translate-y-0 translate-x-0" />
              <CarouselNext className="static translate-y-0 translate-x-0" />
            </div>
        </Carousel>
      </div>
    </div>
  )
}

