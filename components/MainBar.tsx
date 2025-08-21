'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from '@/hooks/AuthContext'
import { Menu, X, ChevronDown, LogOut, GraduationCap, Settings, BookOpen, Zap, Users, Mail } from 'lucide-react'
import { CurrencySelector } from './CurrencySelector'
import { UserDropdown } from './UserDropdown'
import { useInitialChoice } from '@/hooks/useInitialChoice'

import { motion , AnimatePresence } from "motion/react"

interface NavItem {
  href: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  subitems?: { href: string; label: string; icon?: React.ComponentType<{ className?: string }> }[]
}

const navItems: NavItem[] = [
  { href: "/cursos", label: "Nuestros Cursos", icon: BookOpen },
  { href: "/solutions", label: "Nuestras Soluciones", icon: Zap },
  { 
    href: "/conocenos", 
    label: "Conócenos",
    icon: Users,
    subitems: [
      { href: "/quienes-somos", label: "Quienes somos" },
      { href: "/quienes-somos/#trabaja-con-nosotros", label: "Trabaja con nosotros" },
    ]
  },
  { href: "/escribenos", label: "Escríbenos", icon: Mail },
]

// Componente de Logo Dinámico
const DynamicLogo: React.FC = () => {
  const pathname = usePathname()
  const isSolutionsPage = pathname === '/solutions'
  
  return (
    <Link href="/" className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105 active:scale-95">
      <img src="/logo 1.png" alt="MainTech Logo" className="h-10 w-auto" />
      <div className="hidden lg:flex items-center">
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        <div className=" flex flex-col pl-2">
          <span className="text-2xl font-bold text-gray-900">MainTech</span>
          <span className="text-md -mt-2.5 font-medium text-gray-600">
            {isSolutionsPage ? 'Solutions' : 'Academy'}
          </span>
        </div>
      </div>
    </Link>
  )
}

// Componente de Logo Dinámico para Mobile (sin texto lateral)
const MobileLogo: React.FC = () => {
  const pathname = usePathname()
  const isSolutionsPage = pathname === '/solutions'
  
  return (
    <Link href="/" className="flex flex-col items-center transition-transform duration-200 hover:scale-105 active:scale-95">
      <img src="/logo 1.png" alt="MainTech Logo" className="h-12 w-auto mb-3" />
      <div className="w-48 h-px bg-border mx-auto mb-3"></div>
      <div className="text-center">
        <span className="text-xl font-bold text-gray-900">MainTech</span>
        <div className="text-lg font-medium text-gray-600 -mt-2">
          {isSolutionsPage ? 'Solutions' : 'Academy'}
        </div>
      </div>
    </Link>
  )
}

