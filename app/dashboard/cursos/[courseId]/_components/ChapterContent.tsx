"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailedChapter } from "@/types/ChapterType";
import QuizComponent from "./QuizComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Video, Paperclip, Book, FileText, Calendar, Clock } from 'lucide-react';
import { useAuth } from "@/hooks/AuthContext";
import api from "@/lib/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { validateUrl } from "@/lib/utils";

interface ChapterContentProps {
  chapter: DetailedChapter;
}

export default function ChapterContent({ chapter }: ChapterContentProps) {

   const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(chapter.liveSessionUrl ? "live" : "content");
  const {user} = useAuth();

  const [userProgress, setUserProgress] = useState(chapter.user_progresses?.find(progress => progress.users_permissions_user.email === user?.email));

  
 

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
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
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

  const handleClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const now = new Date();
    const sessionTime = new Date(chapter.date);
    sessionTime.setMinutes(sessionTime.getMinutes() - 10);
    
    console.log("Hora actual:", now);
    console.log("Hora habilitada para la clase:", sessionTime);
    console.log("URL de la clase:", chapter.liveSessionUrl);

 

     if (now < sessionTime) {
      console.log("Clase aún no disponible");
      setIsDialogOpen(true);
    } else {
      console.log("Abriendo clase en vivo");
      if (chapter.quiz.length == 0) {
        updateProgress()
      }
      
    }
  };

  async function updateProgress() {

    

    try {
      const response = await api.put(`/api/user-progresses/${chapter.user_progresses?.find(progress => progress.users_permissions_user?.email === user?.email)?.documentId}`, {
        data: {
          isCompleted: true,
        }
      },  );
      console.log(`Updated progress ${chapter.id}:`, response.data.data);
    } catch (error) {
      console.error(`Error updating user progress for chapter ${chapter.id}:`, chapter.user_progresses?.find(progress => progress.users_permissions_user?.email === user?.email));
    }
    
  }


  return (
    <Card className="overflow-hidden border shadow-none">
      <CardHeader className="border-b border-gray-200 text-black">
        <CardTitle className="text-2xl font-bold">{chapter.title}</CardTitle>
        <CardDescription className="text-gray-500">{chapter.shortdescription}</CardDescription>
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


          {chapter.quiz && chapter.quiz.length > 0 && (
            <TabsContent value="quiz">
              <QuizComponent 
                quiz={chapter.quiz} 
                userProgress={chapter.user_progresses?.find(progress => progress.users_permissions_user?.email === user?.email)}
                chapterId={chapter.documentId} 
 
                
                />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

