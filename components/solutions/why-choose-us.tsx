"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { 
  FaUsers, 
  FaGraduationCap, 
  FaBriefcase, 
  FaBolt, 
  FaDesktop, 
  FaDollarSign 
} from "react-icons/fa"
import { useCardSection } from "@/hooks/CardSectionsContext"
import { getStrapiMediaUrl } from "@/lib/getStrapiMediaUrl"

const icons = [FaUsers, FaGraduationCap, FaBriefcase, FaBolt, FaDesktop, FaDollarSign]

export function WhyChooseUsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  // Cards data
  const { data: cardSections, loading: loadingCards, error: errorCards } = useCardSection("ekm5113zuc5nz0sgvey4gf8j", { populateCard: true });
  const cardSection = cardSections[0] || null;

  // Backgrounds and general info
  const { data: bgSections, loading: loadingBg, error: errorBg } = useCardSection("ekm5113zuc5nz0sgvey4gf8j", { populate: "*" });
  const bgSection = bgSections[0] || null;

  // Achievements/cards
  const achievements = Array.isArray(cardSection?.card)
    ? cardSection.card.map((card: any, index: number) => {
        const IconComponent = icons[index % icons.length];
        return {
          title: card.title,
          description: card.subtitle,
          Icon: IconComponent
        };
      })
    : []

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % achievements.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + achievements.length) % achievements.length)
  }

  // Get background image URLs from bgSection
  const desktopBgUrl = bgSection?.background?.url ? getStrapiMediaUrl(bgSection.background.url) : undefined;
  const mobileBgUrl = bgSection?.mobileBackground?.url ? getStrapiMediaUrl(bgSection.mobileBackground.url) : desktopBgUrl;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image - Desktop and Mobile */}
      <div
        className="absolute inset-0 bg-cover bg-left bg-no-repeat"
        style={{ backgroundImage: `url('${desktopBgUrl}')` }}
      ></div>
      {/* White to transparent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-transparent"></div>
      <div className="container-section relative z-10">
        <div className="content-section">
          {/* Header - Centered */}
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            {bgSection?.title || "¿Por qué elegirnos?"}
          </h2>
          <span className="mt-2 block h-1 w-20 bg-accent mx-auto mb-12"></span>

          {/* Desktop Grid - Hidden on mobile */}
          <div className="hidden md:grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement: {title: string, description: string, Icon: React.ComponentType<{className?: string}>}, index: number) => {
              const IconComponent = achievement.Icon;
              return (
                <Card key={index} className="border-none shadow-lg z-10">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-6 rounded-full p-3 bg-primary/10">
                      <IconComponent className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="mb-4 text-xl font-semibold text-gray-800">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Mobile Carousel - Visible only on mobile */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {achievements.map((achievement: {title: string, description: string, Icon: React.ComponentType<{className?: string}>}, index: number) => {
                  const IconComponent = achievement.Icon;
                  return (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <Card className="border-none shadow-lg z-10">
                        <CardContent className="flex flex-col items-center p-6 text-center">
                          <div className="mb-6 rounded-full p-3 bg-primary/10">
                            <IconComponent className="w-16 h-16 text-primary" />
                          </div>
                          <h3 className="mb-4 text-xl font-semibold text-gray-800">
                            {achievement.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {achievement.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="w-10 h-10 p-0 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              {/* Dots indicator */}
              <div className="flex space-x-2">
                {achievements.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="w-10 h-10 p-0 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Button 
              variant="outline"
              size="default"
              className="border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
              onClick={() => window.open(bgSection?.buttonLink || "https://wa.me/51953804859?text=Me interesa conocer más sobre sus servicios", "_blank")}
            >
              {bgSection?.buttonText || "Conecta con nosotros"}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
