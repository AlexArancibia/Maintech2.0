import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { CalendarDays, Clock, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { BasicCourse } from '@/types/CoursesType'
import { getImageUrl } from '@/lib/getImageUrl'

interface CourseCardProps {
  course: BasicCourse;
}

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

export default function CourseCard({ course }: CourseCardProps) {
  const startDate = convertToPeruTime(new Date(course.start_date));

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <CardHeader className="p-0 relative">
        <div className="relative">
          <Image 
            src={getImageUrl(course.image.url)} 
            alt={course.title} 
            width={400} 
            height={225} 
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
          {course.price === 0 ? (
            <div className="absolute bottom-2 right-2 px-3 py-1.5 rounded-full text-white font-bold text-xs"
                 style={{ background: 'linear-gradient(90deg, #1e293b 0%, #ef4444 100%)', boxShadow: '0 2px 8px 0 rgba(30,41,59,0.15)' }}>
              🎉 GRATUITO
            </div>
          ) : (
            <div className="absolute bottom-2 right-2 bg-black/60 px-3 py-1.5 rounded-full text-white font-bold">
              S/ {course.price.toFixed(2)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <Badge variant="outline" className="mb-3 text-xs font-light">
          {course.category?.name || 'Sin Categoría'}
        </Badge>
        <CardTitle className="text-xl mb-2 line-clamp-2 transition-colors duration-300">
          {course.title}
        </CardTitle>
        <CardDescription className="mb-4 line-clamp-2 flex items-center gap-2">
            <span className='font-bold'>Instructor: </span>
          {course.teacher.name}
        </CardDescription>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-accent" />
            <span>{startDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-accent" />
            <span>{calculateCourseDuration(course.start_date, course.finish_date)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Button 
          variant="outline"
          className="w-full group/button relative overflow-hidden font-medium"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 group-hover/button:text-white transition-colors duration-300">
            Ver Curso
            <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
          </span>
        </Button>
      </CardFooter>
    </Card>
  )
}

