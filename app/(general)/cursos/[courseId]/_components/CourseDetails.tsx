import { Calendar, Clock, DollarSign, BookOpen, Banknote } from 'lucide-react'

interface CourseDetailsProps {
  course: {
    start_date: string;
    finish_date: string;

    chapters: any[];
    price: number;
  }
}

export function CourseDetails({ course }: CourseDetailsProps) {
  // Calculate the duration in days
  const startDate = new Date(course.start_date);
  const endDate = new Date(course.finish_date);
  const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

  return (
    <div className="flex flex-wrap gap-8 pt-6 border-t border-slate-700">
      <div className="flex items-start gap-4">
        <Calendar className="w-5 h-5 text-cyan-500 mt-1" />
        <div>
          <p className="text-sm text-slate-400">Fechas</p>
          <div className="text-slate-300">
            <p className="font-medium">
              {startDate.toLocaleDateString()} - 
              {endDate.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-300">
        <Clock className="w-5 h-5 text-cyan-500" />
        <div>
          <p className="text-sm text-slate-400">Duración</p>
          <p className="font-medium">{durationInDays} días</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-300">
        <BookOpen className="w-5 h-5 text-cyan-500" />
        <div>
          <p className="text-sm text-slate-400">Contenido</p>
          <p className="font-medium">{course.chapters.length} capítulos</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-300">
        <Banknote className="w-5 h-5 text-cyan-500" />
        <div>
          <p className="text-sm text-slate-400">Precio</p>
          <p className="font-medium">S/ {course.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

