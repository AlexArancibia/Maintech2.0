import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Mail } from "lucide-react";
import { Teacher } from "@/types/TeacherType";
import { getImageUrl } from "@/lib/getImageUrl";

interface TeacherCardProps {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden bg-white">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={getImageUrl(teacher.photo.url)}
          alt={teacher.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pt-6 text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">{teacher.name}</CardTitle>
        <p className="text-sm text-gray-500 mt-1">{teacher.titulo}</p>
        <Badge variant="outline" className="mt-3 text-gray-700 border-gray-300">
          {teacher.country}
        </Badge>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <p className="text-sm text-gray-600 text-center mb-4">{teacher.biography}</p>
        
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Mail className="w-5 h-5 text-gray-500" />
          <a href={`mailto:${teacher.email}`} className="text-sm text-blue-500 hover:underline">
            {teacher.email}
          </a>
        </div>
        
        {teacher.linkedin && (
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Linkedin className="w-5 h-5 text-gray-500" />
            <a
              href={teacher.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              LinkedIn
            </a>
          </div>
        )}
        
        <p className="text-xs text-gray-400 text-center">
          Miembro desde {new Date(teacher.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
