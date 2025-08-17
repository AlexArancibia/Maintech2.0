'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Currency = 'PEN' | 'USD'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (pricePEN: number, priceUSD: number) => string
  getDisplayPrice: (pricePEN: number, priceUSD: number) => number
  getCurrencySymbol: () => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('PEN')

  // Cargar preferencia guardada al inicializar
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency') as Currency
    if (savedCurrency && (savedCurrency === 'PEN' || savedCurrency === 'USD')) {
      setCurrency(savedCurrency)
    }
  }, [])

  // Guardar preferencia cuando cambie
  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem('preferredCurrency', newCurrency)
  }

  // Formatear precio según la moneda seleccionada
  const formatPrice = (pricePEN: number, priceUSD: number) => {
    if (currency === 'USD') {
      return `$${priceUSD.toFixed(2)}`
    }
    return `S/ ${pricePEN.toFixed(2)}`
  }

  // Obtener precio para mostrar según la moneda seleccionada
  const getDisplayPrice = (pricePEN: number, priceUSD: number) => {
    return currency === 'USD' ? priceUSD : pricePEN
  }

  // Obtener símbolo de la moneda actual
  const getCurrencySymbol = () => {
    return currency === 'USD' ? '$' : 'S/'
  }

  const value: CurrencyContextType = {
    currency,
    setCurrency: handleSetCurrency,
    formatPrice,
    getDisplayPrice,
    getCurrencySymbol
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
