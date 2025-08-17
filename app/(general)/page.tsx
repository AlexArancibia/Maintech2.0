import type { Metadata } from "next";
import HomeBanner from './_components/HomeBanner'
import FeaturesSection from './_components/FeaturesSection'
import ProgramSlider from './_components/CategoriesSlider'
import UpcomingCourses from './_components/UpcomingCourses'
import Testimonials from './_components/Testimonial'
import InitialChoiceProvider from '@/components/InitialChoiceProvider'

export const metadata: Metadata = {
  title: "Inicio",
  description: "Maintech es la plataforma líder en formación de mantenimiento tecnológico. Descubre cursos especializados, certificaciones profesionales y la mejor educación técnica del sector industrial.",
  keywords: [
    "mantenimiento tecnológico",
    "cursos técnicos online",
    "formación profesional industrial",
    "certificaciones técnicas",
    "tecnología industrial",
    "mantenimiento preventivo",
    "automatización industrial",
    "ingeniería de mantenimiento",
    "cursos de tecnología",
    "educación técnica"
  ],
  openGraph: {
    title: "Maintech - El Futuro del Mantenimiento Tecnológico",
    description: "Plataforma líder en formación de mantenimiento tecnológico. Cursos especializados y certificaciones profesionales.",
    url: "https://maintech.com",
    images: [
      {
        url: "/home1.png",
        width: 1200,
        height: 630,
        alt: "Maintech - Formación en Mantenimiento Tecnológico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maintech - El Futuro del Mantenimiento Tecnológico",
    description: "Plataforma líder en formación de mantenimiento tecnológico. Cursos especializados y certificaciones profesionales.",
    images: ["/home1.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <InitialChoiceProvider />
      <HomeBanner />
      <FeaturesSection />
      <ProgramSlider />
      <UpcomingCourses /> 
      <Testimonials />
    </div>
  )
}