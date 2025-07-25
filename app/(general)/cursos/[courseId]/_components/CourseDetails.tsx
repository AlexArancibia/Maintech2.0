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
  // Calculate the duration in days (including the end day)
  // Suma 5 horas a las fechas por GMT-5
  const startDate = new Date(new Date(course.start_date).getTime() + 5 * 60 * 60 * 1000);
  const endDate = new Date(new Date(course.finish_date).getTime() + 5 * 60 * 60 * 1000);
  const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

  // Format dates without year
  const formatDateWithoutYear = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="grid grid-cols-2 justify-items-start  md:grid-cols-4 gap-8 mt-6 pt-6 border-t border-slate-700 md:justify-items-center">
      <div className="flex items-center gap-4">
        <Calendar className="w-7 h-7 text-cyan-500 mt-1" />
        <div>
          <p className="text-sm text-slate-400">Fechas</p>
          <div className="text-slate-300">
            <p className="font-medium">
              {formatDateWithoutYear(startDate)} - 
              {formatDateWithoutYear(endDate)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-300">
        <Clock className="w-7 h-7 text-cyan-500" />
        <div>
          <p className="text-sm text-slate-400">Duración</p>
          <p className="font-medium">{durationInDays} días</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-300">
        <BookOpen className="w-7 h-7 text-cyan-500" />
        <div>
          <p className="text-sm text-slate-400">Contenido</p>
          <p className="font-medium">{course.chapters.length} capítulos</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-300">
        <Banknote className="w-5 h-5 text-cyan-500" />
        <div>
          <p className="text-sm text-slate-400">Precio</p>
          <p className="font-medium flex items-center gap-2">
            {course.price === 0 ? (
              <>
                 
                <span className="  px-2 py-0.5 rounded bg-green-500 text-white text-xs font-semibold shadow animate-pulse border border-green-700">GRATUITO</span>
              </>
            ) : (
              `S/ ${course.price.toFixed(2)}`
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

