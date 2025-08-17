import { useState, useEffect } from 'react'

export type UserChoice = 'academy' | 'solutions' | null

export function useInitialChoice() {
  const [userChoice, setUserChoice] = useState<UserChoice>(null)
  const [hasShownModal, setHasShownModal] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Verificar sessionStorage solo en el cliente
    const storedChoice = sessionStorage.getItem('maintech-choice') as UserChoice
    if (storedChoice) {
      setUserChoice(storedChoice)
      setHasShownModal(false)
    } else {
      setHasShownModal(true)
    }
  }, [])

  const setChoice = (choice: 'academy' | 'solutions') => {
    setUserChoice(choice)
    setHasShownModal(false)
    if (isClient) {
      sessionStorage.setItem('maintech-choice', choice)
    }
  }

  const clearChoice = () => {
    setUserChoice(null)
    setHasShownModal(true)
    if (isClient) {
      sessionStorage.removeItem('maintech-choice')
    }
  }

  return {
    userChoice,
    hasShownModal,
    setChoice,
    clearChoice,
    isClient
  }
}