const DesktopNavItem: React.FC<{
  item: NavItem
  openDropdown: string | null
  setOpenDropdown: (href: string | null) => void
}> = ({ item, openDropdown, setOpenDropdown }) => {
  const pathname = usePathname()
  const isActive = pathname === item.href || (item.subitems && item.subitems.some(subitem => pathname === subitem.href))
  
  if (item.subitems) {
    return (
      <div 
        className="relative group"
        onMouseEnter={() => setOpenDropdown(item.href)}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <button className={`flex items-center text-sm px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-accent active:bg-gray-200 active:scale-95 ${
          isActive ? 'bg-accent/10 text-accent font-medium shadow-sm' : 'text-gray-700'
        }`}>
          {item.label}
          <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${openDropdown === item.href ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {openDropdown === item.href && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 gap-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100"
            >
              {item.subitems.map((subitem) => {
                const isSubItemActive = pathname === subitem.href
                return (
                  <Link
                    key={subitem.href}
                    href={subitem.href}
                    className={`block px-4 py-2 text-sm transition-all duration-200 hover:bg-gray-100 hover:text-accent active:bg-gray-200 first:rounded-t-md last:rounded-b-md ${
                      isSubItemActive ? 'bg-accent/10 text-accent font-medium' : ''
                    }`}
                  >
                    {subitem.label}
                  </Link>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
  return (
    <Link 
      href={item.href} 
      className={`text-sm px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-accent active:bg-gray-200 active:scale-95 ${
        isActive ? 'bg-accent/10 text-accent font-medium shadow-sm' : 'text-gray-700'
      }`}
    >
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
  const pathname = usePathname()
  const isActive = pathname === item.href || (item.subitems && item.subitems.some(subitem => pathname === subitem.href))
  
  return (
    <div className="last:border-b-0">
      {item.subitems ? (
        <div>
          <button 
            onClick={() => toggleDropdown(item.href)}
            className={`flex items-center justify-between w-full px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-white hover:text-accent active:bg-gray-100 rounded-lg ${
              isActive ? 'bg-accent/10 text-accent border-l-4 border-accent shadow-sm' : 'text-gray-700'
            }`}
          >
            <span>{item.label}</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === item.href ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === item.href && (
            <div className="bg-white/80 px-4 py-2 space-y-1">
              {item.subitems.map((subitem) => {
                const isSubItemActive = pathname === subitem.href
                return (
                  <Link 
                    key={subitem.href} 
                    href={subitem.href}
                    className={`block py-2 text-sm transition-all duration-200 hover:text-accent active:text-accent/80 font-medium px-2 rounded ${
                      isSubItemActive ? 'bg-accent/10 text-accent' : ''
                    }`}
                    onClick={closeMenu}
                  >
                    {subitem.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <Link 
          href={item.href}
          className={`block px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-white hover:text-accent active:bg-gray-100 rounded-lg ${
            isActive ? 'bg-accent/10 text-accent border-l-4 border-accent shadow-sm' : 'text-gray-700'
          }`}
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
    <header className="bg-neutral-50 py-4 shadow-sm top-0 z-50">
      <nav className="max-w-[1500px] mx-auto px-4">
        <div className="flex justify-between items-center">
          <DynamicLogo />

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button 
                className="lg:hidden p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:bg-gray-200 active:scale-95"
                aria-label="Abrir menú"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] sm:w-[450px] bg-gray-50">
              <SheetHeader>
                <SheetTitle className="text-center">
                  <MobileLogo />
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-8 space-y-4">
                {/* Currency Selector */}
                <div className="flex justify-center">
                  <div className="w-full max-w-xs">
                    <CurrencySelector />
                  </div>
                </div>
                
                {/* Navigation Items */}
                <div className="space-y-1">
                  {memoizedNavItems.map((item) => (
                    <MobileNavItem
                      key={item.href}
                      item={item}
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      closeMenu={closeMenu}
                    />
                  ))}
                </div>
                
                {/* User Section */}
                {isLoading ? (
                  <div className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : user ? (
                  <div className='p-3 border-t border-gray-200 space-y-3'>
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center text-white font-medium text-base shadow-md">
                        {user.username ? user.username.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{user.username || 'Usuario'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className='space-y-2'>
                      <Link href="/dashboard" className="block">
                        <Button className="bg-gradient-to-r from-accent to-accent/90 text-white text-sm w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg shadow-md active:shadow-sm">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Portal Estudiante
                        </Button>
                      </Link>
                      <Button 
                        variant="outline"
                        className="text-accent w-full transition-all duration-200 hover:bg-accent hover:text-white active:scale-[0.98] active:shadow-sm border-accent/30"
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar sesión
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border-t border-gray-200">
                    <Link href="/sign-on" className="block">
                      <Button className="bg-gradient-to-r from-accent to-accent/90 text-white text-sm w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg shadow-md">
                        Iniciar Sesión
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden lg:flex items-center space-x-3">
            {memoizedNavItems.map((item) => (
              <DesktopNavItem 
                key={item.href}
                item={item}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            ))}
            
            <CurrencySelector />
            
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : user ? (
              <UserDropdown user={user} onLogout={logout} />
            ) : (
              <Link href="/sign-on">
                <Button className="text-white text-sm transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg active:shadow-sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

