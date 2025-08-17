'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'

interface InitialChoiceModalProps {
  onChoiceMade: (choice: 'academy' | 'solutions') => void
}

export default function InitialChoiceModal({ onChoiceMade }: InitialChoiceModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Mostrar el modal después de un pequeño delay para mejor UX
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleChoice = async (choice: 'academy' | 'solutions') => {
    setIsLoading(true)
    
    // Simular un pequeño delay para la transición
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Notificar al componente padre para guardar en sessionStorage
    onChoiceMade(choice)
    
    // Redirigir según la elección
    if (choice === 'academy') {
      router.push('/')
    } else {
      router.push('/solutions')
    }
    
    setIsVisible(false)
    setIsLoading(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl mx-4 overflow-hidden rounded-2xl shadow-2xl"
          >
            {/* Degradado sutil de fondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
            
            {/* Contenido del modal */}
            <div className="relative p-8 md:p-12 text-center">
              {/* Logo */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Image
                  src="/logo 1.png"
                  alt="Maintech Logo"
                  width={200}
                  height={80}
                  className="mx-auto"
                />
              </motion.div>

              {/* Título principal */}
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              >
                Bienvenido a Maintech
              </motion.h1>
              
              {/* Subtítulo */}
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
              >
                Selecciona la experiencia que mejor se adapte a tus necesidades
              </motion.p>

              {/* Opciones */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Solutions - Primera opción */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => handleChoice('solutions')}
                  disabled={isLoading}
                  className="group relative p-6 md:p-8 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-pink-300 transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="w-32 h-32 md:w-36 md:h-36 mx-auto mb-6 bg-[#DEC575] rounded-full flex flex-col items-center justify-center text-black font-bold text-center leading-none">
                      <span className="text-xl md:text-2xl font-normal">Maintech</span>
                      <span className="text-xl md:text-2xl font-bold">Solutions</span>
                    </div>
                    
                    <p className="hidden md:block text-gray-600 text-sm leading-relaxed px-2">
                      Descubre nuestras soluciones empresariales y servicios de consultoría 
                      para optimizar tu operación industrial
                    </p>
                  </div>
                </motion.button>

                {/* Maintech Academy - Segunda opción */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => handleChoice('academy')}
                  disabled={isLoading}
                  className="group relative p-6 md:p-8 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="w-32 h-32 md:w-36 md:h-36 mx-auto mb-6 bg-[#210075] rounded-full flex flex-col items-center justify-center text-white font-bold text-center leading-none">
                      <span className="text-xl md:text-2xl font-normal">Maintech</span>
                      <span className="text-xl md:text-2xl font-bold">Academy</span>
                    </div>
                    
                    <p className="hidden md:block text-gray-600 text-sm leading-relaxed px-2 -mt-2">
                      Accede a nuestra plataforma de cursos especializados en mantenimiento industrial, 
                      gestión de activos e Industria 4.0
                    </p>
                  </div>
                </motion.button>
              </div>

              {/* Texto adicional */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
