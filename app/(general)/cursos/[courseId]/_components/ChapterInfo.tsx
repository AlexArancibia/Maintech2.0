import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Chapter } from '@/types/CoursesType'

interface ChapterInfoProps {
  chapters: Chapter[];
}

export function ChapterInfo({ chapters }: ChapterInfoProps) {
  return (
    <div className="max-w-full mx-auto px-4 py-6">
      <Accordion type="single" collapsible className="w-full">
        {chapters.map((chapter, index) => (
          <AccordionItem key={chapter.id} value={chapter.chapterSlug}>
            <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-gray-600 transition-colors duration-200">
              <span className="flex items-center justify-between w-full">
                <span className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">
                    {index + 1}.
                  </span>
                  {chapter.title}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" />
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4">
                {chapter.shortdescription ? (
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {chapter.shortdescription}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic mb-4">
                    No hay descripción disponible para este capítulo.
                  </p>
                )}
                {chapter.attachment && chapter.attachment.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Archivos adjuntos:</h4>
                    <ul className="list-disc list-inside">
                      {chapter.attachment.map((file) => (
                        <li key={file.id} className="text-sm text-blue-600 hover:underline">
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            {file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {chapter.isFree && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                    Capítulo gratuito
                  </span>
                )}
                {chapter.liveSessionUrl && (
                  <div className="mt-2">
                    <a 
                      href={chapter.liveSessionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Enlace a la sesión en vivo {chapter.platform && `(${chapter.platform})`}
                    </a>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

