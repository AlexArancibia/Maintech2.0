'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from '@/hooks/AuthContext'
import { Menu, X, ChevronDown, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  href: string
  label: string
  subitems?: { href: string; label: string }[]
}

const navItems: NavItem[] = [
  { href: "/cursos", label: "Nuestros Cursos" },
  { 
    href: "/conocenos", 
    label: "Conócenos",
    subitems: [
      { href: "/quienes-somos", label: "Quienes somos" },
      { href: "/quienes-somos/#trabaja-con-nosotros", label: "Trabaja con nosotros" },
    ]
  },
  { href: "/escribenos", label: "Escríbenos" },
]

const DesktopNavItem: React.FC<{
  item: NavItem
  openDropdown: string | null
  setOpenDropdown: (href: string | null) => void
}> = ({ item, openDropdown, setOpenDropdown }) => {
  if (item.subitems) {
    return (
      <div 
        className="relative group"
        onMouseEnter={() => setOpenDropdown(item.href)}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <button className="flex items-center text-sm">
          {item.label}
          <ChevronDown size={16} className="ml-1" />
        </button>
        <AnimatePresence>
          {openDropdown === item.href && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md"
            >
              {item.subitems.map((subitem) => (
                <Link
                  key={subitem.href}
                  href={subitem.href}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {subitem.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
  return (
    <Link href={item.href} className="text-sm">
      {item.label}
    </Link>
  )
}

const MobileNavItem: React.FC<{
  item: NavItem
  openDropdown: string | null
  toggleDropdown: (href: string) => void
  closeMenu: () => void
}> = ({ item, openDropdown, toggleDropdown, closeMenu }) => {
  return (
    <div className="  last:border-b-0">
      {item.subitems ? (
        <div>
          <button 
            onClick={() => toggleDropdown(item.href)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm"
          >
            {item.label}
            <ChevronDown size={16} className={openDropdown === item.href ? "rotate-180" : ""} />
          </button>
          {openDropdown === item.href && (
            <div className="bg-gray-100 px-6 py-2">
              {item.subitems.map((subitem) => (
                <Link 
                  key={subitem.href} 
                  href={subitem.href}
                  className="block py-2 text-sm"
                  onClick={closeMenu}
                >
                  {subitem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link 
          href={item.href}
          className="block px-4 py-3 text-sm"
          onClick={closeMenu}
        >
          {item.label}
        </Link>
      )}
    </div>
  )
}

export function MainNav() {
  const { user, logout, isLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), [])
  const toggleDropdown = useCallback((href: string) => {
    setOpenDropdown(prev => prev === href ? null : href)
  }, [])

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  const memoizedNavItems = useMemo(() => navItems, [])

  return (
    <header className="bg-neutral-50 py-4 shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <img src="/logo 1.png" alt="MainTech Logo" className="h-10 w-auto" />
          </Link>

          <button 
            onClick={toggleMenu} 
            className="md:hidden"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {memoizedNavItems.map((item) => (
              <DesktopNavItem 
                key={item.href}
                item={item}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            ))}
            
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : user ? (
              <div className='flex space-x-2'>
                <Link href="/dashboard">
                <Button className="bg-accent text-white text-sm">
                  Portal Estudiante
                </Button>
                </Link>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Link href="/sign-on">
                <Button className="text-white text-sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-gray-50 rounded-lg overflow-hidden"
            >
              {memoizedNavItems.map((item) => (
                <MobileNavItem
                  key={item.href}
                  item={item}
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  closeMenu={closeMenu}
                />
              ))}
              
              {isLoading ? (
                <div className="p-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : user ? (
                <div className='flex flex-col p-4 space-y-2'>
                  
                  <Link href="/dashboard">
                  <Button className="bg-accent text-white text-sm w-full">
                    Portal Estudiante
                  </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    className="text-accent w-full"
                    onClick={logout}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Cerrar sesión
                  </Button>
                </div>
              ) : (
                <div className="p-4">
                  <Link href="/sign-on" className="block">
                    <Button className="text-white text-sm w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

