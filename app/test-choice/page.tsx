'use client'

import { Button } from "@/components/ui/button"
import { useInitialChoice } from "@/hooks/useInitialChoice"

export default function TestChoicePage() {
  const { userChoice, clearChoice } = useInitialChoice()

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">Página de Prueba - Elección Inicial</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Estado Actual</h2>
          <p className="text-gray-600 mb-4">
            Elección actual: <span className="font-semibold text-blue-600">{userChoice || 'Ninguna'}</span>
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={clearChoice}
              variant="outline"
              className="w-full"
            >
              Limpiar elección y mostrar modal
            </Button>
            
            <Button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('maintech-choice')
                  window.location.reload()
                }
              }}
              className="w-full"
            >
              Recargar página
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Esta página te permite probar la funcionalidad del modal de elección inicial.</p>
          <p>Usa el botón "Limpiar elección" para simular la primera visita.</p>
        </div>
      </div>
    </div>
  )
}
