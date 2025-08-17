'use client'

import { useInitialChoice } from "@/hooks/useInitialChoice"
import InitialChoiceModal from "./InitialChoiceModal"

export default function InitialChoiceProvider() {
  const { hasShownModal, setChoice } = useInitialChoice()
  
  if (!hasShownModal) return null
  
  return <InitialChoiceModal onChoiceMade={setChoice} />
}
