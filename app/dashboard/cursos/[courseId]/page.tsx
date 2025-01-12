"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  BookOpen,
  Video,
  FileText,
  Clock,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getChaptersByCourse } from "@/hooks/chaptersAPI";
import { IdConversion } from "@/lib/IdConvertion";
import { DetailedChapter, UserProgress } from "@/types/ChapterType";
import { useAuth } from "@/hooks/AuthContext";
import { getUserProgresses } from "@/hooks/progressesAPI";
import api from "@/lib/axios";

// Interfaces
type Params = { courseId: string };
interface PostProgress {
  data: { isCompleted: boolean; chapter: number; users_permissions_user: number };
}

// Main Component
export default function CourseComponent() {
  const { user, token } = useAuth();
  const params = useParams<Params>();
  const [chapters, setChapters] = useState<DetailedChapter[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<DetailedChapter | null>(null);
  const hasFetched = useRef(false);

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!userProgress.length) return 0;
    const completedItems = userProgress.filter((item) => item.isCompleted).length;
    return Math.round((completedItems / userProgress.length) * 100);
  };

  // Fetch chapters and user progress
  async function fetchChapters() {
    if (!params.courseId) {
      setError("Invalid courseId");
      setIsLoading(false);
      return;
    }

    try {
      const cursoSlug = IdConversion(params.courseId);
      const fetchedChapters = await getChaptersByCourse(params.courseId);
      const userProgresses = await getUserProgresses(user!.email);

      // Update progress for new chapters
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
  }

  // Handle marking chapter as completed
  async function handleProgress(chapterId: number) {
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
  }

  // Format duration to HH:MM
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

 

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchChapters();
    }
  }, [params.courseId]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  // Render
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Curso de Mantenimiento Predictivo</h1>
          <p className="text-xl text-muted-foreground">
            Domina las técnicas avanzadas de mantenimiento industrial
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Course Progress */}
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

            {/* Chapters List */}
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
                      onClick={() => setSelectedChapter(chapter)}
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

            {/* Course Info */}
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
                    {/* <span>{formatDuration(totalDuration)} de contenido en video</span> */}
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

          {/* Main Content */}
          <div className="md:col-span-2">
            {selectedChapter && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedChapter.title}</CardTitle>
                      <CardDescription>{selectedChapter.shortdescription}</CardDescription>
                    </div>
                    {selectedChapter.isFree ? (
                      <Badge variant="secondary">Gratis</Badge>
                    ) : (
                      <Badge>Premium</Badge>
                    )}
                  </div>
                  <Button onClick={() => handleProgress(selectedChapter.id)}>
                    Marcar como leído
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* Tabs for Chapter Content */}
                  <Tabs defaultValue="content">
                    <TabsList className="mb-4">
                      <TabsTrigger value="content">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Contenido
                      </TabsTrigger>
                      {/* {selectedChapter.recorded_video && (
                        <TabsTrigger value="video">
                          <Video className="w-4 h-4 mr-2" />
                          Video
                        </TabsTrigger>
                      )} */}
                      {selectedChapter.quiz && (
                        <TabsTrigger value="quiz">
                          <FileText className="w-4 h-4 mr-2" />
                          Quiz
                        </TabsTrigger>
                      )}
                    </TabsList>
                    {/* Tab Content */}
                    <TabsContent value="content">
                      <div className="prose prose-sm max-w-none">
                        {selectedChapter.content.map((item, index) => (
                          <p key={index} className="mb-4">
                            {item.children[0]?.text}
                          </p>
                        ))}
                      </div>
                    </TabsContent>
                    {/* {selectedChapter.recorded_video && (
                      <TabsContent value="video">
                        <video
                          controls
                          src={`https://stream.mux.com/${selectedChapter.recorded_video.playback_id}.m3u8`}
                          className="w-full h-full rounded-lg"
                        />
                      </TabsContent>
                    )} */}
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
