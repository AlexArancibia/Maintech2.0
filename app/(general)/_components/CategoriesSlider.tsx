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
import { useState, useEffect } from "react"
import { getCategories } from "@/hooks/categoriesAPI"
import { Category } from "@/types/CategoryType"
import { getImageUrl } from "@/lib/getImageUrl"

export default function CoursesSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const categoriesData = await getCategories()
        console.log('Categories loaded:', categoriesData)
        setCategories(categoriesData)
      } catch (err) {
        setError('Error al cargar las categorías')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="container-section py-16 pt-8 bg-gray-100">
        <div className="content-section">
          <h2 className="mb-12 z-10 text-center text-3xl font-bold text-gray-800">
            Nuestras Especialidades
            <span className="mt-2 block h-1 w-20 bg-pink-500 mx-auto"></span>
          </h2>
          <div className="flex justify-center">
            <div className="text-gray-600">Cargando categorías...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-section py-16 pt-8 bg-gray-100">
        <div className="content-section">
          <h2 className="mb-12 z-10 text-center text-3xl font-bold text-gray-800">
            Nuestras Especialidades
            <span className="mt-2 block h-1 w-20 bg-pink-500 mx-auto"></span>
          </h2>
          <div className="flex justify-center">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </div>
    )
  }

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
            {categories.map((category, index) => (
              <CarouselItem key={category.id} className="    basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4  ">
                <Card className=" overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={category.category_img ? 
                          (category.category_img.url.startsWith('http') ? 
                            category.category_img.url : 
                            getImageUrl(category.category_img.url)
                          ) : 
                          "/curso.png"
                        }
                        alt={category.name}
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
                            {category.name}
                          </h2>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30" />
                        </div>
                        <p className="text-white/80 text-sm line-clamp-2 ml-2 mb-4">
                          {category.description}
                        </p>
                        </div>
                        <Link 
                          href={`/cursos?category=${category.slug}`}
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

