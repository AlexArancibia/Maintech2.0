import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users, Globe, Award } from "lucide-react"

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="transition-all shadow-none  hover:shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-sky-500">
              <Video className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-base lg:text-lg">Clase en vivo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
          Experimenta clases interactivas en vivo con grabaciones disponibles 24/7. Participa activamente y revisa el contenido cuando lo necesites.
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all shadow-none hover:shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-sky-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-base lg:text-lg">Seguimiento personalizado</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Recibe atención personalizada de nuestro equipo académico durante todo tu proceso de aprendizaje. Resuelve dudas y obtén orientación constante.</p>
        </CardContent>
      </Card>

      <Card className="transition-all shadow-none hover:shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-sky-500">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-base lg:text-lg">Plataforma virtual</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Accede a nuestra plataforma virtual en cualquier momento y desde cualquier dispositivo. Encuentra recursos, materiales y herramientas de estudio.</p>
        </CardContent>
      </Card>

      <Card className="transition-all  shadow-none hover:shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-sky-500">
              <Award className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-base lg:text-lg">Certificado Digital</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Obtén un certificado avalado por Maintech que valida tus horas académicas de formación. Disponible en formato digital. </p>
        </CardContent>
      </Card>
    </div>
  )
}

