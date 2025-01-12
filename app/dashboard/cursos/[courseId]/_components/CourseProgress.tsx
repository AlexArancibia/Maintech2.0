import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
  progress: number;
}

export default function CourseProgress({ progress }: CourseProgressProps) {
  return (
    <Card className="mb-6 shadow-none">
      <CardHeader>
        <CardTitle>Progreso del Curso</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground  mt-2">
          {Math.round(progress)}% completado
        </p>
      </CardContent>
    </Card>
  );
}

