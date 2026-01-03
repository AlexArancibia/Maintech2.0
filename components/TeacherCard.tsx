import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, MapPin } from 'lucide-react';
import { Teacher } from "@/types/TeacherType";

interface TeacherCardProps {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <Card className="w-full max-w-[430px]    overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
      <div className="relative h-[350px] w-full overflow-hidden">
        <Image
          src={teacher.photo.url}
          alt={teacher.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pt-6 text-center ">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {teacher.name}
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{teacher.titulo}</p>
        <div className="flex items-center justify-center mt-3 space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <Badge variant="outline" className="text-xs font-medium">
            {teacher.country}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4 pt-0">
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6 line-clamp-3">
          {teacher.biography}
        </p>
        
        <div className="flex flex-col space-y-3">

          
          {teacher.linkedin && (
            <Button variant="outline" className="w-full" asChild>
              <a
                href={teacher.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                Ver perfil de LinkedIn
              </a>
            </Button>
          )}
        </div>
        
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
          Miembro desde {new Date(teacher.createdAt).toLocaleDateString('es-ES', { timeZone: 'America/Lima' })}
        </p>
      </CardContent>
    </Card>
  );
}

