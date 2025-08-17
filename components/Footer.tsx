'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { PhoneCall, Mail, Facebook, Linkedin, ChevronRight, ArrowRight, Instagram, Youtube } from 'lucide-react'
import { socialLinks } from '@/lib/social'

export default function Footer() {
  return (
    <footer className="relative bg-gray-100">
      {/* Contact CTA Section */}
      <div className="container-section px-4 pb-10 pt-10 sm:py-16   relative z-10">
        <div className="content-section   rounded-2xl border border-gray-400 ">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6">
            <div className="flex items-center gap-1">
              <div className="text-[#00D1FF]  space-x-3 hidden sm:flex">
                <ChevronRight className="w-6 h-6" />
                <ChevronRight className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-center sm:text-left   text-gray-800">
                Contáctate con nosotros y entérate de nuestros cursos y promociones
              </h2>
            </div>
            <Button 
              className="bg-[#FF1F6D] hover:bg-[#FF1F6D]/90 text-white rounded-full px-8 py-2 text-base"
              asChild
            >
              <Link href="/escribenos">Escribenos</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative   overflow-hidden">
        <div 
          className="absolute inset-0  "
          style={{ mixBlendMode: 'multiply' }}
        />
        <div 
          className="absolute inset-0  bg-cover bg-center opacity-10"
        />
        
        <div className="container-section relative bg-[url('/footer.png')] bg-cover bg-center"
         >
          <div className="content-section py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Logo and Contact Info */}
              <div className="sm:col-span-1 lg:col-span-3 space-y-8">
                <img
                  src="/logofooter.png"
                  alt="MainTech Logo"
                  className="h-24"
                />
                <div className="space-y-4 text-gray-300 text-sm">
                  <p className="leading-relaxed text-sm">
                    Valle Blanco Center, Oficina 18,<br />
                    Cerro Colorado, Arequipa
                  </p>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4" />
                    <a 
                      href={`tel:${socialLinks.phone}`} 
                      className="hover:text-white transition-colors"
                    >
                      +51 {socialLinks.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a 
                      href={`mailto:${socialLinks.email}`} 
                      className="hover:text-white transition-colors"
                    >
                      {socialLinks.email}
                    </a>
                  </div>
                  
                </div>
              </div>

              {/* Navigation Links */}
              <div className="sm:col-span-1 lg:col-span-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <FooterLink href="/quienes-somos">Conócenos</FooterLink>
                    <FooterLink href="/cursos">Nuestros Cursos</FooterLink>
                    <FooterLink href="   /quienes-somos#trabaja-con-nosotros">Trabaja con Nosotros</FooterLink>

                     <FooterLink href="/escribenos">Escribenos</FooterLink>
                  </div>
                  <div className="space-y-3">
                    <FooterLink href="/politica-privacidad">Política de privacidad</FooterLink>
                    <FooterLink href="/politica-de-calidad">Política de calidad</FooterLink>
                    <FooterLink href="/libro-reclamaciones">Libro de reclamaciones</FooterLink>
                    <FooterLink href="/verificar-certificado">Verificar Certificado</FooterLink>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="sm:col-span-2 lg:col-span-3 flex flex-col justify-between">
  
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-950 text-white py-2">
        <div className="container-section">
          <div className="content-section flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 text-xs sm:mb-0">
              <p className='text-sm'>© 2025 Sitio Web Creado por CREADI</p>
            </div>
            <div className="flex items-center gap-4 lg:mt-0">
                  <a 
                    href={`https://${socialLinks.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00D1FF] transition-colors"
                    aria-label="Visítanos en Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href={`https://${socialLinks.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00D1FF] transition-colors"
                    aria-label="Síguenos en LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href={`https://${socialLinks.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00D1FF] transition-colors"
                    aria-label="Síguenos en Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href={`https://${socialLinks.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00D1FF] transition-colors"
                    aria-label="Síguenos en YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a 
                    href={`https://${socialLinks.tiktok}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00D1FF] transition-colors"
                    aria-label="Síguenos en TikTok"
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-5 h-5"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                  <a 
                    href={`https://wa.me/${socialLinks.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00D1FF] transition-colors"
                    aria-label="Contáctanos por WhatsApp"
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-5 h-5"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group text-sm"
    >
      <ArrowRight className="w-4 h-4 text-secondary" />
      {children}
    </Link>
  )
}

