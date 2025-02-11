import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronDown } from 'lucide-react'
import { Chapter } from '@/types/CoursesType'
import { cn } from "@/lib/utils"

interface ChapterInfoProps {
  chapters: Chapter[];
}

export function ChapterInfo({ chapters }: ChapterInfoProps) {
  return (
    <div className=" mb-16 mt-12 ">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {chapters.map((chapter, index) => (
          <AccordionItem 
            key={chapter.id} 
            value={chapter.chapterSlug}
            className="border rounded-lg overflow-hidden shadow-none"
          >
            <AccordionTrigger className="flex justify-between items-center w-full px-3 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200">
              <span className="flex items-center space-x-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-primary-foreground text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-base sm:text-lg">{chapter.title}</span>
              </span>
             </AccordionTrigger>
            <AccordionContent className='pb-0'>
              <div className="px-6 py-4 bg-gray-50">
                {chapter.shortdescription ? (
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {chapter.shortdescription}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base text-gray-500 italic">
                    No hay descripción disponible para este capítulo.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

