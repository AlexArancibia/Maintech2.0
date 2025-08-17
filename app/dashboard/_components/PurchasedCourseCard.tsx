import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
  
import { CalendarDays, Clock, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { DetailedCourse } from '@/types/CoursesType'
import { getImageUrl } from '@/lib/getImageUrl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CourseCardProps {
  course: DetailedCourse;
}

import { formatCourseStartDate, calculateDuration } from '@/lib/dateUtils'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/AuthContext'
import { useCurrency } from '@/hooks/CurrencyContext'

export default function PurchasedCourseCard({ course }: CourseCardProps) {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  // Validar que el curso tenga los datos mínimos necesarios
  if (!course || !course.title) {
    console.warn("⚠️ [PurchasedCourseCard] Curso inválido o sin título:", course);
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-5">
          <div className="text-center text-muted-foreground">
            <p className="text-sm sm:text-base">Curso no disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular progreso del usuario
  const calculateProgress = () => {
    if (!course.chapters?.length || !user) return 0;
    const completedChapters = course.chapters.filter(chapter => 
      chapter.user_progresses?.some(progress => 
        progress.isCompleted && progress.users_permissions_user?.id === user.id
      )
    ).length;
    return (completedChapters / course.chapters.length) * 100;
  };

  const progress = calculateProgress();

  // Log para debugging
  console.log("🔍 [PurchasedCourseCard] Renderizando curso:", {
    id: course.id,
    title: course.title,
    teacher: course.teacher,
    hasTeacher: !!course.teacher,
    teacherName: course.teacher?.name,
    category: course.category,
    hasImage: !!course.image,
    imageUrl: course.image?.url,
    chapters: course.chapters?.length || 0,
    price: course.price
  });

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <CardHeader className="p-0 relative">
        <div className="relative">
          <Image 
            src={getImageUrl(course.image?.url) || '/placeholder.svg'} 
            alt={course.title || 'Curso'} 
            width={400} 
            height={225} 
            className="w-full h-fit object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        
          {/* Badge de curso completado */}
          {progress === 100 && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              ✅ Completado
            </div>
          )}
        
          {(!course.price || course.price === 0) ? (
            <div className="absolute bottom-2 right-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white font-bold text-xs"
                 style={{ background: 'linear-gradient(90deg, #1e293b 0%, #ef4444 100%)', boxShadow: '0 2px 8px 0 rgba(30,41,59,0.15)' }}>
              🎉 GRATUITO
            </div>
          ) : (
            <div className="absolute bottom-2 right-2 bg-black/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white font-bold text-xs">
              {formatPrice(course.price || 0, course.priceUSD || 0)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-5">
        <Badge variant="outline" className="mb-2 sm:mb-3 text-xs font-light">
          {course.category?.name || 'Sin Categoría'}
        </Badge>
        <CardTitle className="text-base sm:text-lg lg:text-xl mb-2 line-clamp-2 transition-colors duration-300">
          {course.title || 'Título no disponible'}
        </CardTitle>
        <CardDescription className="mb-3 sm:mb-4 line-clamp-2 flex items-center gap-2 text-sm">
            <span className='font-bold'>Instructor: </span>
          {course.teacher?.name || 'Instructor no asignado'}
        </CardDescription>
        
        {/* Progreso del curso */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Progreso del curso</span>
            <span className="text-xs sm:text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-accent" />
            <span>{course.start_date ? formatCourseStartDate(course.start_date) : "Por confirmar"}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-accent" />
            <span>{calculateDuration(course.start_date || null, course.finish_date || null)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='p-3 sm:p-4 pt-0'>
        <Button 
          variant={progress === 100 ? "default" : "outline"}
          className={`w-full group/button relative overflow-hidden font-medium text-xs sm:text-sm ${
            progress === 100 ? "bg-green-600 hover:bg-green-700 text-white" : ""
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 group-hover/button:text-white transition-colors duration-300">
            {progress === 100 ? (
              <>
                🎉 Curso Completado
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
              </>
            ) : (
              <>
                Ver Curso
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </span>
        </Button>
      </CardFooter>
    </Card>
  )
}

