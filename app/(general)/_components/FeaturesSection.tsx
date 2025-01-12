import { Card, CardContent } from "@/components/ui/card"
import { Network, MonitorCheck, GraduationCap } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      image: "/feature1.png",
      title: "Mejor escuela de tecnología",
      description: "Descubre nuestros cursos y talleres virtuales disponibles en línea."
    },
    {
      image: "/feature2.png",
      title: "Clases Especializadas",
      description: "Contamos con convenios en beneficio para nuestra comunidad educativa."
    },
    {
      image: "/feature3.png",
      title: "Egresados que trabajan",
      description: "Conoce a nuestros egresados y comparte con ellos sus logros."
    }
  ]

  return (
    <section className="relative bg-gray-100 py-16 z-1 container-section">
      {/* Gradient Decoration */}
      <div className="absolute left-0 top-10 h-32 hidden lg:block md:h-64 w-32 sm:w-48 md:w-64  z-0">
        <img 
          src="/iconotipo.png" 
          alt="Iconotipo MainTech" 
          className="w-full h-full object-contain opacity-40"
        />      
      </div>

      <div className="content-section   ">
        
        <h2 className="mb-12 z-10 text-center text-3xl font-bold text-gray-800">
          Sé parte de nosotros
          <span className="mt-2 block h-1 w-20 bg-pink-500 mx-auto"></span>
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg z-10">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-6 rounded-full p-3">
                  <img src={feature.image} className="w-[120px]"/>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

