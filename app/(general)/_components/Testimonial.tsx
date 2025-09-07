'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { motion , AnimatePresence } from "motion/react"
import { useCardSection } from "@/hooks/CardSectionsContext";

interface TestimonialCard {
  id: number;
  image: string;
  name: string;
  role: string;
  testimonial: string;
}

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const { data: sections, loading, error } = useCardSection("k1e6obytf5ad5xpzqx1gjgz4", { populateCard: true });
  
  const testimonials = useMemo(() => {
    const section = sections[0];
    if (!section) return [];
    
    return (section?.card || []).map((card: any): TestimonialCard => {
      let testimonial = "";
      if (Array.isArray(card.description) && card.description.length > 0) {
        const paragraph = card.description.find((d: any) => d.type === "paragraph");
        if (paragraph && Array.isArray(paragraph.children) && paragraph.children.length > 0) {
          testimonial = paragraph.children.map((child: any) => child.text).join(" ");
        }
      }
      return {
        id: card.id,
        image: card.image?.url ? `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${card.image.url}` : "",
        name: card.title,
        role: card.subtitle,
        testimonial
      };
    });
  }, [sections]);

  const nextTestimonial = useCallback(() => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (!isPaused && testimonials.length > 0) {
      const interval = setInterval(nextTestimonial, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextTestimonial, testimonials.length]);

  const handleTestimonialClick = (index: number) => {
    setActiveTestimonial(index);
    setIsPaused(true);
  };

  return (
    <div className='bg-gray-100'>
      <div className="container-section relative py-16 min-h-[600px] flex justify-center items-center rounded-tr-[100px] sm:rounded-tr-[150px] md:rounded-tr-[250px]"
        style={{
          backgroundImage: 'url("/testimonio.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        <div className="content-section text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 md:mb-16">
            Testimonios
          </h2>

          {/* Mobile Testimonial */}
          <div className="md:hidden mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-white overflow-hidden mb-4">
                  <img
                    src={testimonials[activeTestimonial]?.image}
                    alt={testimonials[activeTestimonial]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white text-lg mb-4 px-4">
                  "{testimonials[activeTestimonial]?.testimonial}"
                </p>
                <p className="text-white font-semibold">
                  {testimonials[activeTestimonial]?.name}
                </p>
                <p className="text-white/80 text-sm">
                  {testimonials[activeTestimonial]?.role}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center space-x-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleTestimonialClick(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeTestimonial ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Ver testimonio ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Testimonial */}
          <div className="hidden md:block">
            <div className="relative flex justify-center items-center mb-4">
              {/* Connector lines */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[2px] bg-white/30" />
              
              <div className="relative flex items-center justify-between w-full max-w-4xl">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    onClick={() => handleTestimonialClick(index)}
                    className={`relative transition-all duration-300 ${
                      index === activeTestimonial ? 'z-10' : 'z-0'
                    }`}
                    aria-label={`Ver testimonio de ${testimonial.name}`}
                  >
                    <div
                      className={`rounded-full border-4 ${
                        index === activeTestimonial 
                          ? 'border-white scale-100' 
                          : 'border-white/50 scale-90 hover:border-white hover:scale-95'
                      } overflow-hidden transition-all duration-300 ${
                        index === activeTestimonial ? 'w-32 h-32' : 'w-20 h-20'
                      }`}
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-2xl mx-auto text-center"
                >
                  <p className="text-white text-lg mb-4">
                    "{testimonials[activeTestimonial]?.testimonial}"
                  </p>
                  <p className="text-white font-semibold">
                    {testimonials[activeTestimonial]?.name}
                  </p>
                  <p className="text-white/80 text-sm">
                    {testimonials[activeTestimonial]?.role}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

