import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
 

export default function PoliticaDePrivacidad() {
  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-b ">
      <h1 className="text-4xl font-bold mb-8 text-center  ">Política de Privacidad</h1>
      <div className="max-w-5xl mx-auto space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="text-2xl">Recopilación y Uso de Información</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">
              En Maintech, líder en formación de mantenimiento industrial e Industria 4.0, nos comprometemos firmemente
              a proteger tu privacidad. Esta política detalla meticulosamente cómo recopilamos, utilizamos y
              salvaguardamos tu información personal en relación con nuestros cursos especializados.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Recopilamos información esencial para proporcionar nuestros servicios de formación especializada en
                tecnologías industriales avanzadas, garantizando una experiencia de aprendizaje personalizada y
                efectiva.
              </li>
              <li>
                Utilizamos tu información para mejorar continuamente nuestros cursos, adaptándolos a las últimas
                tendencias en mantenimiento industrial e Industria 4.0, y para optimizar tu experiencia de aprendizaje
                en estas áreas críticas.
              </li>
              <li>
                Mantenemos estrictas políticas de confidencialidad: no compartimos tu información personal con terceros
                sin tu consentimiento explícito, excepto cuando sea estrictamente necesario para la prestación de
                nuestros servicios educativos o por requerimientos legales.
              </li>
              <li>
                Implementamos medidas de seguridad avanzadas para proteger tus datos contra accesos no autorizados,
                asegurando la integridad de tu información en todo momento.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="text-2xl">Tus Derechos como Estudiante</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">
              Como estudiante valioso de Maintech, te garantizamos una serie de derechos fundamentales respecto a tu
              información personal:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Acceso Completo: Tienes derecho a acceder a toda tu información personal almacenada en nuestros
                sistemas, con total transparencia.
              </li>
              <li>
                Corrección de Datos: Puedes solicitar la corrección de cualquier dato inexacto en tu perfil de
                estudiante, asegurando la precisión de tu información.
              </li>
              <li>
                Solicitud de Eliminación: Tienes la opción de solicitar la eliminación de tus datos, sujeto a nuestras
                obligaciones legales y educativas en el ámbito de la formación industrial.
              </li>
              <li>
                Oposición al Procesamiento: Puedes oponerte al procesamiento de tu información para fines específicos,
                dándote control sobre cómo se utiliza tu data.
              </li>
              <li>
                Portabilidad de Datos: Ofrecemos la posibilidad de obtener y transferir tus datos personales en un
                formato estructurado y comúnmente utilizado.
              </li>
            </ul>
         
            <p className="mt-4">
              Para ejercer estos derechos o para cualquier consulta sobre privacidad, no dudes en contactarnos a través
              de{" "}
              <a href="mailto:privacy@maintech.com" className="text-blue-600 hover:underline">
                contacto@maintech.com.pe
              </a>
              . Nuestro equipo especializado está comprometido a responder a tus inquietudes con prontitud y eficacia,
              garantizando la protección de tus derechos en todo momento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

