import { create } from 'zustand'

export type TransactionStep = 'select-items' | 'scan-member' | 'finalization'

interface StepState {
  step: TransactionStep
  setStep: (step: TransactionStep) => void
  resetStep: () => void
}

// Create the store
export const useStepStore = create<StepState>((set) => ({
  step: 'select-items',

  setStep: (step) => set({ step }),

  resetStep: () => set({ step: 'select-items' }),
}))
