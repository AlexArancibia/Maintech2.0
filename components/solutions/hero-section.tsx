"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Award, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useCardSection } from "@/hooks/CardSectionsContext"

export function HeroSection() {
  const { data: sections, loading, error } = useCardSection("smk1j7aokc3y54pbklz4juek");
  const section = sections[0] as any || null;

  // Split title for design
  const titleWords = section?.title?.split(' ') || []
  const firstLine = titleWords.slice(0, 3).join(' ')
  const secondLine = titleWords.slice(3).join(' ')

  return (
    <section className="container-section bg-cover bg-center bg-no-repeat bg-[url('/solutions-banner.png')] relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr lg:bg-gradient-to-r from-primary via-primary/90 to-transparent pointer-events-none"></div>

      <div className="content-section relative z-10">
        <div className="grid lg:grid-cols-1 gap-12 lg:gap-20 items-center min-h-[650px] lg:min-h-[650px]">
          {/* Columna de contenido */}
          <div className="space-y-8 text-white text-center lg:text-left max-w-4xl mx-auto lg:mx-0">
            <div className="space-y-6">
              {/* Badge destacado */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-white font-semibold text-sm hover:bg-accent/30 transition-all duration-300 shadow-lg">
                <Award className="w-4 h-4 mr-2 text-accent" />
                {section?.subtitle}
              </div>

              {/* Título principal */}
              <div className="font-orbitron text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight">
                <span className="block text-white font-light">{firstLine}</span>
                <span className="block font-bold text-white">
                  {secondLine}
                </span>
              </div>

              {/* Descripción */}
              <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed font-light">
                {section?.description}
              </p>

              {/* Botones de acción */}
              <div className="flex justify-center lg:justify-start pt-6">
                <Link href={section?.buttonLink || "/escribenos"}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary text-white font-bold px-8 py-4 rounded-full transition-all duration-300 group border-0 text-lg shadow-xl btn-hover-lift"
                  >
                    {section?.buttonText}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}
