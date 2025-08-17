import SomosBanner from '../_components/SomosBanner'
import MisionVision from '../_components/MisionVision'
import FeaturesSomos from '../_components/FeaturesSomos'
import { PartnersSection } from '../_components/Partner'
import WorkWithUs from '../_components/WorkWithUs'

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SomosBanner />
      <MisionVision />
      <FeaturesSomos />
      <PartnersSection />
      <WorkWithUs />
    </div>
  )
}