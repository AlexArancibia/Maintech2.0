import { useState } from 'react'
import { BookOpen, Video, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DetailedChapter } from "@/types/ChapterType"

interface ChapterContentProps {
  chapter: DetailedChapter | null
  onMarkAsRead: (chapterId: number) => void
  isLoading: boolean
}

export function ChapterContent({ chapter, onMarkAsRead, isLoading }: ChapterContentProps) {
  const [activeTab, setActiveTab] = useState('content')

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-[300px] mb-4" />
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!chapter) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Selecciona un capítulo para ver su contenido.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{chapter.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{chapter.shortdescription}</p>
          </div>
          {chapter.isFree ? (
            <Badge variant="secondary">Gratis</Badge>
          ) : (
            <Badge>Premium</Badge>
          )}
        </div>
        <Button onClick={() => onMarkAsRead(chapter.id)}>
          Marcar como leído
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="content">
              <BookOpen className="w-4 h-4 mr-2" />
              Contenido
            </TabsTrigger>
            {chapter.recorded_video && (
              <TabsTrigger value="video">
                <Video className="w-4 h-4 mr-2" />
                Video
              </TabsTrigger>
            )}
            {chapter.quiz && (
              <TabsTrigger value="quiz">
                <FileText className="w-4 h-4 mr-2" />
                Quiz
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="content">
            <div className="prose prose-sm max-w-none">
              {chapter.content.map((item, index) => (
                <p key={index} className="mb-4">
                  {item.children[0]?.text}
                </p>
              ))}
            </div>
          </TabsContent>
          {chapter.recorded_video && (
            <TabsContent value="video">
              <video
                controls
                src={`https://stream.mux.com/${chapter.recorded_video.playback_id}.m3u8`}
                className="w-full h-full rounded-lg"
              />
            </TabsContent>
          )}
          {chapter.quiz && (
            <TabsContent value="quiz">
              <p>Contenido del quiz aquí</p>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

