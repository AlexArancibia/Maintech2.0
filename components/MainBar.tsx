'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from '@/hooks/AuthContext'
import { Menu, X, ChevronDown, LogOut } from 'lucide-react'

const navItems = [
  { 
    href: "/cursos", 
    label: "Nuestros Cursos",
     
  },
  { 
    
    href: "/conocenos", 
    label: "Conócenos",
    subitems: [
      { href: "/quienes-somos", label: "Quienes somos" },
      { href: "/conocenos/docentes", label: "Docentes" },
      { href: "/conocenos/trabaja-con-nosotros", label: "Trabaja con nosotros" },
    ]
  },
 
  { href: "/servicios", label: "Servicios" },
  { href: "/escribenos", label: "Escríbenos" },
]

export function MainNav() {
  const { user, logout, isLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = (href: string) => {
    setOpenDropdown(openDropdown === href ? null : href)
  }

  return (
    <header className="container-section bg-neutral-50 py-4">
      <nav className="content-section flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
          <img
              src="/logo 1.png"
              alt="MainTech Logo"
              className="h-8 w-auto sm:h-8 md:h-10 transition-all duration-200"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-900">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-12">
          {navItems.map((item) => (
            <div key={item.href} className="relative group">
              {item.subitems ? (
                <>
                  <button 
                    onClick={() => toggleDropdown(item.href)}
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  >
                    {item.label}
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  {openDropdown === item.href && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {item.subitems.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  href={item.href}
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          
          {isLoading ? (
            <Skeleton className="h-10 w-24" />
          ) : user ? (
            <div className='flex'>
            <Button 
              className="bg-accent   text-white text-sm"
 
            >
              Portal Estudiante
            </Button>

            <Button 
            variant="ghost"
            size="icon"
            aria-label="Cerrar sesión"
            className="text-gray-600 hover:bg-gray-50 hover:text-accent"

            onClick={handleLogout}
            >
            <LogOut className="w-5 h-5" />
            </Button></div>
          ) : (
            <Link href="/sign-on">
              <Button className="text-white text-sm">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.subitems ? (
                <>
                  <button 
                    onClick={() => toggleDropdown(item.href)}
                    className="flex items-center justify-between w-full py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transform transition-transform duration-200 ${openDropdown === item.href ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === item.href && (
                    <div className="pl-4">
                      {item.subitems.map((subitem) => (
                        <Link 
                          key={subitem.href} 
                          href={subitem.href}
                          className="block py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  href={item.href}
                  className="block py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          
          {isLoading ? (
            <Skeleton className="h-10 w-full mt-4" />
          ) : user ? (
            <Button 
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white text-sm" 
              onClick={() => {
                handleLogout()
                setIsMenuOpen(false)
              }}
            >
              Cerrar Sesión
            </Button>
          ) : (
            <Link href="/sign-on" className="block w-full mt-4" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-blue-700 text-white text-sm">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

