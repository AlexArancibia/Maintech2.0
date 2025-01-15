import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
const features = [
  { image: '/fs1.png', title: 'Últimas tendencias' },
  { image: '/fs2.png', title: 'Formación continua' },
  { image: '/fs3.png', title: 'Portal de empleabilidad' },
  { image: '/fs4.png', title: 'Metodología' },
]

function FeaturesSomos() {
  return (
    <div className='container-section p-8 sm:p-16 sm:pt-8 bg-gray-100'> 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 content-section">
      {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center bg-gray-50/40 hover:scale-110 transition-all ease-in-out  justify-center p-6 h-full">
              <CardContent className="flex flex-col items-center text-center">
                <div className="w-32 h-32 relative mb-4">
                  <img
                    src={feature.image}
                    alt={feature.title}
 
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mt-2">{feature.title}</h3>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

export default FeaturesSomos