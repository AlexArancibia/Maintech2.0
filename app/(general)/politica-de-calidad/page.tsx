import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function PoliticaDeCalidad() {
  return (
    <div className="container mx-auto px-4 py-12  ">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Política de Calidad</h1>
      <div className="max-w-5xl mx-auto space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="text-2xl">Nuestro Compromiso con la Excelencia</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">
              En Maintech, nos dedicamos apasionadamente a ofrecer una formación de vanguardia en mantenimiento
              industrial e Industria 4.0. Nuestra política de calidad se fundamenta en principios sólidos que garantizan
              una educación de excelencia:
            </p>
            <ul className="space-y-4">
              {[
                "Excelencia académica en todos nuestros cursos de tecnología industrial, asegurando que cada programa cumpla con los más altos estándares del sector.",
                "Actualización constante de nuestros programas para reflejar las últimas innovaciones en la industria, manteniéndonos a la vanguardia de las tendencias tecnológicas.",
                "Enfoque práctico que combina teoría con aplicaciones del mundo real, preparando a nuestros estudiantes para los desafíos reales de la industria moderna.",
                "Colaboración estrecha con líderes de la industria para garantizar la relevancia y aplicabilidad de nuestros cursos en el entorno laboral actual.",
                "Compromiso con la innovación pedagógica, utilizando las últimas tecnologías educativas para mejorar la experiencia de aprendizaje.",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="text-2xl">Aseguramiento de la Calidad</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">
              Para mantener y elevar continuamente nuestros estándares en educación industrial, implementamos un
              riguroso sistema de aseguramiento de calidad:
            </p>
            <ul className="space-y-4">
              {[
                "Evaluaciones regulares y exhaustivas de nuestros cursos e instructores especializados, garantizando la excelencia en la entrega de contenidos.",
                "Incorporación activa de retroalimentación de estudiantes y empresas del sector industrial, asegurando que nuestros programas satisfagan las necesidades reales del mercado.",
                "Actualización continua de nuestro contenido para reflejar las últimas tecnologías y prácticas en mantenimiento industrial e Industria 4.0, manteniendo nuestros cursos a la vanguardia.",
                "Inversión sustancial en equipos y software de última generación para simular entornos industriales reales, proporcionando una experiencia de aprendizaje inmersiva y práctica.",
                "Desarrollo profesional continuo de nuestros instructores, asegurando que estén al día con las últimas tendencias y tecnologías industriales.",
                "Auditorías internas y externas regulares para garantizar el cumplimiento de los estándares internacionales de calidad en educación técnica.",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              En Maintech, la calidad no es solo un objetivo, es nuestra forma de ser. Nos esforzamos continuamente por
              superar las expectativas, formando profesionales altamente capacitados y preparados para liderar la
              transformación digital en la industria.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

