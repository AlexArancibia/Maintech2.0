'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ChevronDown, LogOut, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { User } from '@/types/StudentType'
import { motion, AnimatePresence } from 'motion/react'

interface UserDropdownProps {
  user: User
  onLogout: () => void
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Obtener iniciales del usuario
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Avatar className="w-8 h-8">
 
          <AvatarFallback className="bg-accent text-white text-sm font-medium">
            {getInitials(user.username || user.email)}
          </AvatarFallback>
        </Avatar>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* Header del usuario */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-accent text-white text-sm font-medium">
                    {getInitials(user.username || user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.username || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Opciones del menú */}
            <div className="py-1">
                              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  <GraduationCap className="w-4 h-4 mr-3 text-gray-500" />
                  Portal Estudiante
                </Button>
                </Link>
              
              <Button
                variant="ghost"
                onClick={() => {
                  onLogout()
                  setIsOpen(false)
                }}
                className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-3 text-gray-500" />
                Cerrar Sesión
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
