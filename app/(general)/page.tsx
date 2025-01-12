"use client"

import HomeBanner from './_components/HomeBanner'
import FeaturesSection from './_components/FeaturesSection'
import ProgramSlider from './_components/CategoriesSlider'
import UpcomingCourses from './_components/UpcomingCourses'
import Testimonials from './_components/Testimonial'

 
 

export default function HomePage() {
 

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeBanner />
      <FeaturesSection />
      <ProgramSlider />
      <UpcomingCourses /> 
      <Testimonials />

 
      
    </div>
  )
}