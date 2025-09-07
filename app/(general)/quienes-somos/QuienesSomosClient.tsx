"use client";

import SomosBanner from '../_components/SomosBanner'
import MisionVision from '../_components/MisionVision'
import FeaturesSomos from '../_components/FeaturesSomos'
import { PartnersSection } from '../_components/Partner'
import WorkWithUs from '../_components/WorkWithUs'
import { useCardSection } from '@/hooks/CardSectionsContext'

export default function QuienesSomosClient() {
  const { data: sections, loading, error } = useCardSection("bz2dmgrn223q3lxdkyx66nrj", { populateCard: true });
  const section = sections[0] || null;
  const cards = Array.isArray(section?.card) ? section.card : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error al cargar la información</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SomosBanner section={section} descriptionCard={cards[0]} />
      <MisionVision misionCard={cards.find(c => c.title === "Misión")}
                   visionCard={cards.find(c => c.title === "Visión")}
                   descriptionCard={cards[0]} />
      <FeaturesSomos />
      <PartnersSection />
      <WorkWithUs />
    </div>
  )
}
