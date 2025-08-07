"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DetailedChapter } from "@/types/ChapterType";
import QuizComponent from "./QuizComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Video, Paperclip, Book, FileText, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from "@/hooks/AuthContext";
import api from "@/lib/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { validateUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useApiData } from "@/hooks/ApiContext";
import { convertToPeruTime, getCurrentPeruTime, formatDateTime } from "@/lib/dateUtils";

interface ChapterContentProps {
  chapter: DetailedChapter;
}

export default function ChapterContent({ chapter }: ChapterContentProps) {

   const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(() => {
    if (chapter.liveSessionUrl) return "live";
    if (chapter.quiz && chapter.quiz.length > 0) return "quiz";
    if (chapter.attachment && chapter.attachment.length > 0) return "attachment";
    return "content";
  });
  const {user} = useAuth();
  const { refreshPurchasedCourses } = useApiData();

  const [userProgress, setUserProgress] = useState(chapter.user_progresses?.find(progress => 
    progress.users_permissions_user?.email === user?.email
  ));

  // Update userProgress when chapter.user_progresses changes
  useEffect(() => {
    const currentProgress = chapter.user_progresses?.find(progress => 
      progress.users_permissions_user?.email === user?.email
    );
    setUserProgress(currentProgress);
  }, [chapter.user_progresses, user?.email]);

  // Reset tab to first available when chapter changes
  useEffect(() => {
    if (chapter.liveSessionUrl) {
      setSelectedTab("live");
    } else if (chapter.quiz && chapter.quiz.length > 0) {
      setSelectedTab("quiz");
    } else if (chapter.attachment && chapter.attachment.length > 0) {
      setSelectedTab("attachment");
    } else {
      setSelectedTab("content");
    }
  }, [chapter]);

  // Fetch user progress when quiz tab is selected and progress doesn't exist
  useEffect(() => {
    if (selectedTab === "quiz" && chapter.quiz && chapter.quiz.length > 0 && !userProgress) {
      fetchUserProgress();
    }
  }, [selectedTab, chapter.quiz, userProgress]);

  // Function to fetch user progress from server if not found locally
  const fetchUserProgress = async () => {
    if (!user?.email || userProgress) return;

    try {
      const response = await api.get(`/api/user-progresses?populate=*&filters[chapter][id][$eq]=${chapter.id}&filters[users_permissions_user][email][$eq]=${user.email}`);
      
      if (response.data.data.length > 0) {
        const serverProgress = response.data.data[0];
        console.log(`Found user progress on server for chapter ${chapter.id}:`, serverProgress);
        setUserProgress(serverProgress);
        
        // Update the chapter's user_progresses array
        if (chapter.user_progresses) {
          chapter.user_progresses.push(serverProgress);
        } else {
          chapter.user_progresses = [serverProgress];
        }
      } else {
        // If no progress found, create one
        console.log(`No user progress found for chapter ${chapter.id}, creating one...`);
        try {
          const createResponse = await api.post('/api/user-progresses', {
            data: {
              isCompleted: false,
              chapter: chapter.id,
              users_permissions_user: user.id,
            }
          });
          
          const newProgress = createResponse.data.data;
          console.log(`Created user progress for chapter ${chapter.id}:`, newProgress);
          setUserProgress(newProgress);
          
          // Update the chapter's user_progresses array
          if (chapter.user_progresses) {
            chapter.user_progresses.push(newProgress);
          } else {
            chapter.user_progresses = [newProgress];
          }
        } catch (createError: any) {
          console.error(`Error creating user progress for chapter ${chapter.id}:`, createError);
          // If conflict, the progress already exists, try to fetch it again
          if (createError.response?.status === 409) {
            console.log(`Progress already exists for chapter ${chapter.id}, fetching again...`);
            // Wait a bit and try to fetch again
            setTimeout(() => fetchUserProgress(), 1000);
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching user progress for chapter ${chapter.id}:`, error);
    }
  };

  
 

  const renderContent = (content: any[]) => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'heading':
          return <h2 key={index} className="text-xl font-semibold mb-4 text-gray-700">{item.children[0].text}</h2>;
        case 'paragraph':
          return <p key={index} className="mb-4 text-base text-gray-700 dark:text-gray-300">{item.children[0].text}</p>;
        case 'list':
          return (
            <ul key={index} className="list-disc list-inside text-base mb-4 text-gray-700 dark:text-gray-300">
              {item.children.map((listItem: any, listIndex: number) => (
                <li key={listIndex} className="mb-2">{listItem.children[0].text}</li>
              ))}
            </ul>
          );
        default:
          return null;
      }
    });
  };

  const formatDate = (dateString: string) => {
    return formatDateTime(dateString);
  };

  const calculateDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes} minutos`;
    } else if (minutes === 0) {
      return `${wholeHours} ${wholeHours === 1 ? 'hora' : 'horas'}`;
    } else {
      return `${wholeHours} ${wholeHours === 1 ? 'hora' : 'horas'} y ${minutes} minutos`;
    }
  };

  const handleClick = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const now = getCurrentPeruTime();
    const sessionTime = convertToPeruTime(chapter.date);
    sessionTime.setMinutes(sessionTime.getMinutes() - 10);
    
    console.log("Hora actual (Perú):", now);
    console.log("Hora habilitada para la clase (Perú):", sessionTime);
    console.log("URL de la clase:", chapter.liveSessionUrl);

    if (now < sessionTime) {
      console.log("Clase aún no disponible");
      setIsDialogOpen(true);
    } else {
      console.log("Abriendo clase en vivo");
      
      // Abrir la URL de la clase en una nueva pestaña
      if (chapter.liveSessionUrl) {
        window.open(chapter.liveSessionUrl, '_blank', 'noopener,noreferrer');
      }
      
      // Actualizar progreso si no hay quiz
      if (!chapter.quiz || chapter.quiz.length === 0) {
        await updateProgress();
      }
    }
  };

  async function updateProgress() {
    if (!user) return;

    // If no userProgress, try to fetch it first
    if (!userProgress) {
      await fetchUserProgress();
      // If still no userProgress after fetching, return
      if (!userProgress) {
        console.log("No user progress found for this chapter. Cannot update progress.");
        alert("Error: No se pudo cargar el progreso del usuario. Por favor, recarga la página e intenta nuevamente.");
        return;
      }
    }

    try {
      const response = await api.put(`/api/user-progresses/${userProgress.documentId}`, {
        data: {
          isCompleted: true,
        }
      });
      
      console.log(`Updated progress for chapter ${chapter.id}:`, response.data.data);
      setUserProgress(response.data.data);
      
      // Refresh purchased courses to update the progress badge
      await refreshPurchasedCourses();
    } catch (error) {
      console.error(`Error updating user progress for chapter ${chapter.id}:`, error);
      alert("Error al actualizar el progreso. Por favor, intenta nuevamente.");
    }
  }


  return (
    <Card className="overflow-hidden border shadow-none">
      <CardHeader className="border-b border-gray-200 text-black">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold">{chapter.title}</CardTitle>
            <CardDescription className="text-gray-500">{chapter.shortdescription}</CardDescription>
          </div>
          
          {/* Botón de completado en la esquina superior derecha */}
          {(!chapter.quiz || chapter.quiz.length === 0) && (
            <Button
              onClick={updateProgress}
              disabled={userProgress?.isCompleted}
              variant={userProgress?.isCompleted ? "outline" : "default"}
              size="sm"
              className={userProgress?.isCompleted ? "bg-green-50 text-green-700 border-green-200" : ""}
            >
              {userProgress?.isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completado
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completar
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-10 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {chapter.liveSessionUrl && (
              <TabsTrigger value="live" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700">
                <Video className="w-4 h-4 mr-2" />
                <span>Clase en Vivo</span>
              </TabsTrigger>
            )}
            {chapter.quiz && chapter.quiz.length > 0 && (
              <TabsTrigger value="quiz" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700">
                <FileText className="w-4 h-4 mr-2" />
                <span>Quiz</span>
              </TabsTrigger>
            )}

            {chapter.attachment && chapter.attachment.length > 0 && (
              <TabsTrigger value="attachment" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700">
                <Paperclip className="w-4 h-4 mr-2" />
                <span>Archivos Adicionales</span>
              </TabsTrigger>
            )}

            {/* Tab de contenido para capítulos sin live session ni quiz */}
            {!chapter.liveSessionUrl && (!chapter.quiz || chapter.quiz.length === 0) && (
              <TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700">
                <Book className="w-4 h-4 mr-2" />
                <span>Contenido</span>
              </TabsTrigger>
            )}
          </TabsList>
          {chapter.liveSessionUrl && (
            <TabsContent value="live">
              <div className="space-y-6 mb-12">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Información de la Clase en Vivo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <Calendar className="w-8 h-8 text-accent" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Fecha y hora</p>
                      <p className="font-medium text-gray-700 dark:text-gray-200">{formatDate(chapter.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <Clock className="w-8 h-8 text-accent" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duración</p>
                      <p className="font-medium text-gray-700 dark:text-gray-200">{calculateDuration(chapter.hours)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <Video className="w-8 h-8 text-accent" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Plataforma</p>
                      <p className="font-medium text-gray-700 dark:text-gray-200">{chapter.platform}</p>
                    </div>
                  </div>
                </div>
         
                <div>
      <Button
        variant="default"
        className="w-full mt-6 bg-primary"
        onClick={handleClick}
      >
        <div className="flex items-center justify-center">
          <Video className="w-5 h-5 mr-2" />
          Unirse a la Clase en Vivo
        </div>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clase no disponible aún</DialogTitle>
          </DialogHeader>
          <p>La clase en vivo se habilitará 10 minutos antes de la hora programada.</p>
        </DialogContent>
      </Dialog>
    </div>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                {renderContent(chapter.content)}
              </div>
              
            </TabsContent>

            
          )}
          {chapter.attachment && chapter.attachment.length > 0 && (
          <TabsContent value="attachment">
              {chapter.attachment && chapter.attachment.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Archivos adjuntos</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {chapter.attachment.map((file, index) => (
                      <Button key={index} asChild variant="outline" className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Link href={validateUrl(file.url)} target="_blank" rel="noopener noreferrer" className="flex items-center p-4">
                          <Paperclip className="w-5 h-5 mr-3 text-cyan-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>)}

          {/* Tab de contenido para capítulos sin live session ni quiz */}
          {!chapter.liveSessionUrl && (!chapter.quiz || chapter.quiz.length === 0) && (
            <TabsContent value="content">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {renderContent(chapter.content)}
              </div>
            </TabsContent>
          )}


          {chapter.quiz && chapter.quiz.length > 0 && (
            <TabsContent value="quiz">
              {!userProgress ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando progreso del usuario...</p>
                  </div>
                </div>
              ) : (
                <QuizComponent 
                  quiz={chapter.quiz} 
                  userProgress={userProgress}
                  chapterId={chapter.documentId} 
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

