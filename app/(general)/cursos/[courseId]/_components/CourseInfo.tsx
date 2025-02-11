import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { InfoNode, LinkNode, ListItemNode, TextNode } from '@/types/CoursesType';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown } from 'lucide-react';

interface CourseInfoProps {
  info: InfoNode[];
}

interface ContentSection {
  title: string;
  content: React.ReactNode[];
}

const renderTextNode = (node: TextNode | LinkNode, index: number) => {
  console.log("Renderizando nodo de texto o enlace:", node);
  if (node.type === 'link') {
    return (
      <a key={index} href={node.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
        {node.children[0].text}
      </a>
    );
  }
  return (
    <span key={index} className={cn(node.bold && "font-bold", node.italic && "italic", node.underline && "underline")}>
      {node.text}
    </span>
  );
};

const renderList = (items: InfoNode[]) => {
  console.log("Renderizando lista de elementos:", items);
  if (items.length === 0) return null;
  const format = items[0].format;
  return (
    <ul className={cn("mb-4 space-y-2", format === 'unordered' ? "list-disc" : "list-decimal", "ml-4")}>
      {items.map((item, idx) => (
        <li key={idx} className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {(item.children as ListItemNode[]).map((child, childIdx) => renderTextNode(child.children[0], childIdx))}
        </li>
      ))}
    </ul>
  );
};

const renderContent = (nodes: InfoNode[]): ContentSection[] => {
  console.log("Renderizando contenido con nodos:", nodes);
  const sections: ContentSection[] = [];
  let currentSection: ContentSection | null = null;
  let currentList: InfoNode[] = [];

  const addToCurrentSection = (element: React.ReactNode) => {
    if (currentSection) {
      console.log("Añadiendo elemento a la sección actual:", element);
      currentSection.content.push(element);
    }
  };

  nodes.forEach((node, index) => {
    console.log("Procesando nodo:", node);
    if (node.type === 'heading' && (node.level === 2 || node.level === 3)) {
      console.log("Encontré un encabezado de nivel 2:", node);
      if (currentSection) {
        sections.push(currentSection);
        console.log("Sección actual guardada:", currentSection);
      }
      currentSection = {
        title: node.children.map(child => (child as TextNode).text).join(''),
        content: []
      };
      console.log("Nueva sección creada:", currentSection);
    } else if (currentSection) {
      if (node.type === 'list') {
        console.log("Encontré una lista:", node);
        currentList.push(node);
      } else {
        if (currentList.length > 0) {
          console.log("Renderizando lista acumulada:", currentList);
          addToCurrentSection(renderList(currentList));
          currentList = [];
        }

        switch (node.type) {
          case 'paragraph':
            console.log("Encontré un párrafo:", node);
            if (node.children.length === 0 || (node.children[0] as TextNode).text === '') return;
            addToCurrentSection(
              <p key={index} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                {node.children.map((child, idx) => renderTextNode(child as TextNode | LinkNode, idx))}
              </p>
            );
            break;
          case 'quote':
            console.log("Encontré una cita:", node);
            addToCurrentSection(
              <blockquote key={index} className="border-l-2 border-gray-300 pl-3 italic text-sm sm:text-base text-gray-600 mb-4">
                {node.children.map((child, idx) => renderTextNode(child as TextNode, idx))}
              </blockquote>
            );
            break;
          default:
            console.log("Nodo no reconocido:", node);
        }
      }
    }
  });

  if (currentSection) {
    sections.push(currentSection);
    console.log("Última sección guardada:", currentSection);
  }

  console.log("Secciones finales generadas:", sections);
  return sections;
};

export const CourseInfo = ({ info }: CourseInfoProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>(null);

  console.log("Información recibida en CourseInfo:", info);
  const contentSections = renderContent(info);
  console.log("Secciones de contenido generadas:", contentSections);

  return (
    <div>
      <div className="hidden sm:block mb-8">
        <Tabs defaultValue={contentSections[0]?.title} className="w-full">
          <TabsList className="w-fit flex bg-transparent gap-2 mb-6">
            {contentSections.map((section, index) => (
              <TabsTrigger
                key={index}
                value={section.title}
                onClick={() => setActiveTab(index)}
                className="text-md sm:text-xl border data-[state=active]:bg-primary data-[state=active]:text-white box-border  h-[50px] px-12"
              >
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {contentSections.map((section, index) => (
            <TabsContent key={index} value={section.title}>
              <div className="space-y-2 mt-12 pl-2">{section.content}</div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div className="sm:hidden">
        <Accordion type="single" collapsible className="w-full">
          {contentSections.map((section, index) => (
            <AccordionItem key={index} value={section.title}>
              <AccordionTrigger
                onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                className="text-left font-semibold text-gray-800 hover:text-gray-600 transition-colors duration-200"
              >
                <span className="flex items-center justify-between w-full">{section.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-4">{section.content}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};