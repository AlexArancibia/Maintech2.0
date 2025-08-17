'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { useCurrency } from '@/hooks/CurrencyContext'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()
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

  const toggleDropdown = () => setIsOpen(!isOpen)

  const currencies = [
    {
      code: 'PEN',
      name: 'Soles Peruanos',
      flag: '🇵🇪',
      symbol: 'S/'
    },
    {
      code: 'USD',
      name: 'Dólares Estadounidenses',
      flag: '🇺🇸',
      symbol: '$'
    }
  ]

  const currentCurrency = currencies.find(c => c.code === currency)

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        className="flex items-center space-x-0 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
      >
        <span className="text-lg">{currentCurrency?.flag}</span>
        <span className="text-sm font-medium text-gray-700">
          {currentCurrency?.code}
        </span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {currencies.map((curr) => (
              <Button
                key={curr.code}
                variant="ghost"
                onClick={() => {
                  setCurrency(curr.code as 'PEN' | 'USD')
                  setIsOpen(false)
                }}
                className={`w-full justify-start px-4 py-2 text-sm hover:bg-gray-50 ${
                  currency === curr.code 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg mr-3">{curr.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{curr.code}</span>
                  <span className="text-xs text-gray-500">{curr.name}</span>
                </div>
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
