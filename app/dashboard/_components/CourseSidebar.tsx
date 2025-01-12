import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, Clock, Calendar, DollarSign } from 'lucide-react';
import { DetailedChapter, UserProgress } from "@/types/ChapterType";

interface CourseSidebarProps {
  chapters: DetailedChapter[];
  userProgress: UserProgress[];
  selectedChapter: DetailedChapter | null;
  onChapterSelect: (chapter: DetailedChapter) => void;
  totalDuration: number;
}

export function CourseSidebar({
  chapters,
  userProgress,
  selectedChapter,
  onChapterSelect,
  totalDuration,
}: CourseSidebarProps) {
  const calculateProgress = () => {
    if (!userProgress.length) return 0;
    const completedItems = userProgress.filter((item) => item.isCompleted).length;
    return Math.round((completedItems / userProgress.length) * 100);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progreso del Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {calculateProgress()}% completado
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capítulos del Curso</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[400px] overflow-y-auto">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-accent ${
                  selectedChapter?.id === chapter.id ? "bg-accent" : ""
                }`}
                onClick={() => onChapterSelect(chapter)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      chapter.user_progresses?.some((progress) => progress.isCompleted)
                        ? "bg-green-500 text-white"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {chapter.position}
                  </div>
                  <div>
                    <p className="font-medium">{chapter.title}</p>
                    <p className="text-sm text-muted-foreground">{chapter.shortdescription}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Información del Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              <span>{chapters.length} capítulos</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{formatDuration(totalDuration)} de contenido en video</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Acceso de por vida</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              <span>Certificado de finalización</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

