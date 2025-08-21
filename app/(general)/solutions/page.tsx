

import { HeroSection } from "@/components/solutions/hero-section";
import { ServicesSection } from "@/components/solutions/service-section";
import { WhyChooseUsSection } from "@/components/solutions/why-choose-us";
import { ContactSection } from "@/components/solutions/contact-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <ContactSection />
      {/* <JoinTeamSection />
      <SectorsSection />
      <ContactSection />   */}
 
    </main>
  )
}
