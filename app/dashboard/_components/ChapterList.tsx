"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, BookOpen, Video, FileText, Clock, Calendar, DollarSign, CheckCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getChaptersByCourse } from "@/hooks/chaptersAPI";
import { IdConversion } from "@/lib/IdConvertion";
import { DetailedChapter, UserProgress } from "@/types/ChapterType";
import { useAuth } from "@/hooks/AuthContext";
import { getUserProgresses } from "@/hooks/progressesAPI";
import api from "@/lib/axios";

type Params = { courseId: string };
interface PostProgress {
  data: { isCompleted: boolean; chapter: number; users_permissions_user: number };
}

export default function CourseComponent() {
  const { user, token } = useAuth();
  const params = useParams<Params>();
  const [chapters, setChapters] = useState<DetailedChapter[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<DetailedChapter | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchChapters = useCallback(async () => {
    if (!params.courseId) {
      setError("Invalid courseId");
      setIsLoading(false);
      return;
    }

    try {
      const cursoSlug = IdConversion(params.courseId);
      const fetchedChapters = await getChaptersByCourse(cursoSlug);
      const userProgresses = await getUserProgresses(user!.email);

      for (const chapter of fetchedChapters) {
        const exists = userProgresses.some(
          (progress) => progress.chapter.documentId === chapter.documentId
        );
        if (!exists) {
          const payload: PostProgress = {
            data: {
              isCompleted: false,
              chapter: chapter.id,
              users_permissions_user: user!.id,
            },
          };
          await api.post("/api/user-progresses", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      const updatedProgress = await getUserProgresses(user!.email);
      setUserProgress(updatedProgress);
      const sortedChapters = fetchedChapters.sort((a, b) => a.position - b.position);
      setChapters(sortedChapters);
      setSelectedChapter(sortedChapters[0]);
    } catch (err) {
      setError("Failed to fetch course details");
    } finally {
      setIsLoading(false);
    }
  }, [params.courseId, user, token]);

  const handleProgress = useCallback(
    async (chapterId: number) => {
      const selectedItem = userProgress.find((item) => item.chapter.id === chapterId);
      if (selectedItem && !selectedItem.isCompleted) {
        await api.put(
          `/api/user-progresses/${selectedItem.documentId}`,
          { data: { isCompleted: true } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserProgress(await getUserProgresses(user!.email));
        fetchChapters();
      }
    },
    [userProgress, token, user, fetchChapters]
  );

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

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

  const totalDuration = chapters.reduce(
    (total, chapter) => total + (chapter.recorded_video?.duration || 0),
    0
  );

  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-900">Curso de Mantenimiento Predictivo</h1>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto p-4 lg:p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-indigo-900">Progreso del Curso</h2>
          <Progress value={calculateProgress()} className="h-2" />
          <p className="mt-2 text-sm text-indigo-700">{calculateProgress()}% completado</p>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <aside className={`lg:col-span-1 ${isMobileMenuOpen ? "block" : "hidden"} lg:block mb-8 lg:mb-0`}>
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold mb-4 text-indigo-900">Capítulos del Curso</h2>
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
                {chapters.map((chapter) => (
                  <Button
                    key={chapter.id}
                    variant="ghost"
                    className={`w-full justify-start text-left p-4 ${
                      selectedChapter?.id === chapter.id ? "bg-indigo-100" : ""
                    }`}
                    onClick={() => {
                      setSelectedChapter(chapter);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          chapter.user_progresses?.some((progress) => progress.isCompleted)
                            ? "bg-green-500 text-white"
                            : "bg-indigo-200 text-indigo-700"
                        }`}
                      >
                        {chapter.position}
                      </div>
                      <div>
                        <p className="font-medium text-base">{chapter.title}</p>
                        <p className="text-sm text-indigo-600 mt-1">{chapter.shortdescription}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <ChapterSkeleton key="skeleton" />
              ) : selectedChapter ? (
                <ChapterContent
                  key={selectedChapter.id}
                  chapter={selectedChapter}
                  onMarkAsRead={handleProgress}
                />
              ) : (
                <EmptyState key="empty" />
              )}
            </AnimatePresence>
          </main>
        </div>

        <footer className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-900">Información del Curso</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center text-indigo-700">
              <BookOpen className="w-5 h-5 mr-2" />
              <span>{chapters.length} capítulos</span>
            </div>
            <div className="flex items-center text-indigo-700">
              <Clock className="w-5 h-5 mr-2" />
              <span>{formatDuration(totalDuration)} de video</span>
            </div>
            <div className="flex items-center text-indigo-700">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Acceso de por vida</span>
            </div>
            <div className="flex items-center text-indigo-700">
              <DollarSign className="w-5 h-5 mr-2" />
              <span>Certificado incluido</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ChapterSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-6" />
      <Skeleton className="h-64 w-full mb-6" />
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
      </div>
    </motion.div>
  );
}

function ChapterContent({
  chapter,
  onMarkAsRead,
}: {
  chapter: DetailedChapter;
  onMarkAsRead: (chapterId: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden w-full"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">{chapter.title}</h2>
            <p className="text-lg text-indigo-700">{chapter.shortdescription}</p>
          </div>
          {chapter.isFree ? (
            <Badge variant="secondary" className="text-lg py-1 px-3">
              Gratis
            </Badge>
          ) : (
            <Badge className="bg-indigo-500 text-white text-lg py-1 px-3">Premium</Badge>
          )}
        </div>
        <Button
          onClick={() => onMarkAsRead(chapter.id)}
          className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <CheckCircle className="mr-2 h-5 w-5" /> Marcar como completado
        </Button>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-4 bg-indigo-100 p-1 rounded-lg">
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-900"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Contenido
            </TabsTrigger>
            {chapter.recorded_video && (
              <TabsTrigger
                value="video"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-900"
              >
                <Video className="w-4 h-4 mr-2" />
                Video
              </TabsTrigger>
            )}
            {chapter.quiz && (
              <TabsTrigger
                value="quiz"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-900"
              >
                <FileText className="w-4 h-4 mr-2" />
                Quiz
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="content">
            <div className="prose prose-indigo max-w-none">
              {chapter.content.map((item, index) => (
                <p key={index} className="mb-4 text-indigo-800">
                  {item.children[0]?.text}
                </p>
              ))}
            </div>
          </TabsContent>
          {chapter.recorded_video && (
            <TabsContent value="video">
              <div className="aspect-w-16 aspect-h-9 bg-indigo-900 rounded-lg overflow-hidden">
                <video
                  controls
                  src={`https://stream.mux.com/${chapter.recorded_video.playback_id}.m3u8`}
                  className="w-full h-full object-cover"
                />
              </div>
            </TabsContent>
          )}
          {chapter.quiz && (
            <TabsContent value="quiz">
              <div className="bg-indigo-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-indigo-900 mb-4">Quiz del Capítulo</h3>
                <p className="text-indigo-700">El contenido del quiz se cargará aquí.</p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-md p-12 text-center"
    >
      <BookOpen className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-indigo-900 mb-2">Comienza tu aprendizaje</h2>
      <p className="text-indigo-700">
        Selecciona un capítulo para empezar a explorar el contenido del curso.
      </p>
    </motion.div>
  );
}
