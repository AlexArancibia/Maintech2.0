 
"use client"

import { useState } from 'react'
 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
 
import Link from 'next/link'
import { useApiData } from '@/hooks/ApiContext'
import { getImageUrl } from '@/lib/getImageUrl'
import { Skeleton } from "@/components/ui/skeleton"
import CourseCard from '@/components/CourseCard'
import { BasicCourse } from '@/types/CoursesType'
import { Category } from '@/types/CategoryType'
 

interface CourseCardProps {
  course: BasicCourse;
}

function CategoryButton({
  category,
  isSelected,
  onClick,
}: {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      className={`relative px-4 py-2 text-sm font-medium rounded-lg border-gray-200
        transition-all duration-200 ease-in shadow-sm
        ${isSelected
          ? "border-gray-400 hover:bg-white text-teal-600 hover:text-teal-600 shadow-md "
          : " text-gray-500 hover:bg-white hover:text-gray-800   "
        }`}
      onClick={onClick}
    >
      {category.name}
    </Button>
  );
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

export default function HomePage() {
  const { basicCourses, categories, isLoading, error } = useApiData()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const filteredCourses = basicCourses.filter(course =>
    (selectedCategory === 'Todos' || (course.category && course.category.name === selectedCategory)) &&
    (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (course.category && course.category.name.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  return (
    <div className="  bg-gray-50">
      <div
      className="container-section bg-cover bg-left md:bg-center  bg-no-repeat bg-[url('/curso.png')]  "
    >
      <div className="content-section flex flex-col gap-8 md:gap-10 pt-8 lg:justify-center min-h-[300px] md:min-h-[500px] text-white justify-center" >
        <div className="font-orbitron text-4xl md:text-6xl lg:text-7xl">
          Cursos de
          <br />
          <span className="font-bold">Formacíon</span>
        </div>
        <div className="flex">
    <Input
      type="text"
      placeholder="Buscar cursos..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="max-w-[300px] mr-2 px-4 py-2 rounded-lg  text-black    placeholder-gray-400 focus:outline-none focus:ring-2  "
    />
    <Button className="  text-white px-6 py-2 rounded-lg shadow-md transition-shadow duration-300">
      Buscar
    </Button>
  </div>
 
      </div>
    </div>

 
      <main className="container-section py-16 sm:py-8">
      


        <section className="content-section mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Especialidades</h3>
          <div className="flex gap-6 overflow-x-auto whitespace-nowrap py-2 px-4 bg-gray-50 rounded-lg shadow-sm">
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} className="w-24 h-10" />
              ))
            ) : (
              <>
                <Button
                  key="todos"
                  variant={selectedCategory === 'Todos' ? "default" : "outline"}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 mb-4
                    ${selectedCategory === 'Todos' 
                      ? "bg-slate-50 hover:bg-slate-50 shadow-md hover:shadow-lg text-emerald-800 border border-gray-400" 
                      : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-800 shadow-sm"
                    }`}
                  onClick={() => setSelectedCategory('Todos')}
                >
                  Todos
                </Button>
                {categories.map((category) => (
                  <CategoryButton
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory === category.name}
                    onClick={() => setSelectedCategory(category.name)}
                  />
                ))}
              </>
            )}
          </div>
        </section>

        <section className="content-section  ">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Cursos Destacados</h3>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link key={course.documentId} href={`/cursos/${course.titleSlug}`}>
                  <CourseCard course={course} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No se encontraron cursos para la categoría seleccionada.
            </p>
          )}
        </section>
      </main>

      
    </div>
  )
}