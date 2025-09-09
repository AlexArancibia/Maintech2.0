"use client"
import { socialLinks } from '@/lib/social'
import React, { useMemo } from 'react'
import { useCardSection } from '@/hooks/CardSectionsContext'

function useRoles() {
  const { data: sections, loading, error } = useCardSection('ixoklgqxn382lxbvyg4aha2x', { populateCard: true });
  
  const roles = useMemo(() => {
    const section = sections[0];
    if (!section) return [];
    
    const cards = Array.isArray(section?.card) ? section.card : []
    return cards.map((card: any) => ({
      title: card.title || '',
      message: `¡Hola! Me interesa el puesto de ${card.title || ''} en MAINTECH`,
      image: card.image?.url ? `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${card.image.url}` : '/placeholder.svg',
    }))
  }, [sections]);
  
  return roles
}

const handleWhatsAppClick = (message: string) => {
  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/${socialLinks.whatsapp}?text=${encodedMessage}`, '_blank')
}

function WorkWithUs() {
  const roles = useRoles()
  return (
    <>
      <div className="relative">
        <div id='trabaja-con-nosotros' className="container-section p-8 sm:p-16 bg-[url('/work1.png')] bg-cover bg-right h-[400px] lg:h-[500px] relative z-10">
          <div className="content-section relative z-20"> 
            <div className="font-orbitron text-center text-4xl md:text-6xl lg:text-7xl pt-8 text-white">
              Somos
              <br />
              <span className="font-bold">Maintech</span>
            </div>
          </div>
        </div>

        <div className="container-section p-8 sm:p-16   relative z-30 -mt-[250px]">
          <div className="content-section"> 
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div
                  key={role.title}
                  onClick={() => handleWhatsAppClick(role.message)}
                  className="group relative rounded-xl h-[300px] sm:h-[350px] md:h-[450px] lg:h-[350px] xl:h-[400px] cursor-pointer transition-all duration-300 hover:scale-105"
                >
                  <img 
                    src={role.image} 
                    alt={role.title}
                    className="w-full h-full object-cover rounded-xl object-left"
                  />  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkWithUs

