import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DetailedChapter } from "@/types/ChapterType";
import { LinkNode, ListItemNode, TextNode } from "@/types/CoursesType";
import { User } from "@/types/StudentType";
import { FileQuestion, CheckCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
 

interface ChapterListProps {
  chapters: DetailedChapter[];
  selectedChapter: DetailedChapter | null;
  onSelectChapter: (chapter: DetailedChapter) => void;
  currentUser: User | null;
}

export default function ChapterList({ chapters, selectedChapter, onSelectChapter,currentUser  }: ChapterListProps) {
  const renderTextContent = (nodes: (TextNode| ListItemNode | LinkNode)[]) => {
    return nodes.map((node, index) => {
      if (node.type === 'text') {
        return <span key={index}>{node.text}</span>;
      } else if (node.type === 'link') {
        return <span key={index}>{node.children[0].text}</span>;
      } else if (node.type === 'list-item') {
        return <span key={index}>{renderTextContent(node.children)}</span>;
      }
      return null;
    });
  };
  const sortedChapters = useMemo(() => 
    [...chapters].sort((a, b) => a.position - b.position),
    [chapters]
  );
  useEffect(() => {
    if (sortedChapters.length > 0) {
      onSelectChapter(sortedChapters[0]);
    }
  }, [sortedChapters, onSelectChapter]);


  const isChapterCompleted = (chapter: DetailedChapter) => {
    if (!currentUser) return false;
    return chapter.user_progresses?.some(progress => 
      progress.isCompleted && progress.users_permissions_user?.id === currentUser.id
    ) ?? false;
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Capítulos del Curso</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto">
          {sortedChapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-primary/15 ${
                selectedChapter?.id === chapter.id ? "bg-gray-100" : ""}
                `}
              onClick={() => onSelectChapter(chapter)}
            >
              <div className="flex items-center space-x-3">
              <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 bg-gray-200/80 text-secondary-foreground"
                  )}
                >{chapter.position}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{chapter.title}</h3>
                    {chapter.quiz && chapter.quiz.length > 0 && !isChapterCompleted(chapter) && (
                      <Badge className="bg-gray-100 border border-gray-300 text-gray-800 hover:bg-accent hover:text-white text-xs py-0 px-1.5">
                        <FileQuestion className="w-3 h-3 mr-1" />
                        Quiz
                      </Badge>
                    )}
                    {isChapterCompleted(chapter) && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs py-0 px-1.5">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completado
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {chapter.shortdescription}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {chapters.length === 0 && (
            <div className="p-4">
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

