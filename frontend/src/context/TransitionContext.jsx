import { createContext, useContext, useState } from 'react'

const TransitionContext = createContext(null)

export function TransitionProvider({ children }) {
  const [direction, setDirection] = useState(null)
  return (
    <TransitionContext.Provider value={{ direction, setDirection }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function usePageTransition() {
  return useContext(TransitionContext)
}
