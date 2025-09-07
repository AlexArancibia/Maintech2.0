"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Shield, Monitor, Cpu, BarChart3, Droplets, Filter, BookOpen, ArrowRight, ChevronDown } from "lucide-react"
import { useState } from "react"
import { socialLinks } from "@/lib/social"
import { useCardSection } from "@/hooks/CardSectionsContext"

// Array of static icons, colors, images, descriptions for mapping
const icons = [Shield, Monitor, Cpu, BarChart3, Droplets, Filter, Filter, BookOpen]
const colors = ["primary", "secondary", "primary", "secondary", "primary", "secondary", "primary", "secondary"]
const images = ["/feature1.png", "/feature2.png", "/feature3.png", "/feature1.png", "/feature2.png", "/feature3.png", "/feature1.png", "/feature2.png"]
const staticDescriptions = [
  "Una cultura basada en confiabilidad será clave en la gestión de nuestros activos físicos, aquí es donde IDC es un aliado estratégico para las organizaciones, para identificar y plantear un ciclo de mejora continua, soportado en caracterización, indicadores, métodos estadísticos, formación, certificación, introducción de nuevas tecnologías y otras estrategias que garantizan el camino a una implementación exitosa.",
  "La implementación de técnicas de monitoreo de condición CBM serán un elemento clave para conocer la salud de los activos de la organización.",
  "A través de nuestra tecnología IDEAR de monitoreo offline, online y Wireless, garantizamos la confiabilidad e integridad de los activos más críticos de la organización. Nuestros desarrollos se fundamentan en los elementos de la Industria 4.0.",
  "La implementación de diferentes metodologías orientadas a la gestión de activos otorgan solidez y una cultura de mejora continua, sin embargo, esto representa un gran reto en cuanto al análisis cualificado de los datos para la toma efectiva de decisiones.",
  "Según estudios, hasta el 54% de las áreas de oportunidad de optimización de costos y reducción de fallas en las organizaciones industriales, se encuentran en el área de lubricación. Desde IDC proponemos un sistema ordenado y sistemático, enfocado a identificar las oportunidades de optimización.",
  "Con el objetivo de prolongar la vida útil del aceite, manteniendo sus propiedades físico-químicas a un costo óptimo, generando un impacto en la salud de los activos, en IDC suministramos soluciones de flushing, microfiltración y purificación garantizando en tiempo real el grado de limpieza bajo el estándar ISO 4406.",
  "Visualizar el lubricante como un activo y no como un consumible nos permitirá determinar las inversiones claves para la extensión de su vida útil y la disminución de fallas en nuestra maquinaria. Nuestra tecnología para purificación de aceites por diferentes métodos, les permitirá a las organizaciones tener una solución in house.",
  "En IDC reconocemos el recurso humano como el capital más importante de la organización, es por eso que nuestros planes de formación y concientización se enfocan en el desarrollo de habilidades orientadas al liderazgo en confiabilidad y gestión de activos."
]

export function ServicesSection() {
  const [expandedServices, setExpandedServices] = useState<number[]>([])

  const toggleService = (index: number) => {
    setExpandedServices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const { data: sections, loading, error } = useCardSection("xnz2bemu7o0rqvicpiw21n9x", { populateCard: true });
  const section = sections[0] || null;


  return (
    <section className="py-16 bg-gray-100 relative overflow-hidden" id="servicios">
      <div className="absolute left-0 top-10 h-32 hidden lg:block md:h-64 w-32 sm:w-48 md:w-64 z-0">
        <img 
          src="/iconotipo.png" 
          alt="Iconotipo MainTech" 
          className="w-full h-full object-contain opacity-40"
        />      
      </div>

      <div className="container-section">
        <div className="content-section">
          <div className="text-center mb-12 z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-4 border border-accent/20">
              <Settings className="w-4 h-4 mr-2" />
              NUESTRAS SOLUCIONES
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {section?.title}
            </h2>
            <span className="mt-2 block h-1 w-20 bg-accent mx-auto mb-4"></span>
            <p className="text-gray-600 text-sm max-w-3xl mx-auto leading-relaxed">
              {section?.description}
            </p>
          </div>
          {/* Main Content - Image Left, Accordion Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Left Side - Image */}
            <div className="order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-xl">
                <img
                  src="/solution1.png"
                  alt="Soluciones MainTech"
                  className="w-full object-contain bg-gray-50"
                />
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6">
                  <div className="bg-white/90 backdrop-blur-md rounded-lg md:rounded-xl px-3 md:px-4 py-2 shadow-lg">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold text-xs md:text-sm">
                      Soluciones Integrales
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Accordion Solutions */}
            <div className="order-1 lg:order-2 space-y-2 md:space-y-3">
              {Array.isArray(section?.card) && section.card.map((card: any, index: number) => {
                // Map features from card.description
                let features: string[] = []
                if (Array.isArray(card.description)) {
                  const list = card.description.find((d: any) => d.type === "list")
                  if (list && Array.isArray(list.children)) {
                    features = list.children.map((item: any) => item.children?.[0]?.text || "")
                  }
                }
                const IconComponent = icons[index]
                const isExpanded = expandedServices.includes(index)
                return (
                  <Card key={index} className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200">
                    <button
                      onClick={() => toggleService(index)}
                      className="w-full text-left p-3 md:p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                          </div>
                          <h3 className="font-semibold text-gray-800 text-left text-base md:text-lg">{card.title}</h3>
                        </div>
                        <ChevronDown 
                          className={`w-4 h-4 md:w-5 md:h-5 text-gray-500 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Accordion Content */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-3 md:px-4 pb-3 md:pb-4">
                        <p className="text-gray-600 mb-3 md:mb-4 leading-relaxed text-xs md:text-sm">{card.subtitle || staticDescriptions[index]}</p>

                        <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                          {features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 font-medium text-xs md:text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          size="default"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-2 md:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-colors text-xs md:text-sm"
                          onClick={() =>
                            window.open(
                              card.buttonLink || `https://wa.me/${socialLinks.whatsapp}?text=Me interesa conocer más sobre ${card.title}`,
                              "_blank",
                            )
                          }
                        >
                          {card.buttonText || "Consultar Servicio"}
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
