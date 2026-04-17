import { Modal } from '@/components/feedback'

import { useCreateOperation } from '../hooks/useCreateOperation'
import { useUpdateOperation } from '../hooks/useUpdateOperation'
import type { CreateOperationPayload, Operation } from '../types'
import { OperationForm } from './OperationForm'

interface OperationModalProps {
  isOpen: boolean
  /** When provided, the form is pre-filled for editing. Null = create mode. */
  editingOperation: Operation | null
  onClose: () => void
}

/**
 * Owns mutation logic so OperationForm stays free of network concerns.
 * Closes automatically on success. Resets mutation state on manual close.
 */
export function OperationModal({ isOpen, editingOperation, onClose }: OperationModalProps) {
  const createMutation = useCreateOperation()
  const updateMutation = useUpdateOperation()

  const isEditing = editingOperation !== null
  const activeMutation = isEditing ? updateMutation : createMutation
  const isSubmitting = activeMutation.isPending
  const submitError = activeMutation.isError
    ? 'Ocorreu um erro ao salvar. Verifique os dados e tente novamente.'
    : null

  function handleSubmit(payload: CreateOperationPayload) {
    if (isEditing) {
      updateMutation.mutate({ ...payload, id: editingOperation.id }, { onSuccess: onClose })
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
      title={isEditing ? 'Editar operação' : 'Nova operação'}
    >
      <OperationForm
        initialValues={editingOperation ?? undefined}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Modal>
  )
}
