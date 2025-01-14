import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
  
import { CalendarDays, Clock, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { BasicCourse } from '@/types/CoursesType'
import { getImageUrl } from '@/lib/getImageUrl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CourseCardProps {
  course: BasicCourse;
}

export default function PurchasedCourseCard({ course }: CourseCardProps) {
  const startDate = new Date(course.start_date);
  const endDate = new Date(course.finish_date);
  const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

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
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
          <div className="absolute bottom-2 right-2 bg-black/60 px-3 py-1.5 rounded-full text-white font-bold">
            S/ {course.price.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <Badge variant="outline" className="mb-3 text-xs font-light  ">
          {course.category?.name || 'Sin Categoría'}
        </Badge>
        <CardTitle className="text-xl mb-2 line-clamp-2   transition-colors duration-300">
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
            <span>{durationInDays} días</span>
          </div>

        </div>
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Button 
          variant="outline"
          className="w-full group/button relative overflow-hidden font-medium  "
        >
          <span className="relative z-10 flex items-center   justify-center gap-2 group-hover/button:text-white transition-colors duration-300">
            Ver Curso
            <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
          </span>
           
        </Button>
      </CardFooter>
    </Card>
  )
}

