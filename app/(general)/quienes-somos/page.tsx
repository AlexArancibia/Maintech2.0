
import SomosBanner from '../_components/SomosBanner'
import MisionVision from '../_components/MisionVision'
import FeaturesSomos from '../_components/FeaturesSomos'
import { PartnersSection } from '../_components/Partner'
import WorkWithUs from '../_components/WorkWithUs'
import { getCardSections } from '@/hooks/cardSectionsAPI'


export default async function QuienesSomosPage() {
  const res = await getCardSections({ documentId: "bz2dmgrn223q3lxdkyx66nrj", populateCard: true });
  const section = Array.isArray(res) ? res[0] : res;
  const cards = Array.isArray(section?.card) ? section.card : [];

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