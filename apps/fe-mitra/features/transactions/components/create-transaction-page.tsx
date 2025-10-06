'use client'

import { useStepStore } from '../store/step-store'
import ScanMember from './scan-member'
import SelectItems from './select-items'
import TransactionForm from './transaction-form'

const CreateTransaction = () => {
  const { step } = useStepStore()
  switch (step) {
    case 'select-items':
      return <SelectItems />
    case 'scan-member':
      return <ScanMember />
    case 'finalization':
      return <TransactionForm />
  }
}

export default CreateTransaction
