import { Modal } from '@/components/feedback'

import { TransactionForm } from './TransactionForm'
import { useCreateTransaction } from '../hooks/useCreateTransaction'
import { useUpdateTransaction } from '../hooks/useUpdateTransaction'
import type { CreateTransactionPayload, Transaction } from '../types'

interface TransactionModalProps {
  isOpen: boolean
  /** When provided, the form is pre-filled for editing. Null = create mode. */
  editingTransaction: Transaction | null
  onClose: () => void
}

/**
 * Owns the mutation logic so TransactionForm stays free of network concerns.
 * Closes the modal automatically on success.
 */
export function TransactionModal({ isOpen, editingTransaction, onClose }: TransactionModalProps) {
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const isEditing = editingTransaction !== null
  const activeMutation = isEditing ? updateMutation : createMutation
  const isSubmitting = activeMutation.isPending
  const submitError = activeMutation.isError
    ? 'Ocorreu um erro. Verifique os dados e tente novamente.'
    : null

  function handleSubmit(payload: CreateTransactionPayload) {
    if (isEditing) {
      updateMutation.mutate({ ...payload, id: editingTransaction.id }, { onSuccess: onClose })
    } else {
      createMutation.mutate(payload, { onSuccess: onClose })
    }
  }

  function handleClose() {
    if (!isSubmitting) {
      createMutation.reset()
      updateMutation.reset()
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Editar transação' : 'Nova transação'}
    >
      <TransactionForm
        initialValues={editingTransaction ?? undefined}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Modal>
  )
}
