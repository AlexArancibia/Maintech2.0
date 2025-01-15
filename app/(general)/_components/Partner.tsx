"use client"

import { useRef } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"

export function PartnersSection() {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const partners = [
    {
      logo: "/partner2.png",
      description: "Asume el compromiso de brindar servicios empresariales de calidad y oportunidades de negocios orientadas a la satisfacción de las necesidades y expectativas de nuestros asociados, clientes y partes interesadas; cumpliendo con los requisitos legales y reglamentarios; logrando la eficacia y mejora continua en cada uno de nuestros procesos y servicios."
    },
    {
      logo: "/partner1.png",
      description: "El LCI Perú es una organización sin fines de lucro que opera como catalizador para transformar la industria a través de la entrega de proyectos. lean utilizando un método de gestión basado en un lenguaje común, principios fundamentales y prácticas básicas."
    },
    {
      logo: "/partner3.png",
      description: "El 20 de abril de 1888 setenta y tres empresarios fundaron la Cámara de Comercio de Lima, en el local del Antiguo Tribunal del Consulado (esquina de Mercaderes y Mantas) hoy cruce de los jirones de la Unión y Callao. Tres días después el 23 de abril, don Pedro Correa y Santiago fue elegido como el primer presidente de la institución. Asimismo, la Cámara de Comercio de Lima."
    }
  ]

  return (
    <section className="bg-gray-100 container-section py-8 sm:py-16">
      <div className=" content-section">
        <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-primary text-center mb-16">
          Partners
        </h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full  "
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {partners.map((partner, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="border-none shadow-none bg-transparent h-full">
                  <CardContent className="flex flex-col items-center  space-y-6 p-6 h-full">
                    <div className="h-32 flex items-center justify-center transition-transform duration-300 hover:scale-105">
                      <img
                        src={partner.logo || "/placeholder.svg"}
                        alt="Partner logo"
                        className="max-h-full max-w-[200px] object-contain"
                      />
                    </div>
                    <p className="text-gray-600 text-sm  leading-relaxed text-justify">
                      {partner.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}

